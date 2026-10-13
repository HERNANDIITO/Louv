import { ElementRef, Injectable, OnDestroy } from "@angular/core";
import { MeshEntity } from "./subclasses/entities/EMesh.class";
import { mat3, mat4, quat, vec3 } from "gl-matrix";
import { TNode } from "./subclasses/utilities/TNode.class";
import { CameraEntity } from "./subclasses/entities/ECamera.class";
import { SkyboxEntity } from "./subclasses/entities/ESkybox.class";
import {
  AnimationEntity,
  Keyframe,
} from "./subclasses/entities/EAnimation.class";
import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  SpotLight,
  LightType,
  LightEntityBase,
} from "./subclasses/entities/ELight.class";
import { ShaderResource } from "./subclasses/resources/RShader.class";
import { CubemapResource } from "./subclasses/resources/RCubeMap.class";
import {
  ResourceManager,
  resourceType,
} from "./subclasses/utilities/ResourceManager.class";
import { RenderContext } from "./subclasses/utilities/RenderContext.class";
import { Picker } from "./subclasses/utilities/Picker.class";
import { EditJewelService } from "../../../services/editorServices/editJewel.service";

@Injectable({
  providedIn: "root",
})
export class FacadeWebgl implements OnDestroy {
  private _canvas!: HTMLCanvasElement;
  private _time = 0;

  private _rootNode!: TNode;
  private _baseNode!: TNode;
  private _skyboxNode!: TNode;
  private _settingsNodes: Map<number, TNode> = new Map();
  private _gemNodes: Map<string, TNode> = new Map();
  private _camera!: TNode;

  private _lightNodes: TNode[] = [];
  private _envMap!: CubemapResource;

  private _shadowShader!: ShaderResource;
  private _mainShadowLight!: TNode;

  private _picker: Picker = new Picker();
  private _pickingShader!: ShaderResource;
  private _firstMousePos = { x: 0, y: 0 };
  private _mouseMovementThreshold = 5;
  private _nodesToHighlight: TNode[] = [];
  private _outlineShader!: ShaderResource;

  // -------------- Variables de animación final --------------------
  private _finishCameraAnimation?: AnimationEntity;
  private _finishAnimations: AnimationEntity[] = [];
  private _finishOriginalTransforms: Map<
    TNode,
    { position: vec3; rotation: quat; scale: vec3 }
  > = new Map();
  private _finishAnimationActive = false;
  private _previousAutorotate = false;
  // ----------------------------------------------------------------
  private _animationFrameId: number | null = null;
  private _abortController = new AbortController();
  private _resizeHandler = () => this.onResize();

  private _theta = 0; // Ángulo horizontal
  private _phi = Math.PI / 2.5; // Ángulo vertical (inclinación)
  private _radius = 0.08; // Distancia (Zoom)

  // modo de órbita
  private _orbitMode: "camera" | "object" = "camera";
  private _orbitTarget?: TNode;

  // autorotación del objetivo
  private _autorotate = false;
  private _autorotateSpeed = 0.002; // rad/s aproximadamente
  private _lastUpdateTimestamp = 0;

  // control del ratón
  private _isDragging = false;

  static _gl: WebGL2RenderingContext;
  static _shaderResource: ShaderResource;

  constructor(private editJewelService: EditJewelService) {}

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  get rootNode(): TNode {
    return this._rootNode;
  }

  public async init(canvasArg: ElementRef<HTMLCanvasElement>) {
    this._canvas = canvasArg.nativeElement;

    // Forzar tamaño interno del canvas
    this._canvas.width = this._canvas.clientWidth || 800;
    this._canvas.height = this._canvas.clientHeight || 600;

    FacadeWebgl._gl = this._canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    })!;

    FacadeWebgl._gl.getExtension("OES_standard_derivatives");
    FacadeWebgl._gl.getExtension("OES_texture_float");
    FacadeWebgl._gl.getExtension("OES_texture_float_linear");

    FacadeWebgl._gl.bindVertexArray(null);
    FacadeWebgl._gl.bindBuffer(FacadeWebgl._gl.ARRAY_BUFFER, null);
    FacadeWebgl._gl.bindBuffer(FacadeWebgl._gl.ELEMENT_ARRAY_BUFFER, null);
    FacadeWebgl._gl.clearColor(0.0, 0.0, 0.0, 0.0);

    FacadeWebgl._gl.enable(FacadeWebgl._gl.DEPTH_TEST);
    FacadeWebgl._gl.depthFunc(FacadeWebgl._gl.LEQUAL);
    FacadeWebgl._gl.depthMask(true);

    FacadeWebgl._gl.enable(FacadeWebgl._gl.BLEND);
    FacadeWebgl._gl.blendEquation(FacadeWebgl._gl.FUNC_ADD);
    FacadeWebgl._gl.blendFunc(
      FacadeWebgl._gl.SRC_ALPHA,
      FacadeWebgl._gl.ONE_MINUS_SRC_ALPHA,
    );

    FacadeWebgl._gl.enable(FacadeWebgl._gl.CULL_FACE);
    FacadeWebgl._gl.cullFace(FacadeWebgl._gl.BACK);
    FacadeWebgl._gl.frontFace(FacadeWebgl._gl.CCW);
    FacadeWebgl._gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    this._rootNode = new TNode();

    this._picker.init(FacadeWebgl._gl, this._canvas.width, this._canvas.height);

    await this.initPickingShader();
    await this.initOutlineShader();
    await this.initShadowShader();
    // await this.initSkybox();

    this.cleanupListeners();
    this.initMouseControls();

    window.removeEventListener("resize", this._resizeHandler);
    window.addEventListener("resize", this._resizeHandler);

    this.onResize();
    this._lastUpdateTimestamp = performance.now();
  }

  public async initPickingShader() {
    const manager = ResourceManager.getInstance();
    this._pickingShader = manager.getResource(
      "picking",
      resourceType.shader,
    ) as ShaderResource;
    await this._pickingShader.loadResource("picking");
  }

  public async initOutlineShader() {
    const manager = ResourceManager.getInstance();
    this._outlineShader = manager.getResource(
      "outline",
      resourceType.shader,
    ) as ShaderResource;
    await this._outlineShader.loadResource("outline");
  }

  public async initShadowShader() {
    const manager = ResourceManager.getInstance();
    this._shadowShader = manager.getResource(
      "shadows",
      resourceType.shader,
    ) as ShaderResource;
    await this._shadowShader.loadResource("shadows");
  }

  public async initSkybox() {
    this._skyboxNode = new TNode(undefined, this._rootNode);
    const sky = new SkyboxEntity();
    await sky.loadShader();
    this._skyboxNode.entity = sky;
  }
  private initMouseControls() {
    const options = { signal: this._abortController.signal };

    // 1. MOUSE DOWN: Iniciar arrastre y guardar posición inicial
    this._canvas.addEventListener(
      "mousedown",
      (e) => {
        if (this._finishAnimationActive) return;

        this._isDragging = true;

        // Guardamos posición inicial para distinguir click de arrastre (Igual que ThreeJS)
        this._firstMousePos = { x: e.clientX, y: e.clientY };

        if (this._orbitMode === "camera" && this._camera) {
          // Sincronizamos el radio actual para evitar saltos
          const pos = this._camera.translation;
          this._radius = Math.sqrt(
            pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2],
          );
        }
      },
      options,
    );

    // 2. MOUSE UP: Finalizar arrastre y procesar SELECCIÓN (Picking)
    window.addEventListener(
      "mouseup",
      (e) => {
        if (this._finishAnimationActive) {
          this._isDragging = false;
          return;
        }

        // Calculamos la distancia recorrida (Igual que ThreeJS)
        const distance = Math.sqrt(
          Math.pow(e.clientX - this._firstMousePos.x, 2) +
            Math.pow(e.clientY - this._firstMousePos.y, 2),
        );

        // Si el ratón apenas se ha movido y el evento termina en el canvas, es un CLICK
        if (
          distance <= this._mouseMovementThreshold &&
          e.target === this._canvas
        ) {
          const rect = this._canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const node = this.doPicking(x, y);

          this.selectNode(node);
        }

        this._isDragging = false;
      },
      options,
    );

    // 3. MOUSE MOVE: Rotación de cámara u objeto
    window.addEventListener(
      "mousemove",
      (e) => {
        if (!this._isDragging || this._finishAnimationActive) return;

        if (this._orbitMode === "camera" && this._camera) {
          // Actualizamos los ángulos de la órbita de la cámara
          this._theta -= e.movementX * 0.005;
          this._phi -= e.movementY * 0.005;

          // limitar el ángulo vertical
          this._phi = Math.max(0.1, Math.min(Math.PI - 0.1, this._phi));

          // Convertir a coordenadas esféricas
          const x = this._radius * Math.sin(this._phi) * Math.sin(this._theta);
          const y = this._radius * Math.cos(this._phi);
          const z = this._radius * Math.sin(this._phi) * Math.cos(this._theta);

          this._camera.setTranslation(x, y, z);
        } else if (this._orbitMode === "object" && this._orbitTarget) {
          // horizontal mueve el objeto sobre Y
          const qy = quat.create();
          quat.setAxisAngle(qy, [0, 1, 0], e.movementX * 0.005);
          this._orbitTarget.rotate(qy[0], qy[1], qy[2], qy[3]);

          // vertical modifica la altura de la cámara alrededor del objeto
          if (this._camera) {
            this._phi -= e.movementY * 0.005;
            this._phi = Math.max(0.1, Math.min(Math.PI - 0.1, this._phi));
            const x =
              this._radius * Math.sin(this._phi) * Math.sin(this._theta);
            const y = this._radius * Math.cos(this._phi);
            const z =
              this._radius * Math.sin(this._phi) * Math.cos(this._theta);
            this._camera.setTranslation(x, y, z);
          }
        }
      },
      options,
    );

    // 4. WHEEL: Zoom personalizado (FOV / Distancia)
    this._canvas.addEventListener(
      "wheel",
      (e) => {
        if (this._finishAnimationActive) return;
        e.preventDefault();

        if (!this._camera) return;

        const delta = Math.sign(e.deltaY);
        const zoomFactor = delta > 0 ? 1.05 : 0.95;

        const currentPos = this._camera.translation;

        const newX = currentPos[0] * zoomFactor;
        const newY = currentPos[1] * zoomFactor;
        const newZ = currentPos[2] * zoomFactor;

        const distance = Math.sqrt(newX * newX + newY * newY + newZ * newZ);

        const MIN_DIST = 0.03; // 3cm
        const MAX_DIST = 0.25; // 25cm

        if (distance > MIN_DIST && distance < MAX_DIST) {
          this._camera.setTranslation(newX, newY, newZ);
          this._radius = distance; // Sincronizamos el radio para que la rotación sea fluida
        }
      },
      { ...options, passive: false },
    );
  }

  private doPicking(x: number, y: number): TNode | null {
    const gl = FacadeWebgl._gl;

    const context = this._prepareRenderContext();
    context.isPickingPass = true;
    context.pickingShader = this._pickingShader;

    gl.bindFramebuffer(gl.FRAMEBUFFER, (this._picker as any)._fbo);
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.renderNodeForPicking(this._rootNode, context, 0);

    // El picker devuelve el TNode asociado al color detectado en el pixel
    const result = this._picker.pick(gl, x, y);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    context.isPickingPass = false;

    return result;
  }

  private renderNodeForPicking(
    node: TNode,
    context: RenderContext,
    inheritedId: number = 0,
  ) {
    let effectiveId = inheritedId;

    if (node.isPickingRoot && node.pickingId > 0) {
      effectiveId = node.pickingId;
    }

    if (node.entity && effectiveId > 0) {
      context.pickingColor = this._picker.idToColor(effectiveId);
      node.entity.render(node.tmatrix, context);
    }

    const children = (node as any)._children as TNode[];
    for (const child of children) {
      this.renderNodeForPicking(child, context, effectiveId);
    }
  }

  private selectNode(node: TNode | null) {
    if (!node) {
      this._nodesToHighlight = [];

      this.editJewelService.selectObjectByUUID("error", "");
      this.editJewelService.selectGemByUUID("error", "");

      return;
    }

    this._nodesToHighlight = [];
    const nodeId = node.pickingId.toString();

    let isPatternGem = false;
    for (const [key, n] of this._gemNodes.entries()) {
      if (n === node) {
        const gemIndex = parseInt(key.split("_")[1]);
        if (gemIndex > 900) isPatternGem = true;
        break;
      }
    }

    if (isPatternGem) {
      this._gemNodes.forEach((n, key) => {
        const gemIndex = parseInt(key.split("_")[1]);
        if (gemIndex > 900) this._nodesToHighlight.push(n);
      });
    } else {
      this._nodesToHighlight.push(node);
    }

    const category = this.editJewelService.getCategoryByUUID(nodeId);
    if (category !== "error") {
      this.editJewelService.selectObjectByUUID(category, nodeId);
      this.editJewelService.selectGemByUUID(category, nodeId);
    }
  }

  public newNode(
    parent?: TNode,
    translate?: vec3,
    rotate?: quat,
    transform?: mat4,
  ): TNode {
    const node = new TNode(undefined, parent);

    if (translate)
      node.setTranslation(translate[0], translate[1], translate[2]);

    if (rotate) node.setRotation(rotate[0], rotate[1], rotate[2], rotate[3]);

    if (transform) node.setTransformationMatrix(transform);

    return node;
  }

  public setCamera(node: TNode) {
    this._camera = node;
    this.syncOrbitFromCamera();
  }

  /**
   * Decide en qué modo responde el ratón:
   * - "camera" (por defecto): orbita la cámara alrededor del origen
   * - "object" : rota el nodo que se haya registrado como target
   */
  public setOrbitMode(mode: "camera" | "object") {
    this._orbitMode = mode;
    // Si pasamos a modo objeto, calcular theta/phi/radio desde la cámara
    if (mode === "object") this.syncOrbitFromCamera();
  }

  /**
   * Nodo que se rotará cuando el modo sea "object".
   */
  public setOrbitTarget(node: TNode) {
    this._orbitTarget = node;
    // Cuando se establece un objetivo de órbita, sincronizamos para evitar saltos
    this.syncOrbitFromCamera();
  }

  /**
   * Calcula _radius, _phi y _theta a partir de la posición actual
   * de la cámara con respecto al orbitTarget (si existe) o al origen.
   * Esto evita que la primera interacción reubique bruscamente la cámara
   * al usar las variables de órbita por defecto.
   */
  private syncOrbitFromCamera() {
    if (!this._camera) return;

    const cam = this._camera.translation;
    const target = this._orbitTarget
      ? this._orbitTarget.translation
      : [0, 0, 0];

    const dx = cam[0] - target[0];
    const dy = cam[1] - target[1];
    const dz = cam[2] - target[2];

    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (r === 0) return;

    this._radius = r;
    // phi: ángulo desde el eje Y (tal como se usa en la fórmula directa)
    this._phi = Math.acos(dy / r);
    // theta: atan2(x, z) porque en la fórmula directa x = r*sin(phi)*sin(theta), z = r*sin(phi)*cos(theta)
    this._theta = Math.atan2(dx, dz);
  }

  /**
   * Habilita / deshabilita la rotación automática del target u ojo.
   * El comportamiento depende de _orbitMode: si es "camera" gira la cámara,
   * si es "object" gira el nodo objetivo.
   */
  public toggleAutoRotation(enable: boolean) {
    this._autorotate = enable;
  }

  public setAutoRotationSpeed(speed: number) {
    this._autorotateSpeed = speed;
  }

  public newCamera(node: TNode, isPerspective: boolean = false): TNode {
    const camera: CameraEntity = new CameraEntity(
      this._canvas.width / this._canvas.height,
      isPerspective,
    );
    node.entity = camera;

    return node;
  }

  public async setEnvMap(path: string) {
    const manager = ResourceManager.getInstance();
    this._envMap = manager.getResource(
      "envMap",
      resourceType.cubemap,
    ) as CubemapResource;
    await this._envMap.loadResource(path);
  }

  public setShadowLight(node: TNode) {
    this._mainShadowLight = node;
  }

  private _registerLight(node: TNode): void {
    if (!this._lightNodes.includes(node)) {
      this._lightNodes.push(node);
    }
  }

  public createAmbientLight(
    node: TNode,
    colorHex = 0xffffff,
    intensity = 0.1,
  ): TNode {
    const light = new AmbientLight(colorHex, intensity);
    node.entity = light;

    this._registerLight(node);
    return node;
  }

  public createDirectionalLight(
    node: TNode,
    colorHex = 0xffffff,
    intensity = 1.0,
  ): TNode {
    const light = new DirectionalLight(colorHex, intensity);
    node.entity = light;

    this._registerLight(node);
    return node;
  }

  public createPointLight(
    node: TNode,
    colorHex = 0xffffff,
    intensity = 1.0,
    distance = 0,
    decay = 2.0,
  ): TNode {
    const light = new PointLight(colorHex, intensity, distance, decay);
    node.entity = light;

    this._registerLight(node);
    return node;
  }

  public createSpotLight(
    node: TNode,
    colorHex = 0xffffff,
    intensity = 1.0,
    cut = 12.5,
    outer = 17.5,
    distance = 0,
    decay = 2.0,
  ): TNode {
    const light = new SpotLight(
      colorHex,
      intensity,
      cut,
      outer,
      distance,
      decay,
    );
    node.entity = light;

    this._registerLight(node);
    return node;
  }

  public async newMeshEntity(node: TNode, name: string) {
    const meshEntity: MeshEntity = new MeshEntity(name);
    await meshEntity.loadResource(name);
    const oldEntity = node.entity;

    node.entity = meshEntity;

    if (!node.pickingId) {
      node.pickingId = this._picker.registerNode(node);
    }

    if (oldEntity) {
      oldEntity.destroy();
    }

    return node;
  }

  public newAnimation(
    node: TNode,
    keyframes: Keyframe[],
    loop: boolean = true,
  ): AnimationEntity {
    const animation = new AnimationEntity(keyframes, loop);
    node.animation = animation;
    return animation;
  }

  public async newShader(name: string) {
    if (!FacadeWebgl._shaderResource) {
      const manager = ResourceManager.getInstance();
      FacadeWebgl._shaderResource = manager.getResource(
        name,
        resourceType.shader,
      ) as ShaderResource;
      await FacadeWebgl._shaderResource.loadResource(name);
    }
  }

  private calculatePlanarShadowMatrix(
    lightPos: vec3,
    groundNormal: vec3,
    groundPoint: vec3,
  ): mat4 {
    const a = groundNormal[0];
    const b = groundNormal[1];
    const c = groundNormal[2];
    const d = -vec3.dot(groundNormal, groundPoint);

    const dot = a * lightPos[0] + b * lightPos[1] + c * lightPos[2] + d;

    return mat4.fromValues(
      dot - lightPos[0] * a,
      -lightPos[1] * a,
      -lightPos[2] * a,
      -a,
      -lightPos[0] * b,
      dot - lightPos[1] * b,
      -lightPos[2] * b,
      -b,
      -lightPos[0] * c,
      -lightPos[1] * c,
      dot - lightPos[2] * c,
      -c,
      -lightPos[0] * d,
      -lightPos[1] * d,
      -lightPos[2] * d,
      dot - d,
    );
  }

  public update() {
    this._time += 0.01;
    // Calcular delta
    const now = performance.now();
    const deltaTime = this._lastUpdateTimestamp
      ? (now - this._lastUpdateTimestamp) / 1000
      : 0;
    this._lastUpdateTimestamp = now;

    if (this._autorotate) {
      const angle = this._autorotateSpeed;
      if (this._orbitMode === "camera" && this._camera) {
        this._theta += angle;
        const x = this._radius * Math.sin(this._phi) * Math.sin(this._theta);
        const y = this._radius * Math.cos(this._phi);
        const z = this._radius * Math.sin(this._phi) * Math.cos(this._theta);
        this._camera.setTranslation(x, y, z);
      } else if (this._orbitMode === "object" && this._orbitTarget) {
        const q = quat.create();
        quat.setAxisAngle(q, [0, 1, 0], angle);
        this._orbitTarget.rotate(q[0], q[1], q[2], q[3]);
      }
    }

    if (this._rootNode) {
      this._rootNode.update(deltaTime);
    }
  }

  // interface-webgl.class.ts

  // interface-webgl.class.ts

  public render() {
    const gl = FacadeWebgl._gl;
    if (!gl || !this._rootNode || !this._camera) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    const context = this._prepareRenderContext();

    this._rootNode.render(context);
    this.renderPlanarShadows(context);

    if (this._nodesToHighlight.length > 0) {
      gl.disable(gl.DEPTH_TEST);

      context.isOutlinePass = true;
      context.outlineShader = this._outlineShader;

      for (const node of this._nodesToHighlight) {
        if (node.entity) node.entity.render(node.tmatrix, context);
      }

      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.DEPTH_BUFFER_BIT);

      context.isOutlinePass = false;
      for (const node of this._nodesToHighlight) {
        node.render(context);
      }

      context.isOutlinePass = false;
    }
  }

  private renderPlanarShadows(context: RenderContext) {
    const gl = FacadeWebgl._gl;
    const shadowHeight = -0.0095;

    const isCameraBelowShadow = this._camera.translation[1] < shadowHeight;

    if (
      this._mainShadowLight &&
      this._shadowShader &&
      this._baseNode &&
      !isCameraBelowShadow
    ) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);

      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.EQUAL, 0, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(-1.0, -1.0);

      const lightPos = (
        this._mainShadowLight.entity as LightEntityBase
      ).extractPosition(this._mainShadowLight.tmatrix);

      context.isShadowPass = true;
      context.shadowShader = this._shadowShader;
      context.shadowMatrix = this.calculatePlanarShadowMatrix(
        lightPos,
        vec3.fromValues(0, 1, 0),
        vec3.fromValues(0, shadowHeight, 0),
      );

      this._baseNode.render(context);

      gl.disable(gl.STENCIL_TEST);
      gl.disable(gl.POLYGON_OFFSET_FILL);
      gl.depthMask(true);
      context.isShadowPass = false;
    }
  }

  private _prepareRenderContext(): RenderContext {
    const camNode = this._camera!;
    const camEntity = camNode.entity as CameraEntity;

    const worldMatrix = camNode.tmatrix;
    const worldPos = vec3.fromValues(
      worldMatrix[12],
      worldMatrix[13],
      worldMatrix[14],
    );

    const viewMatrix = mat4.create();

    mat4.lookAt(viewMatrix, worldPos, [0, 0, 0], [0, 1, 0]);

    const context = new RenderContext(
      viewMatrix,
      camEntity.getProjectionMatrix(),
      worldPos,
      this._envMap,
    );

    context.time = this._time;

    this._lightNodes.forEach((node) => {
      if (node.entity instanceof LightEntityBase) {
        context.addLight(node.entity, node.tmatrix);
      }
    });

    return context;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  public cleanup(): void {
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    this._picker.clear();

    this._lastUpdateTimestamp = 0;

    this.cleanupListeners();

    if (this._rootNode) {
      this._rootNode.clear();
      this._rootNode = null!;
    }

    if (this._settingsNodes) this._settingsNodes.clear();
    if (this._gemNodes) this._gemNodes.clear();

    this._lightNodes = [];

    this._camera = undefined!;
    this._orbitTarget = undefined!;
    this._baseNode = undefined!;
    this._mainShadowLight = undefined!;

    const manager = ResourceManager.getInstance();
    manager.deleteAllResources();

    this._envMap = undefined!;

    (FacadeWebgl as any)._shaderResource = null!;
    (FacadeWebgl as any)._gl = null!;
  }

  private cleanupListeners() {
    window.removeEventListener("resize", this._resizeHandler);
    this._abortController.abort();
    this._abortController = new AbortController();
  }

  public setAnimationFrameId(id: number) {
    this._animationFrameId = id;
  }

  public onResize() {
    if (!this._canvas || !this._camera) return;

    const width = this._canvas.clientWidth;
    const height = this._canvas.clientHeight;

    if (this._canvas.width !== width || this._canvas.height !== height) {
      this._canvas.width = width;
      this._canvas.height = height;

      FacadeWebgl._gl.viewport(0, 0, width, height);

      const aspect = width / height;
      const cameraEntity = this._camera.entity as CameraEntity;
      if (cameraEntity) {
        cameraEntity.resize(aspect);
      }
    }
  }

  public getMaterial(name: string) {}

  public async loadBaseStructure(path: string, materialName: string) {
    if (!this._baseNode) {
      this._baseNode = this.newNode(this._rootNode);
      this.setOrbitTarget(this._baseNode);
    }

    this._baseNode.isPickingRoot = true;
    if (!this._baseNode.pickingId) {
      this._baseNode.pickingId = this._picker.registerNode(this._baseNode);
    }
    this.editJewelService.changeBaseStructureUUID(
      this._baseNode.pickingId.toString(),
    );

    const currentEntity = this._baseNode.entity as MeshEntity;
    if (currentEntity && currentEntity.getModelPath() === path) {
      this.setStructureMaterial(materialName);
      return;
    }

    await this.newMeshEntity(this._baseNode, path);

    (this._baseNode.entity as MeshEntity).setModelPath(path);
    this.setStructureMaterial(materialName);
  }

  public async loadSetting(
    path: string,
    materialName: string,
    index: number,
    px: number,
    py: number,
    pz: number,
    rx: number,
    ry: number,
    rz: number,
    rw: number,
    scale: number,
  ) {
    if (!this._baseNode) return;

    let settingNode = this._settingsNodes.get(index);
    if (!settingNode) {
      settingNode = this.newNode(this._baseNode);
      this._settingsNodes.set(index, settingNode);
    }

    settingNode.isPickingRoot = true;
    if (!settingNode.pickingId) {
      settingNode.pickingId = this._picker.registerNode(settingNode);
    }
    this.editJewelService.changeSettingUUID(
      settingNode.pickingId.toString(),
      index,
    );

    const currentEntity = settingNode?.entity as MeshEntity;
    if (currentEntity) {
      if (currentEntity.getModelPath() !== path) {
        settingNode.clear();
        for (const key of this._gemNodes.keys()) {
          if (key.startsWith(`${index}_`)) this._gemNodes.delete(key);
        }
      } else {
        settingNode.setTranslation(px, py, pz);
        settingNode.setRotation(rx, ry, rz, rw);
        settingNode.setScale(scale, scale, scale);
        await currentEntity.setMaterial(materialName);
        return;
      }
    }

    if (!settingNode) {
      settingNode = this.newNode(this._baseNode);
      this._settingsNodes.set(index, settingNode);
    }

    settingNode.isPickingRoot = true;
    if (!settingNode.pickingId) {
      settingNode.pickingId = this._picker.registerNode(settingNode);
    }

    settingNode.setTranslation(px, py, pz);
    settingNode.setRotation(rx, ry, rz, rw);
    settingNode.setScale(scale, scale, scale);

    settingNode.isPickingRoot = true;
    if (!settingNode.pickingId) {
      settingNode.pickingId = this._picker.registerNode(settingNode);
    }

    this.editJewelService.changeSettingUUID(
      settingNode.pickingId.toString(),
      index,
    );

    await this.newMeshEntity(settingNode, path);
    const entity = settingNode.entity as MeshEntity;
    entity.setModelPath(path);

    await entity.setMaterial(materialName);
  }

  public async loadGemstone(
    path: string,
    materialName: string,
    settingIndex: number,
    index: number,
    px: number,
    py: number,
    pz: number,
    rx: number,
    ry: number,
    rz: number,
    rw: number,
    scale: number,
  ) {
    let settingNode = this._settingsNodes.get(settingIndex);
    if (!settingNode) return;

    let key = `${settingIndex}_${index}`;
    let gemNode = this._gemNodes.get(key);

    if (!gemNode) {
      gemNode = this.newNode(settingNode);
      this._gemNodes.set(key, gemNode);
    }

    gemNode.isPickingRoot = true;

    if (!gemNode.pickingId) {
      gemNode.pickingId = this._picker.registerNode(gemNode);
    }

    this.editJewelService.changeGemUUID(gemNode.pickingId.toString(), index);

    gemNode.setTranslation(px, py, pz);
    gemNode.setRotation(rx, ry, rz, rw);
    gemNode.setScale(scale, scale, scale);

    const currentEntity = gemNode.entity as MeshEntity;
    if (currentEntity && currentEntity.getModelPath() === path) {
      await currentEntity.setMaterial(materialName);
      return;
    }

    await this.newMeshEntity(gemNode, path);
    const entity = gemNode.entity as MeshEntity;
    entity.setModelPath(path);
    await entity.setMaterial(materialName);
  }

  // Cambia la posición del engaste y de su gema principal en consecuencia
  public setSettingPosition(setting: number, x: number, y: number, z: number) {
    let settingNode = this._settingsNodes.get(setting);
    settingNode?.setTranslation(x, y, z);
  }

  // Cambia la rotación del engaste y de su gema principal en consecuencia
  public setSettingRotation(
    setting: number,
    x: number,
    y: number,
    z: number,
    w: number,
  ) {
    let settingNode = this._settingsNodes.get(setting);
    settingNode?.setRotation(x, y, z, w);
  }

  // Cambia la escala del engaste y de su gema principal en consecuencia
  public setSettingScale(setting: number, scale: number) {
    let settingNode = this._settingsNodes.get(setting);
    settingNode?.setScale(scale, scale, scale);
  }

  public async setStructureMaterial(materialName: string) {
    const promises: Promise<void>[] = [];

    if (this._baseNode && this._baseNode.entity instanceof MeshEntity) {
      promises.push(this._baseNode.entity.setMaterial(materialName));
    }

    this._settingsNodes.forEach((node) => {
      if (node.entity instanceof MeshEntity) {
        promises.push(node.entity.setMaterial(materialName));
      }
    });

    await Promise.all(promises);
  }

  public async setGemstoneMaterial(
    materialName: string,
    settingIndex: number,
    gemstoneIndex: number,
  ) {
    const key = `${settingIndex}_${gemstoneIndex}`;
    const gemNode = this._gemNodes.get(key);

    if (!gemNode) {
      return;
    }

    const entity = gemNode.entity as MeshEntity;
    if (entity instanceof MeshEntity) {
      await entity.setMaterial(materialName);
    }
  }

  public async resetRingLayout() {}

  public removeSetting(setting: number) {
    let settingNode = this._settingsNodes.get(setting);
    if (settingNode) {
      this._rootNode.removeDescendant(settingNode);
      this._settingsNodes.delete(setting);

      for (const key of this._gemNodes.keys()) {
        if (key.startsWith(`${setting}_`)) this._gemNodes.delete(key);
      }
    }
  }

  public removeAllSettings() {
    if (this._settingsNodes && this._baseNode) {
      this._settingsNodes.forEach((node) => {
        // Eliminar el engaste de su padre
        this._baseNode?.removeChild(node);
        node.clear();
      });
      this._settingsNodes.clear();
      this._gemNodes.clear();
    }
  }

  // -------------------------------------------------- CAPTURAS --------------------------------------------------
  public getOptimizedScreenshot(size: number = 300): string {
    this._nodesToHighlight = [];
    const gl = FacadeWebgl._gl;
    if (!gl || !this._camera || !this._baseNode) return "";

    // GUARDAR ESTADO ACTUAL (Para restaurar después)
    const originalWidth = this._canvas.width;
    const originalHeight = this._canvas.height;

    const cameraEntity = this._camera.entity as CameraEntity;
    const originalAspect = cameraEntity.getAspect();
    const originalCamPos = vec3.clone(this._camera.translation);

    // Guardamos transformaciones del nodo base (el anillo)
    const originalBaseRot = quat.clone(this._baseNode.rotation);
    const originalBaseScale = vec3.clone(this._baseNode.scaling);
    const originalBasePos = vec3.clone(this._baseNode.translation);

    const originalShadowLight = this._mainShadowLight;

    // CONFIGURACIÓN PARA LA FOTO
    const PHOTO_RENDER_SIZE = 1024;
    const PHOTO_CAM_POS = vec3.fromValues(0.036, 0.042, 0.03);

    this._canvas.width = PHOTO_RENDER_SIZE;
    this._canvas.height = PHOTO_RENDER_SIZE;
    gl.viewport(0, 0, PHOTO_RENDER_SIZE, PHOTO_RENDER_SIZE);

    // Forzar cámara en modo foto
    cameraEntity.resize(1);
    this._camera.setTranslation(
      PHOTO_CAM_POS[0],
      PHOTO_CAM_POS[1],
      PHOTO_CAM_POS[2],
    );

    this._baseNode.setRotation(0, 0, 0, 1);
    this._baseNode.setScale(1, 1, 1);
    this._baseNode.setTranslation(0, 0, 0); // Asegurar que está en el origen

    this._mainShadowLight = null!;

    // Forzamos un update manual de matrices antes de renderizar
    this.render();

    // CAPTURAR Y REDIMENSIONAR
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const ctx = offscreenCanvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        this._canvas,
        0,
        0,
        PHOTO_RENDER_SIZE,
        PHOTO_RENDER_SIZE,
        0,
        0,
        size,
        size,
      );
    }

    const dataUrl = offscreenCanvas.toDataURL("image/png");

    // RESTAURAR ESTADO ORIGINAL
    this._canvas.width = originalWidth;
    this._canvas.height = originalHeight;
    gl.viewport(0, 0, originalWidth, originalHeight);

    this._camera.setTranslation(
      originalCamPos[0],
      originalCamPos[1],
      originalCamPos[2],
    );
    cameraEntity.resize(originalAspect);

    this._baseNode.setRotation(
      originalBaseRot[0],
      originalBaseRot[1],
      originalBaseRot[2],
      originalBaseRot[3],
    );
    this._baseNode.setScale(
      originalBaseScale[0],
      originalBaseScale[1],
      originalBaseScale[2],
    );
    this._baseNode.setTranslation(
      originalBasePos[0],
      originalBasePos[1],
      originalBasePos[2],
    );

    this._mainShadowLight = originalShadowLight;

    // Renderizar de nuevo para que el usuario no vea el "salto" visual
    this.render();

    return dataUrl;
  }

  // -------------------------------------------------- ANIMACIONES --------------------------------------------------
  public playSceneAnimation(): void {
    if (this._finishAnimationActive) return;

    this._previousAutorotate = this._autorotate;
    this._autorotate = false;

    this.buildFinishAnimations();

    // Empezar la reproducción
    this._finishCameraAnimation?.play();
    this._finishAnimations.forEach((animation) => animation.play());
    this._finishAnimationActive = true;
  }

  public stopSceneAnimation(): void {
    this._finishAnimationActive = false;

    // Pausar y limpiar array de animaciones
    if (this._finishCameraAnimation) {
      this._finishCameraAnimation.destroy();
    }
    this._finishAnimations.forEach((a) => a.destroy());
    this._finishAnimations = [];

    // ----------------------------------------------------
    //      Limpiar asignaciones animation en los nodos
    // ----------------------------------------------------
    this._baseNode.animation = undefined;
    this._settingsNodes.forEach((n) => (n.animation = undefined));
    this._gemNodes.forEach((n) => (n.animation = undefined));
    this._camera.animation = undefined;

    // ----------------------------------------------------
    //        Restaurar transformaciones originales
    // ----------------------------------------------------

    // Deshacer pivote
    if (
      this._camera &&
      this._camera.parent &&
      this._camera.parent !== this._rootNode
    ) {
      const pivot = this._camera.parent;
      pivot.removeChild(this._camera);
      this._rootNode.addChild(this._camera);
      this._rootNode.removeChild(pivot);
    }

    // Restaurar tranformaciones originales
    this._autorotate = this._previousAutorotate;
    this._finishOriginalTransforms.forEach((transform, node) => {
      if (node) {
        node.setTranslation(
          transform.position[0],
          transform.position[1],
          transform.position[2],
        );
        node.setRotation(
          transform.rotation[0],
          transform.rotation[1],
          transform.rotation[2],
          transform.rotation[3],
        );
        node.setScale(
          transform.scale[0],
          transform.scale[1],
          transform.scale[2],
        );
      }
    });
    this._finishOriginalTransforms.clear();
    this.syncOrbitFromCamera();

    this.render();
  }

  private buildFinishAnimations(): void {
    this.stopSceneAnimation();

    this._finishAnimationActive = true;
    this._finishAnimations = [];
    this._finishOriginalTransforms.clear();

    if (!this._camera || !this._baseNode) return;

    // ----------------------------------------------------
    //              GUARDAR ESTADOS ORIGINALES
    // ----------------------------------------------------

    this._finishOriginalTransforms.set(this._camera, {
      position: vec3.clone(this._camera.translation),
      rotation: quat.clone(this._camera.rotation),
      scale: vec3.clone(this._camera.scaling),
    });

    this._finishOriginalTransforms.set(this._baseNode, {
      position: vec3.clone(this._baseNode.translation),
      rotation: quat.clone(this._baseNode.rotation),
      scale: vec3.clone(this._baseNode.scaling),
    });

    const allNodesToAnimate = [
      ...this._settingsNodes.values(),
      ...this._gemNodes.values(),
    ];
    allNodesToAnimate.forEach((node) => {
      this._finishOriginalTransforms.set(node, {
        position: vec3.clone(node.translation),
        rotation: quat.clone(node.rotation),
        scale: vec3.clone(node.scaling),
      });
    });

    // ----------------------------------------------------
    //                  CÁMARA Y PIVOTE
    // ----------------------------------------------------
    this._autorotate = false;
    this._camera.setTranslation(0, 0.05, 0.18);
    this._camera.setRotation(0, 0, 0, 1);

    // Setup del pivote
    const cameraPivot = this.newNode(this._rootNode);
    this._camera.parent?.removeChild(this._camera);
    cameraPivot.addChild(this._camera);

    // Giro del pivote de la cámara 360
    const getPivotQ = (deg: number) =>
      quat.setAxisAngle(quat.create(), [0, 1, 0], (deg * Math.PI) / 180);
    const pivotAnim = this.newAnimation(
      cameraPivot,
      [
        { time: 0, rotation: getPivotQ(70) },
        { time: 9, rotation: getPivotQ(250) },
        { time: 18, rotation: getPivotQ(430) },
      ],
      false,
    );
    this._finishAnimations.push(pivotAnim);

    // Desplazamineto de cámara (además del giro que le provoca el pivote)
    const cameraMoveAnim = this.newAnimation(
      this._camera,
      [
        { time: 0, position: vec3.fromValues(0, 0.05, 0.18) },
        { time: 6, position: vec3.fromValues(0, 0.04, 0.08) },
        { time: 9, position: vec3.fromValues(0, 0.06, 0.08) },
        { time: 12, position: vec3.fromValues(0, 0.08, 0.06) },
        { time: 15, position: vec3.fromValues(0, 0.07, 0.06) },
        { time: 18, position: vec3.fromValues(0, 0.05, 0.07) },
      ],
      false,
    );
    this._finishAnimations.push(cameraMoveAnim);
    this._finishCameraAnimation = cameraMoveAnim;

    // ----------------------------------------------------
    //                        BASE
    // ----------------------------------------------------
    const identity = quat.create();
    this._baseNode.setRotation(
      identity[0],
      identity[1],
      identity[2],
      identity[3],
    );
    // ----------------------------------------------------
    //                  GEMAS Y ENGASTES
    // ----------------------------------------------------
    let sIdx = 0;
    const totalSettings = this._settingsNodes.size;

    // Parámetros de los ENGASTES
    const staggerDelaySettings = 0.5; // Tiempo entre cada engaste
    const travelDurationSetting = 2.8; // Cuánto tarda en caer el metal
    const globalStart = 5.0; // Inicio de la fase 1

    // Parámetros de las GEMAS
    const staggerDelayGems = 0.4; // Tiempo entre cada gema
    const pauseBetweenPhases = 0.5; // Pequeño respiro entre metales y gemas

    // Ultimo engaste: Inicio + (retraso del último) + duración de caída
    const allSettingsDoneTime =
      globalStart +
      (totalSettings - 1) * staggerDelaySettings +
      travelDurationSetting;

    this._settingsNodes.forEach((settingNode, settingKey) => {
      const origS = this._finishOriginalTransforms.get(settingNode)!;

      // Trayectoria del engaste
      const angleRad = Math.atan2(origS.position[1], origS.position[2]);
      const ejeRadial = vec3.fromValues(
        0,
        Math.sin(angleRad),
        Math.cos(angleRad),
      );
      const startPosS = vec3.create();
      vec3.scaleAndAdd(startPosS, origS.position, ejeRadial, 1);
      startPosS[1] += 1;

      const startTimeS = globalStart + sIdx * staggerDelaySettings;

      // --- Animación engaste ---

      // Movimiento sea suave al final
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const steps = 25; // Más pasos = mayor suavidad
      const settingKeyframes = [];

      // invisible y arriba
      settingKeyframes.push({
        time: 0,
        position: startPosS,
        scale: vec3.fromValues(0, 0, 0),
      });

      // Generar el trayecto directo pero suavizado
      for (let i = 0; i <= steps; i++) {
        const t = i / steps; // Tiempo lineal (0 a 1)
        const easedT = easeOutCubic(t); // Aplicamos el Easing al tiempo

        // Interpolación lineal entre start y end, pero basada en easedT
        const currentPos = vec3.create();
        vec3.lerp(currentPos, startPosS, origS.position, easedT);

        // Interpolación de escala (crece mientras se mueve)
        const currentScale = vec3.create();
        vec3.lerp(currentScale, vec3.fromValues(0, 0, 0), origS.scale, easedT);

        settingKeyframes.push({
          time: startTimeS + t * travelDurationSetting, // El tiempo sigue siendo lineal
          position: currentPos,
          scale: currentScale,
        });
      }

      this._finishAnimations.push(
        this.newAnimation(settingNode, settingKeyframes, false),
      );

      // --- Animación gemas ---

      // Buscamos y ordenamos las gemas de este engaste específico
      const gemsOfThisSetting = Array.from(this._gemNodes.entries())
        .filter(([gKey]) => gKey.startsWith(`${settingKey}_`))
        .sort((a, b) => {
          const idA = parseInt(a[0].split("_")[1]);
          const idB = parseInt(b[0].split("_")[1]);
          return idA - idB; // Esto pone la gema 0 primero, luego la 1000, 1001...
        });

      // Parámetros de la cascada interna
      const subStaggerDelay = 0.12; // Tiempo entre la caída de cada gema del patrón
      const baseStartTimeG =
        allSettingsDoneTime + pauseBetweenPhases + sIdx * staggerDelayGems;

      gemsOfThisSetting.forEach(([gKey, gemNode], gemSubIdx) => {
        const origG = this._finishOriginalTransforms.get(gemNode)!;

        if (quat.length(origG.rotation) < 0.1) quat.identity(origG.rotation);

        const localHighPos = vec3.clone(origG.position);

        if (gemSubIdx > 900)
          // Para las gemas de patron las posicionamos desde más arriba porque en algunos casos todavia se ven
          localHighPos[1] += 0.2; // en las principales las dejamos así porque sino no realizan los giros
        else localHighPos[1] += 0.05;

        // Tiempo base del engaste + su posición en la cascada
        const startTimeG = baseStartTimeG + gemSubIdx * subStaggerDelay;
        const duration = gemSubIdx > 900 ? 2.5 : 1.5;

        const gemKeyframes = [];

        // La gema se queda en su sitio real del anillo, pero con escala 0. Evita que se vea un salto inical.
        gemKeyframes.push({
          time: 0,
          position: vec3.clone(origG.position),
          scale: vec3.fromValues(0, 0, 0),
          rotation: quat.clone(origG.rotation),
        });

        // Justo un instante antes de que el metal empiece a moverse (startTimeS), la gema sigue invisible en su sitio original.
        gemKeyframes.push({
          time: startTimeS - 0.01,
          position: vec3.clone(origG.position),
          scale: vec3.fromValues(0, 0, 0),
          rotation: quat.clone(origG.rotation),
        });

        // En el instante startTimeS, la gema salta a la posición alta y escala a 1.
        gemKeyframes.push({
          time: startTimeS,
          position: localHighPos,
          scale: vec3.fromValues(0, 0, 0),
          rotation: quat.clone(origG.rotation),
        });

        // espera volando (mientras el metal cae):
        gemKeyframes.push({
          time: startTimeG,
          position: localHighPos,
          scale: vec3.clone(origG.scale),
          rotation: quat.clone(origG.rotation),
        });

        // Generar las vueltas mientras cae
        const vueltas = 2;
        const totalPasos = 25;

        for (let i = 1; i <= totalPasos; i++) {
          const f = i / totalPasos;
          const time = startTimeG + f * duration;
          const angle = f * Math.PI * 2 * vueltas;

          const currentPos = vec3.lerp(
            vec3.create(),
            localHighPos,
            origG.position,
            f,
          );
          const spinQuat = quat.setAxisAngle(quat.create(), [0, 1, 0], angle);
          const combinedQuat = quat.multiply(
            quat.create(),
            origG.rotation,
            spinQuat,
          );
          quat.normalize(combinedQuat, combinedQuat);

          gemKeyframes.push({
            time: time,
            position: currentPos,
            rotation: combinedQuat,
            scale: vec3.clone(origG.scale),
          });
        }

        this._finishAnimations.push(
          this.newAnimation(gemNode, gemKeyframes, false),
        );
      });

      sIdx++;
    });

    // ----------------------------------------------------
    //                  CÁMARA FINAL LOOP
    // ----------------------------------------------------
    this._finishCameraAnimation.onComplete = () => {
      if (!this._finishAnimationActive) return;

      const qStart = quat.clone(this._baseNode.rotation);
      const q1 = quat.rotateY(quat.create(), qStart, -Math.PI * 0.66);
      const q2 = quat.rotateY(quat.create(), qStart, -Math.PI * 1.33);
      const q3 = quat.rotateY(quat.create(), qStart, -Math.PI * 2);

      const infiniteAnim = this.newAnimation(
        this._baseNode,
        [
          { time: 0, rotation: qStart },
          { time: 5, rotation: q1 },
          { time: 10, rotation: q2 },
          { time: 15, rotation: q3 },
        ],
        true,
      );

      this._baseNode.animation = infiniteAnim;
      infiniteAnim.play(); // este play debe ir aqui si o si porque depende de onComplete
    };
  }
}
