import { ElementRef, Injectable, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlinePass } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { FXAAShader } from 'three/examples/jsm/Addons.js';
import { Ring } from './subclasses/ring.class';
import { MaterialDefinition } from '../../../interfaces/threejs/materialDefinition.interface';
import { presets } from '../../../../../public/materials/material_presets_threejs';
import { MaterialTextures } from '../../../interfaces/threejs/materialTextures.interface';
import { StandardOptions } from '../../../interfaces/threejs/standardOptions.interface';
import { PhongOptions } from '../../../interfaces/threejs/phongOptions.interface';
import { PhysicalOptions } from '../../../interfaces/threejs/physicalOptions.interface';
import { Setting } from './subclasses/setting.class';
import { Gemstone } from './subclasses/gemstone.class';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { EditJewelService } from '../../../services/editorServices/editJewel.service';
import { MeshBVH, MeshBVHUniformStruct, BVHShaderGLSL, SAH } from 'three-mesh-bvh';
import { GemstoneBVHOptions } from '../../../interfaces/threejs/gemstoneBVHOptions.interface';
import { Box } from './subclasses/box.class';


@Injectable({
  providedIn: 'root'
})
export class FacadeThreejs implements OnDestroy {

  private frameId !: number;                                              // Para las animaciones, es un número que nos indica en qué frame estamos
  private canvas !: HTMLCanvasElement;                                    // Elemento en el que crearemos nuestra escena para poder mostrar cosas, hay quien no lo usa, pero en general todo el mundo usa un canvas, en el tutorial que mandé de 5 miniproyectos lo hacen de otra manera si tenéis curiosidad
  private scene !: THREE.Scene;                                           // Contenedor lógico de todos los elementos
  private renderer !: THREE.WebGLRenderer;                                // Engargado de dibujar la escena, funciona con WebGL 2, desde la versión r163 ya no es compatible con WebGL 1
  private camera !: THREE.PerspectiveCamera | THREE.OrthographicCamera;   // Captura la escena, en nuestro caso una cámara Perspectiva para tener una visión realista
  private light !: THREE.AmbientLight;                                    // Luz ambiental, ilumina todos los objetos uniformemente. No se puede usar para proyectar sombras al no tener dirección
  private pointLights: THREE.PointLight[] = [];                           // Luz puntual, ilumina en todas direcciones, pero tiene una ubicación concreta en el espacio 3D, si puede proyectar sombras
  private directionalLights: THREE.DirectionalLight[] = [];               // Luz direccional, ilumina en una dirección, pero tiene una ubicación concreta en el espacio 3D, si puede proyectar sombras
  private controls !: OrbitControls;                                      // OrbitControls, la camara orbita alrededor de un objetivo, en nuestro caso, la base del anillo. Clic Ixq -> rotar, rueda -> zoom, Clic der/ Clic Izq  + Ctrl -> paneo
  private modelLoader !: GLTFLoader;                                      // Cargador de los modelos 3D
  private textureLoader !: THREE.TextureLoader;                           // Cargador de texturas para las mallas
  private materialsRepository: Record<string, THREE.Material> = {};       // Mapa para almacenar todos los materiales por su nombre
  private envLoader !: THREE.CubeTextureLoader;                           // Cargador de la textura env (mapa cuadrado del fondo)
  private envMap !: THREE.CubeTexture;                                    // Mapa de entorno, habitación/ambiente que se proyecta sobre los objectos de la escena y afecta a la iluminación
  private ring !: Ring;                                                   // Anillo que edita el usuario
  private group !: THREE.Group;                                           // Grupo que controlará los giros que afectan a todos los objetos
  private environmentGroup !: THREE.Group;                                // Grupo que inluye las luces para girar conforme a la cámara
  private floorPlane !: THREE.Mesh;
  private composer !: EffectComposer;
  private renderPass !: RenderPass;
  private outlinePass !: OutlinePass;
  private effectFXAA !: ShaderPass;
  private MATERIAL_PRESETS: Record<string, MaterialDefinition> = presets;

  //variables para la animación automática en el editor
  private userInteracting = false;
  private autoRotationEnabled = true;                                    // Booleano para saber si el usuario está interactuando con el anillo
  private lastInteractionTime = 0;                                        //
  private readonly RESUME_DELAY = 1000;

  private firstMouseCoords: THREE.Vector2 = new THREE.Vector2();
  private lastMouseCoords: THREE.Vector2 = new THREE.Vector2();
  private mouseMovementThreshold: number = 5;
  private selectedObject?: THREE.Object3D[];
  private raycaster!: THREE.Raycaster;

  private onResizeRef = () => this.onResize();
  private onMouseDownRef = (e: MouseEvent) => this.onMouseDown(e as PointerEvent);
  private onMouseUpRef = (e: MouseEvent) => this.onMouseUp(e);
  private isDestroyed = false;
  private destroyController = new AbortController();

  //private diamondEnvTexture!: THREE.Texture;

  constructor(private ngZone: NgZone, private editJewelService: EditJewelService) {}

  // Usamos public para las funciones para que se puedan llamar desde el exterior
  // Si alguna función tuviesemenos muy claro que solo se usará aquí, se puede declarar private

  // Al ejecutarse fuera de las zonas de Angurlar en necesario detenerlo al salir del editor o al volver a entrar se suman las animaciones
  public ngOnDestroy(): void {
    this.stop();
    this.destroyController.abort(); // Esto elimina todos los eventos de un golpe que puedan haberse quedado en el aire
  }

  public stop(): void {
    this.isDestroyed = true;

    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }

    window.removeEventListener('resize', this.onResizeRef);
    window.removeEventListener('mousedown', this.onMouseDownRef);
    window.removeEventListener('mouseup', this.onMouseUpRef);

    if (this.controls) {
      this.controls.dispose();
    }

    // Limpieza de Efectos y Composer (Importante para evitar fugas de memoria)
    if (this.composer) {
      // Dispose de los render targets internos
      this.composer.renderTarget1.dispose();
      this.composer.renderTarget2.dispose();
      this.composer = null as any;
    }

    // Limpieza de la escena (con la validación que pusimos antes)
    if (this.scene) {
      this.cleanObject(this.scene);
      this.scene = null as any;
    }

    // Limpieza del Renderizador con validación de contexto
    if (this.renderer) {
      const gl = this.renderer.getContext();

      // Solo forzamos la pérdida si el contexto NO se ha perdido ya
      if (gl && !gl.isContextLost()) {
        this.renderer.forceContextLoss();
      }

      this.renderer.dispose();

      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.remove();
      }
      this.renderer = null as any;
    }

    // Limpiar referencias restantes
    this.ring = null as any;
    this.materialsRepository = {};
  }

  // Método auxiliar para limpiar cualquier objeto y sus hijos
  private cleanObject(obj: THREE.Object3D) {
    while (obj.children.length > 0) {
      this.cleanObject(obj.children[0]);
      obj.remove(obj.children[0]);
    }

    if ((obj as any).geometry) (obj as any).geometry.dispose();

    if ((obj as any).material) {
      const materials = Array.isArray((obj as any).material) ? (obj as any).material : [(obj as any).material];
      for (const mat of materials) {
        mat.dispose();
        // Limpiar texturas dentro del material
        for (const key of Object.keys(mat)) {
          if (mat[key] && mat[key].isTexture) {
            mat[key].dispose();
          }
        }
      }
    }
  }

  // PerspectiveCamera
  // --------------------------------------------------------
  // Mover la camara en X
  public setCameraX(position: number = 0) {
    this.camera.position.x = position;
  }

  // Mover la camara en Y
  public setCameraY(position: number = 0) {
    this.camera.position.y = position;
  }

  // Mover la camara en Z
  public setCameraZ(position: number = 0) {
    this.camera.position.z = position;
  }

  // Mover la camara en X, Y, Z
  public setCameraPosition(x: number = 0, y: number = 0, z: number = 0) {
    this.camera.position.set(x, y, z);
  }

  public createCamera(aspect: number, isPerspective: boolean = true) {

    if (isPerspective) {
      this.camera = new THREE.PerspectiveCamera(
        30,                                                       // angulo de vision, 30 teleobjetivo, 60-75 natural, 90 gran angular, 120 ojo de pez
        aspect,                                                   // aspect ratio, proporción ancho y alto de la imagen para que no se deforme
        0.01,                                                     // distancia plano cercano, más cerca se recorta
        1000                                                      // distancia plano lejano, más lejos se recorta
      );
    } else {
      const frustumSize = 0.03;

      this.camera = new THREE.OrthographicCamera(
        -frustumSize * aspect,     // límite izquierdo
        frustumSize * aspect,    // límite derecho
        frustumSize,      // límite superior
        -frustumSize,   // límite inferior
        0.01,     // plano cercano
        1000       // plano lejano
      );
    }

    this.scene.add(this.camera);   // añadimos la cámara a la escena
  }

  public setPerspective() {
    if (this.camera instanceof THREE.OrthographicCamera) {
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      const newCameraZoom = this.camera.top * 1000;         // FOV, ya que para obtener un zoom equivalente el top es igual a top * 1000

      const oldPosition = this.camera.position.clone();
      const oldRotation = this.camera.rotation.clone();

      this.camera = new THREE.PerspectiveCamera(
        newCameraZoom,                                            // angulo de vision, 30 teleobjetivo, 60-75 natural, 90 gran angular, 120 ojo de pez
        aspect,                                                   // aspect ratio, proporción ancho y alto de la imagen para que no se deforme
        0.01,                                                     // distancia plano cercano, más cerca se recorta
        1000                                                      // distancia plano lejano, más lejos se recorta
      );

      this.camera.position.copy(oldPosition);
      this.camera.rotation.copy(oldRotation);

      this.camera.updateProjectionMatrix();
    }
  }

  public setParallel() {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      const newCameraZoom = this.camera.fov / 1000;   // frustrumSize, ya que para obtener un zoom equivalente al fov debemos hacer fov / 1000

      const oldPosition = this.camera.position.clone();
      const oldRotation = this.camera.rotation.clone();

      this.camera = new THREE.OrthographicCamera(
        -newCameraZoom * aspect,     // límite izquierdo
        newCameraZoom * aspect,    // límite derecho
        newCameraZoom,      // límite superior
        -newCameraZoom,   // límite inferior
        0.01,     // plano cercano
        1000       // plano lejano
      );

      this.camera.position.copy(oldPosition);
      this.camera.rotation.copy(oldRotation);

      this.camera.updateProjectionMatrix();
    }
  }

  // AmbientLight
  // -------------------------------------------------------------------
  // Luz ambiental ilumina la escena de forma general

  // Cambiar el color de la luz puntual
  public setAmbientLightColor(color: THREE.ColorRepresentation = 0xffffff) {
    this.light.color.set(color);
  }

  // Cambiar intensidad de la luz puntual
  public setAmbientLightIntensity(intensity: number = 1) {
    this.light.intensity = intensity;
  }

  // Creamos la luz ambiental
  public createAmbientLight(color: THREE.ColorRepresentation = 0x404040, intensity: number = 0.8) {
    this.light = new THREE.AmbientLight(color, intensity);
    this.scene.add(this.light);
  }

  // PointLight
  // -------------------------------------------
  // Mover la luz puntual en X
  public setPointLightX(light: THREE.PointLight, position: number = 0) {
    light.position.x = position;
  }

  // Mover la luz putual en Y
  public setPointLightY(light: THREE.PointLight, position: number = 0) {
    light.position.y = position;
  }

  // Mover la luz puntual en Z
  public setPointLightZ(light: THREE.PointLight, position: number = 0) {
    light.position.z = position;
  }

  // Mover la luz puntual en X, Y, Z
  public setPointLightPosition(light: THREE.PointLight, x: number = 0, y: number = 0, z: number = 0) {
    light.position.set(x, y, z);
  }

  // Cambiar el color de la luz puntual
  public setPointLightColor(light: THREE.PointLight, color: THREE.ColorRepresentation = 0xffffff) {
    light.color.set(color);
  }

  // Cambiar intensidad de la luz puntual
  public setPointLightIntensity(light: THREE.PointLight, intensity: number = 1) {
    light.intensity = intensity;
  }

  // Cambiar distancia de la luz puntual
  public setPointLightDistance(light: THREE.PointLight, distance: number = 0) {
    light.distance = distance;
  }

  // Cambiar decaimiento de la luz puntual
  public setPointLightDecay(light: THREE.PointLight, decay: number = 0) {
    light.decay = decay;
  }

  // Creamos una luz puntual y la posicionamos en el espacio
  public createPointLight(
    color: THREE.ColorRepresentation = 0xffffff,
    intensity: number = 1,
    distance: number = 0,   // 0 = sin limite
    decay: number = 2,      // decaimiento de la luz a lo largo de la distancia
    x: number = 0,
    y: number = 0,
    z: number = 0
  ) {
    const light = new THREE.PointLight(color, intensity, distance, decay);
    this.setPointLightPosition(light, x, y, z);

    this.environmentGroup.add(light);
    this.pointLights.push(light);
  }

  // DirectionalLight
  // -------------------------------------------
  // Al ser direccional, apunta en una dirección definida por:
  // - Desde: position, donde se encuentra la luz
  // - Hasta: target, donde apunta, puede ser un objeto, realmente el target 
  // es un objeto y debe añadirse a la escena. Puede ser un objeto 3D.

  // Mover la luz direccional en X
  public setDirectionalLightX(light: THREE.DirectionalLight, position: number = 0) {
    light.position.x = position;
  }

  // Mover la luzdireccional en Y
  public setDirectionalLightY(light: THREE.DirectionalLight, position: number = 0) {
    light.position.y = position;
  }

  // Mover la luz direccional en Z
  public setDirectionalLightZ(light: THREE.DirectionalLight, position: number = 0) {
    light.position.z = position;
  }

  // Mover la luz direccional en X, Y, Z
  public setDirectionalLightPosition(light: THREE.DirectionalLight, x: number = 0, y: number = 0, z: number = 0) {
    light.position.set(x, y, z);
  }

  // Mueve la X del  punto al que apunta la luz 
  public setDirectionalLightTargetX(light: THREE.DirectionalLight, position: number = 0) {
    light.target.position.x = position;
  }

  // Mueve la Y del  punto al que apunta la luz 
  public setDirectionalLightTargetY(light: THREE.DirectionalLight, position: number = 0) {
    light.target.position.y = position;
  }

  // Mueve la Z del punto al que apunta la luz 
  public setDirectionalLightTargetZ(light: THREE.DirectionalLight, position: number = 0) {
    light.target.position.z = position;
  }

  // Mover el objetivo de la luz direccional en X, Y, Z
  public setDirectionalLightTargetPosition(light: THREE.DirectionalLight, x: number = 0, y: number = 0, z: number = 0) {
    light.target.position.set(x, y, z);
  }

  // Mover target a una malla 3d
  public setDirectionalLightTargetMesh(light: THREE.DirectionalLight, mesh: THREE.Mesh) {
    light.target = mesh;
  }

  // Cambiar el color de la luz direccional
  public setDirectionalLightColor(light: THREE.DirectionalLight, color: THREE.ColorRepresentation = 0xffffff) {
    light.color.set(color);
  }

  // Cambiar intensidad de la luz direccional
  public setDirectionalLightIntensity(light: THREE.DirectionalLight, intensity: number = 1) {
    light.intensity = intensity;
  }

  // Creamos una luz direccional y la posicionamos en el espacio
  public createDirectionalLight(
    color: THREE.ColorRepresentation = 0xffffff,
    intensity: number = 1,
    x: number = 0,
    y: number = 0,
    z: number = 0,
    tx: number = 0,
    ty: number = 0,
    tz: number = 0,
    mesh?: THREE.Mesh
  ) {
    const light = new THREE.DirectionalLight(color, intensity);
    this.setDirectionalLightPosition(light, x, y, z);

    mesh ?
      this.setDirectionalLightTargetMesh(light, mesh) :
      this.setDirectionalLightTargetPosition(light, tx, ty, tz);


    // -- PARA LAS SOMBRAS PROYECTADAS -------------------------
    light.castShadow = true;
    // captura sombras en un área de 5x5cm
    const d = 0.05;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    // Más resolución para que no se vea pixelada
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    light.shadow.radius = 4;

    // El near debe ser muy bajo para detectar el objeto cerca
    light.shadow.camera.near = 0.01;
    light.shadow.camera.far = 1;

    this.environmentGroup.add(light);
    this.environmentGroup.add(light.target);

    this.directionalLights.push(light);
  }


  // Loaders
  // -----------------------------------------
  public createLoaders() {
    this.modelLoader = new GLTFLoader();
    this.envLoader = new THREE.CubeTextureLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  // envMap
  // ------------------------------------------------------------
  // Mapa de entorno, fondo de la escena en forma de cubo.
  // Para obtenerlo he descargado un hdri y luego en https://hdri-to-cubemap-converter.vercel.app/ lo he convertido en imágenes .png
  // Se puede aumentar la resolución de las caras, yo he dejado el valor 256 por defecto
  // Para tener 6 imágenes separadas he elegido Separate, en lugar de Cross
  // p = positivo, n = negativo
  public setEnvMap(path: string) {
    this.envMap = this.envLoader.load([
      `${path}/px.png`, `${path}/nx.png`,
      `${path}/pz.png`, `${path}/ny.png`,
      `${path}/pz.png`, `${path}/nz.png`
    ]);
  }

  // Texture
  // ------------------------------------------------------------
  public loadTexture(path: string): THREE.Texture {
    return this.textureLoader.load(path);
  }

  public loadTextures(textures?: Partial<MaterialTextures>, basePath: string = '/textures') {

    const loaded: Partial<Record<keyof MaterialTextures, THREE.Texture>> = {};

    if (!textures) return loaded; // Si no hay ninguna textura por cargar salimos

    for (const key in textures) {
      const file = textures[key as keyof MaterialTextures];
      if (file) {
        loaded[key as keyof MaterialTextures] = this.loadTexture(basePath + file);
      }
    }

    return loaded;
  }

  // --------------------------------------------------------
  // Crear material según el tipo declarado
  // --------------------------------------------------------
  public createMaterial(
    def: MaterialDefinition,
    geometry?: THREE.BufferGeometry // por si es una gema para calcular el raytracing
  ): THREE.Material {
    const textures = this.loadTextures(def.textures);
    const options = def.options ?? {};

    switch (def.materialType) {
      case 'standard':
        return new THREE.MeshStandardMaterial({
          ...textures,
          envMap: this.envMap ?? null,
          ...(options as StandardOptions)
        });

      case 'phong': {
        const phongOptions = options as PhongOptions;

        const uniforms: Record<string, THREE.IUniform> = {
          map: { value: textures.map || null },
          normalMap: { value: textures.normalMap || null },
          roughnessMap: { value: textures.roughnessMap || null },
          metalnessMap: { value: textures.metalnessMap || null },
          aoMap: { value: textures.aoMap || null },
          envMap: { value: this.envMap || null },
          cameraPos: { value: this.camera.position || null },
          ...phongOptions.uniforms
        };

        return new THREE.ShaderMaterial({
          vertexShader: phongOptions.vertexShader,
          fragmentShader: phongOptions.fragmentShader,
          uniforms,
          transparent: phongOptions.transparent ?? false,
          opacity: phongOptions.opacity ?? 1,
          defines: phongOptions.defines,
        });
      }

      case 'physical':
        return new THREE.MeshPhysicalMaterial({
          ...textures,
          envMap: this.envMap ?? null,
          ...(options as PhysicalOptions)
        });

      case 'gemstones':
        if (!geometry) {
          throw new Error('El material diamond-bvh requiere geometry para construir el BVH.');
        }

        return this.createDiamondBVHMaterial(
          geometry,
          options as GemstoneBVHOptions
        );

      default:
        throw new Error(`MaterialType desconocido: ${def.materialType}`);
    }
  }

  public getMaterial(name: string, geometry?: THREE.BufferGeometry): THREE.Material {
    const def = this.MATERIAL_PRESETS[name];

    if (!def) {
      throw new Error(`Material preset no encontrado: ${name}`);
    }

    const isGeometryDependent = def.materialType === 'gemstones';

    if (!isGeometryDependent && this.materialsRepository[name]) {
      return this.materialsRepository[name];
    }

    const material = this.createMaterial(def, geometry);

    if (!isGeometryDependent) {
      this.materialsRepository[name] = material;
    }

    return material;
  }

  public async loadBaseStructure(path: string, materialName: string) {
    const material = this.getMaterial(materialName);

    // SI EL MODELO YA ES EL MISMO, solo actualizamos material y salimos
    if (this.ring && this.ring.getBaseStructureMesh().userData['modelPath'] === path) {
      this.ring.setMaterial(material);
      return this.ring;
    }

    const gltf = await this.modelLoader.loadAsync(`/models/bases/${path}`);
    const scene = gltf.scene;
    let mesh!: THREE.Mesh;

    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        mesh = child;
        mesh.userData['modelPath'] = path; // Guardamos el path para comparar luego
      }
    });

    if (this.ring) {
      this.group.remove(this.ring.getBaseStructureMesh());
      this.ring.setBaseStructure(mesh);
    } else {
      this.ring = new Ring(mesh);
    }

    this.ring.setMaterial(material);
    this.group.add(mesh);
    this.editJewelService.changeBaseStructureUUID(mesh.uuid);
    return this.ring;
  }

  public async loadSetting(path: string, materialName: string, index: number, px: number, py: number, pz: number, rx: number, ry: number, rz: number, rw: number, scale: number) {
    if (!this.ring) return;
    const material = this.getMaterial(materialName);
    const oldSetting = this.ring.getSetting(index);
    let wasSelected = false;

    // 1. Si el modelo es EXACTAMENTE el mismo, solo actualizamos parámetros
    if (oldSetting && oldSetting.getSettingMesh().userData['modelPath'] === path) {
      oldSetting.getSettingMesh().material = material;
      oldSetting.setPosition(px, py, pz);
      oldSetting.setRotation(rx, ry, rz, rw);
      oldSetting.setScale(scale);
      return oldSetting;
    }

    // 2. SI ES DISTINTO O NO EXISTÍA: Limpieza profunda del índice antes de cargar el nuevo
    if (oldSetting) {
      const oldMesh = oldSetting.getSettingMesh();

      if ( this.selectedObject && this.selectedObject.length > 0 ) {
        wasSelected = oldMesh.uuid === this.selectedObject[0].uuid;
      }
      this.ring.removeSetting(index, this.group); // Esto limpia escena y geometría
    }

    const gltf = await this.modelLoader.loadAsync(`/models/engastes/${path}`);
    const scene = gltf.scene;
    let mesh!: THREE.Mesh;

    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        mesh = child;
        mesh.userData['modelPath'] = path;
      }
    });

    const setting = new Setting(mesh);
    setting.setPosition(px, py, pz);
    setting.setRotation(rx, ry, rz, rw);
    setting.setScale(scale);

    this.ring.setSetting(setting, index);
    this.group.add(mesh);

    if ( wasSelected ) { 
      this.selectedObject = [this.ring.getSetting(index).getSettingMesh()];
      this.selectObject();
    }
    
    this.editJewelService.changeSettingUUID(mesh.uuid, index);
    mesh.updateMatrixWorld(true);
    return setting;
  }

  // Cambia la posición del engaste y de su gema principal en consecuencia
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
    scale: number
  ) {
    const setting = this.ring.getSetting(settingIndex);
    if (!setting) {
      return;
    }

    const oldGemstone = setting.getGemstone(index);
    const materialDef = this.MATERIAL_PRESETS[materialName];

    if (!materialDef) {
      throw new Error(`Material preset no encontrado: ${materialName}`);
    }

    const isGeometryDependent = materialDef.materialType === 'gemstones';

    // Si el modelo es el mismo, solo actualizamos material y transformaciones
    if (oldGemstone && oldGemstone.getGemstoneMesh().userData['modelPath'] === path) {
      const mesh = oldGemstone.getGemstoneMesh();

      if (isGeometryDependent) {
        const geometry = mesh.geometry as THREE.BufferGeometry;

        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        } else if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose());
        }

        mesh.material = this.getMaterial(materialName, geometry);
      } else {
        mesh.material = this.getMaterial(materialName);
      }

      mesh.position.set(px, py, pz);
      mesh.quaternion.set(rx, ry, rz, rw);
      mesh.scale.set(scale, scale, scale);
      mesh.updateMatrixWorld(true);

      return oldGemstone;
    }

    // Si había una gema anterior distinta, eliminarla bien
    if (oldGemstone) {
      const oldMesh = oldGemstone.getGemstoneMesh();

      oldMesh.parent?.remove(oldMesh);

      if (oldMesh.material instanceof THREE.Material) {
        oldMesh.material.dispose();
      } else if (Array.isArray(oldMesh.material)) {
        oldMesh.material.forEach(mat => mat.dispose());
      }

      if (oldMesh.geometry) {
        oldMesh.geometry.dispose();
      }
    }

    const gltf = await this.modelLoader.loadAsync(`/models/gemas/${path}`);
    const scene = gltf.scene;
    let sourceMesh!: THREE.Mesh;

    scene.traverse((child: any) => {
      if (!sourceMesh && child instanceof THREE.Mesh) {
        sourceMesh = child;
      }
    });

    if (!sourceMesh) {
      throw new Error(`No se encontró ninguna malla en la gema ${path}`);
    }

    const geometry = (sourceMesh.geometry as THREE.BufferGeometry).clone().toNonIndexed();
    geometry.deleteAttribute('normal');
    geometry.computeVertexNormals();
    geometry.normalizeNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const mesh = new THREE.Mesh(geometry);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData['modelPath'] = path;
    mesh.name = `${path.split('.')[0]}-${settingIndex}-${index}`;

    if (isGeometryDependent) {
      mesh.material = this.getMaterial(materialName, geometry);
    } else {
      mesh.material = this.getMaterial(materialName);
    }

    const gemstone = new Gemstone(mesh);

    mesh.position.set(px, py, pz);
    mesh.quaternion.set(rx, ry, rz, rw);
    mesh.scale.set(scale, scale, scale);

    setting.setGemstone(gemstone, index);
    setting.getSettingMesh().add(mesh);

    mesh.updateMatrixWorld(true);

    this.editJewelService.changeGemUUID(mesh.uuid, index);
    return gemstone;
  }

  public async loadBox(
    path: string,
    innerMaterialColor: string,
    outerMaterialColor: string,
    detailsMaterialColor: string
  ) {
    try {
      const gltf = await this.modelLoader.loadAsync(path);

      if (!gltf || !gltf.scene) {
        return;
      }

      // Si el anillo ya tiene una caja, esta se elimina para cambiarla por la nueva
      if (this.ring.getBox()) {
        this.ring.removeBox(this.scene, this.group);
      }

      const modelScene = gltf.scene;

      // creamos la instancia de box
      const newBox = new Box(modelScene);

      const m1 = this.getMaterial(innerMaterialColor);
      const m2 = this.getMaterial(outerMaterialColor);
      const m3 = this.getMaterial(detailsMaterialColor);

      //usamos esta función para asignar los materiales
      newBox.setMaterials(m1, m2, m3);

      //vinculamos la caja al anillo
      this.ring.setBox(newBox);

      //lo añadimos todo a la escena 
      const boxElement = newBox.getBoxElement();
      this.group.add(boxElement);
      this.scene.add(this.group);

    } catch (error) {}

  }

  public setSettingPosition(setting: number, x: number, y: number, z: number) {
    this.ring.setSettingPosition(setting, x, y, x);
  }

  // Cambia la rotación del engaste y de su gema principal en consecuencia
  public setSettingRotation(setting: number, x: number, y: number, z: number, w: number) {
    this.ring.setSettingRotation(setting, x, y, z, w);
  }

  // Cambia la escala del engaste y de su gema principal en consecuencia
  public setSettingScale(setting: number, scale: number) {
    this.ring.setSettingScale(setting, scale);
  }

  // Cambia el material de la estructura del anillo (base + engastes) al mismo metal, oro amarillo, platino...
  public setStructureMaterial(materialName: string) {
    const material = this.getMaterial(materialName);
    this.ring.setMaterial(material);
  }

  // Cambia el material de una gema (diamantes, rubí, esmeralda, turmarina, tanzanita...)
  public setGemstoneMaterial(materialName: string, setting: number, gemstone: number) {
    const material = this.getMaterial(materialName);
    this.ring.getSetting(setting).getGemstone(gemstone).setMaterial(material);
  }

  //cambiar el material interior de la caja
  public setBoxInterior(materialName: string) {
    const material = this.getMaterial(materialName);
    this.ring.setBoxInnerMaterial(material);
  }

  //cambiar el material exterior de la caja
  public setBoxExterior(materialName: string) {
    const material = this.getMaterial(materialName);
    this.ring.setBoxOuterMaterial(material)
  }

  public async resetRingLayout() {
    if (this.ring) {
      // Limpiamos todo lo que no sea la base
      this.ring.clearAllSettings(this.group);
    }
  }

  // Elimina el engaste y todas sus gemas asociadas del anillo
  public removeSetting(setting: number) {
    if (!this.ring) return;
    this.ring.removeSetting(setting, this.group);
  }

  public removeAllSettings() {
    if (!this.ring) return;

    // Eliminamos del grupo de Threejs todos los settings actuales
    this.ring.clearAllSettings(this.group);

    // Forzamos que el array de settings empiece de cero para la nueva variante
    // Esto evita que queden "fantasmas" en índices viejos
  }

  //Esta función permite crear figuras básicas ya sea para debug o el caso de las sombras que se necesita un plano
  public loadFloor(width: number, height: number) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.ShadowMaterial({
      opacity: 0.1,
      transparent: true
    });

    this.floorPlane = new THREE.Mesh(geometry, material);

    this.floorPlane.rotation.x = -Math.PI / 2;
    this.floorPlane.position.y = -0.0096;
    this.floorPlane.receiveShadow = true;

    this.scene.add(this.floorPlane);
  }

  public resetCameraPos() {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    // const newCameraPos = new THREE.Vector3(0.02, 0.02, -0.02);
    const newCameraPos = new THREE.Vector3(0.015, 0.03, -0.01);
    const newTarget = new THREE.Vector3(0, 0, 0);

    let t = 0;
    const animate = () => {
      t += 1 / (60 * 1);

      const lerpFactor = Math.min(t, 1);

      this.camera.position.lerpVectors(startPos, newCameraPos, lerpFactor);
      this.controls.target.lerpVectors(startTarget, newTarget, lerpFactor);

      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 30, lerpFactor);
      } else {

        const frustumSize = 0.03;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.left = THREE.MathUtils.lerp(this.camera.left, -frustumSize * (width / height), lerpFactor);
        this.camera.right = THREE.MathUtils.lerp(this.camera.right, frustumSize * (width / height), lerpFactor);
        this.camera.top = THREE.MathUtils.lerp(this.camera.top, frustumSize, lerpFactor);
        this.camera.bottom = THREE.MathUtils.lerp(this.camera.top, -frustumSize, lerpFactor);
      }

      this.controls.update();

      if (lerpFactor < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  // Gestión de la escena
  // ------------------------------------------------------------
  public getTouchDistance(touches: TouchList): number {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  //Activar/desactivar la rotación automática
  public toggleAutoRotation(value: boolean): void {
    this.autoRotationEnabled = value;

    if (this.controls) {
      // Si el usuario lo apaga, lo desactivamos inmediatamente
      this.controls.autoRotate = value;
    }
  }

  public addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);  // Inicializamos OrbitControls
    this.controls.enableDamping = true;                                        // Habilitar amortiguamiento para suavizar el movimiento
    this.controls.dampingFactor = 0.25;                                        // Factor de amortiguamiento
    this.controls.screenSpacePanning = false;                                  // No permitir desplazamiento en el plano de la pantalla
    this.controls.maxPolarAngle = 2 * Math.PI;                                   // Límite para el ángulo polar (evitamos visión por debajo de la escena)
    this.controls.enableZoom = false;                                          // Deshabilitamos el zoom normal de orbitcontrols para crear el nuestro 

    // Rotación automática
    // -----------------------------------------------
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.5; // Velocidad de rotación

    // Cuando el usuario toca el anillo
    this.controls.addEventListener('start', () => {
      this.userInteracting = true;
      this.controls.autoRotate = false; // Detenemos el auto-giro
    });

    // Cuando el usuario suelta el anillo
    this.controls.addEventListener('end', () => {
      this.userInteracting = false;
      this.lastInteractionTime = Date.now(); // Guardamos el momento en que soltó
    });

    // Zoom personalizado
    // -----------------------------------------------
    const MIN_FOV = 1;
    const MAX_FOV = 100;

    const MIN_FRUSTRUM_SIZE = 0.001;
    const MAX_FRUSTRUM_SIZE = 0.1;

    // Rueda del ratón y algunos trackpads que al hacer pinch mandan el evento wheel
    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();

        if (this.camera instanceof THREE.PerspectiveCamera) {
          this.camera.fov = THREE.MathUtils.clamp(
            this.camera.fov + e.deltaY * 0.02,
            MIN_FOV,
            MAX_FOV
          );
        } else {
          const scaleFactor = Math.pow(1.4, e.deltaY * 0.005); // Escala no lineal para zoom suave

          // Calculamos el nuevo tamaño del volumen visible
          const newFrustumSize = this.camera.top * scaleFactor;

          const newFrustumSizeClamped = THREE.MathUtils.clamp(
            newFrustumSize,
            MIN_FRUSTRUM_SIZE,
            MAX_FRUSTRUM_SIZE
          );

          const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
          this.camera.left = -newFrustumSizeClamped * aspect;
          this.camera.right = newFrustumSizeClamped * aspect;
          this.camera.top = newFrustumSizeClamped;
          this.camera.bottom = -newFrustumSizeClamped;

        }
        this.camera.updateProjectionMatrix();
      },
      { passive: false }
    );

    // Pinch Zoom
    let lastTouchDistance = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastTouchDistance = this.getTouchDistance(e.touches);
      }
    });

    this.canvas.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length !== 2) return;

        e.preventDefault();

        const currentDistance = this.getTouchDistance(e.touches);
        const delta = lastTouchDistance - currentDistance;

        if (this.camera instanceof THREE.PerspectiveCamera) {
          this.camera.fov = THREE.MathUtils.clamp(
            this.camera.fov + delta * 0.02,
            MIN_FOV,
            MAX_FOV
          );
        } else {
          const scaleFactor = Math.pow(10, delta * 0.5); // Escala no lineal para zoom suave

          // Calculamos el nuevo tamaño del volumen visible
          const newFrustumSize = this.camera.top * scaleFactor;

          const newFrustumSizeClamped = THREE.MathUtils.clamp(
            newFrustumSize,
            MIN_FRUSTRUM_SIZE,
            MAX_FRUSTRUM_SIZE
          );

          const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
          this.camera.left = -newFrustumSizeClamped * aspect;
          this.camera.right = newFrustumSizeClamped * aspect;
          this.camera.top = newFrustumSizeClamped;
          this.camera.bottom = -newFrustumSizeClamped;
        }
        this.camera.updateProjectionMatrix();

        lastTouchDistance = currentDistance;
      },
      { passive: false }
    );

  }

  public prepareOutlineEffect() {
    // Shader effect
    this.raycaster = new THREE.Raycaster();
    // Composer
    const renderTarget = new THREE.WebGLRenderTarget(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      {
        samples: 8
      }
    );

    this.composer = new EffectComposer(this.renderer, renderTarget);
    // Render pass
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    // Outline pass
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
      this.scene,
      this.camera
    );
    // Config
    this.outlinePass.edgeStrength = 2;
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeThickness = 2;
    this.outlinePass.pulsePeriod = 0;
    this.outlinePass.usePatternTexture = false;
    this.outlinePass.visibleEdgeColor.set("#e46161");
    this.outlinePass.hiddenEdgeColor.set("#e46161");
    this.composer.addPass(this.outlinePass);

    // GammaCorrection
    const gammaCorrection = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(gammaCorrection);
  }

  // Crear escena
  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    // Recuperamos el canvas
    this.canvas = canvas.nativeElement;

    // Creamos la escena es el contenedor que organiza los Objetos3D, Luces, Cámaras y propiedades globales, no dibuja nada por si sola
    this.scene = new THREE.Scene();

    // WebGL 2 para rederizar la escena
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // fondo transparente
      antialias: true // si empieza a ir mal quitar: activamos el antialiasing para teners bordes más suaves utiliza MSAA (Multisample anti-aliasing) se basa en SSAA pero más limitado
    });
    this.renderer.setClearColor(0x000000, 0); // Esto evita el aprpadeo negro al cambiar de motor
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight); // ocupa todo el espacio disponible en el canvas

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Creamos los cargadores de los elementos
    this.createLoaders();

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.environmentGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);

    // Creamos el grupo que controlará las transformaciones que deben aplicarse a todos las mallas de un anillo por igual
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.group.position.set(0, 0, 0);

    this.ring = null as any;
  }

  public animate(): void {
    this.isDestroyed = false;
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();

      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', this.onResizeRef);
      window.addEventListener('mousedown', this.onMouseDownRef);
      window.addEventListener('mouseup', this.onMouseUpRef);
    });
  }

  private onResize() {
    if (!this.canvas || !this.camera) return;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.resize(aspect);
  }

  private onMouseDown(event: PointerEvent) {
    // Cogemos las coordenadas donde el usuario pulsa el boton dell raton
    this.firstMouseCoords.setX(event.clientX);
    this.firstMouseCoords.setY(event.clientY);
  }

  private onMouseUp(event: Event) {
    const mouseEvent = event as MouseEvent;

    // 1. Corregimos la validación del target. 
    // Comprobamos si el clic fue sobre el canvas actual.
    if (!(event.target instanceof HTMLCanvasElement)) return;

    this.lastMouseCoords.set(mouseEvent.clientX, mouseEvent.clientY);

    // 2. Comprobamos movimiento (para no seleccionar si el usuario estaba rotando)
    if (this.firstMouseCoords.distanceTo(this.lastMouseCoords) > this.mouseMovementThreshold) return;

    const rect = this.canvas.getBoundingClientRect();

    // 3. Coordenadas normalizadas
    const mouse = new THREE.Vector2(
      ((mouseEvent.clientX - rect.left) / rect.width) * 2 - 1,
      -((mouseEvent.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);

    // 4. Buscamos solo dentro de 'this.group' que es donde están las piezas del anillo
    const intersections = this.raycaster.intersectObjects(this.group.children, true);

    if (intersections.length > 0) {
      let obj = intersections[0].object;

      // Subimos por el árbol de nodos hasta encontrar el hijo directo de 'this.group'
      // Esto es necesario porque el GLTF carga una jerarquía (Group -> Object3D -> Mesh)

      this.selectedObject = [obj];
    } else {
      this.selectedObject = [];
    }

    this.selectObject();
  }

  private selectObject() {
    if ( !this.selectedObject ) return;

    // 6. Notificamos al servicio de Angular
    if (this.selectedObject.length > 0) {
      const uuid = this.selectedObject[0].uuid;
      const category = this.editJewelService.getCategoryByUUID(uuid);
      if (category !== 'error') {
        this.editJewelService.selectObjectByUUID(category, uuid);
        this.editJewelService.selectGemByUUID(category, uuid);
      }

      while (this.selectedObject[0].parent && this.selectedObject[0].parent !== this.group) {
        this.selectedObject[0] = this.selectedObject[0].parent;
      }
    }
    
    this.outlinePass.selectedObjects = this.selectedObject!;

  }

  private updateDiamondMaterialUniforms(): void {
    if (!this.group) return;

    this.group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      if (!(obj.material instanceof THREE.ShaderMaterial)) return;
      if (!obj.material.uniforms) return;
      if (!obj.material.uniforms['worldMatrix']) return;
      if (!obj.material.uniforms['worldMatrixInverse']) return;

      obj.updateMatrixWorld(true);
      obj.material.uniforms['worldMatrix'].value.copy(obj.matrixWorld);
      obj.material.uniforms['worldMatrixInverse'].value.copy(obj.matrixWorld).invert();

      if (obj.material.uniforms['envRotation']) {
        obj.material.uniforms['envRotation'].value += 0.002;
      }
    });
  }

  private updateAnimatedShaderMaterials(): void {
    for (const material of Object.values(this.materialsRepository)) {
      if (!(material instanceof THREE.ShaderMaterial)) continue;
      if (!material.uniforms) continue;

      if (material.uniforms['cameraPos']) {
        material.uniforms['cameraPos'].value.copy(this.camera.position);
      }
    }
  }

  public render(): void {
    if (this.isDestroyed || !this.composer || !this.renderer) {
      this.stop();
    }
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    // Si la animación automática está desactivada en el editor, desactivarla aqui
    if (!this.autoRotationEnabled) {
      this.controls.autoRotate = false;
    }
    // En caso contrario aplicamos la lógica de inactividad
    else {
      //Si el usuario está inactivo activar la rotación
      if (!this.userInteracting) {
        const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;
        if (timeSinceLastInteraction > this.RESUME_DELAY) {
          this.controls.autoRotate = true;
        }
      } else { //Si comienza a interactuar, pausarla
        this.controls.autoRotate = false;
      }
    }

    if (this.controls && this.environmentGroup) {
      this.controls.update();

      // Obtenemos el ángulo horizontal de la cámara (cuánto ha girado alrededor del objeto en el plano del suelo)
      const angle = this.controls.getAzimuthalAngle();

      // Aplicamos esa misma rotación al grupo que contiene luces 
      this.environmentGroup.rotation.y = angle;
    }

    this.updateAnimatedShaderMaterials();
    this.updateDiamondMaterialUniforms();
    this.composer.render();
  }

  public resize(aspect: number): void {
    // this.camera.aspect = width / height;
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect;
    } else {
      const frustumSize = this.camera.top;

      this.camera.left = -frustumSize * aspect;
      this.camera.right = frustumSize * aspect;
    }
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.outlinePass.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  // Crea los ejes de referencia con colores: rojo=x, verde=y, azul=z (debug)
  public addDebugAxes(size: number = 0.5) {
    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
  }

  // Crea un grid en cm (debug)
  public addDebugGrid() {
    // 0.02 metros = 20mm de tamaño total del grid
    const size = 0.1;

    // 20 divisiones (una cada 0.001m, es decir, cada 1mm)
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);


    this.scene.add(gridHelper);
  }

  // SHADER RAYTRACING GEMAS
  private createDiamondBVHMaterial(
  geometry: THREE.BufferGeometry,
  options ?: GemstoneBVHOptions
): THREE.ShaderMaterial {
  const worldMatrix = new THREE.Matrix4();
  const worldMatrixInverse = new THREE.Matrix4();

  const boundsTree = new MeshBVH(geometry, {
    strategy: SAH,
    maxLeafSize: 1,
    indirect: false,
  });

  (geometry as any).boundsTree = boundsTree;

  const material = new THREE.ShaderMaterial({
    transparent: false,
    side: THREE.FrontSide,
    uniforms: {
      bvh: { value: new MeshBVHUniformStruct() },
      color: { value: new THREE.Color(options?.color ?? 0xffffff) },
      bounces: { value: options?.bounces ?? 4.0 },
      ior: { value: options?.ior ?? 2.42 },
      aberrationStrength: { value: options?.aberrationStrength ?? 0.02 },
      fresnelStrength: { value: options?.fresnelStrength ?? 1.15 },
      envRotation: { value: 0.0 },
      worldMatrix: { value: worldMatrix.clone() },
      worldMatrixInverse: { value: worldMatrixInverse.clone() },
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
    fragmentShader: `
        precision highp float;
        precision highp isampler2D;
        precision highp usampler2D;

        #define PI 3.141592653589793
        #define RAY_OFFSET 0.0003
        #define MAX_BOUNCES 3

        ${BVHShaderGLSL.common_functions}
        ${BVHShaderGLSL.bvh_struct_definitions}
        ${BVHShaderGLSL.bvh_ray_functions}

        uniform BVH bvh;
        uniform vec3 color;
        uniform float bounces;
        uniform float ior;
        uniform float aberrationStrength;
        uniform float fresnelStrength;
        uniform float envRotation;
        uniform mat4 worldMatrix;
        uniform mat4 worldMatrixInverse;

        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        vec2 sampleEquirect(vec3 dir) {
          dir = normalize(dir);
          float phi = atan(dir.z, dir.x) + envRotation;
          float theta = asin(clamp(dir.y, -1.0, 1.0));
          return vec2(phi / (2.0 * PI) + 0.5, theta / PI + 0.5);
        }

        ${options?.envSample}

        vec3 traceInsideGem(vec3 worldOrigin, vec3 worldDir, float etaExit) {
          vec3 localOrigin = (worldMatrixInverse * vec4(worldOrigin, 1.0)).xyz;
          vec3 localDir = normalize((worldMatrixInverse * vec4(worldDir, 0.0)).xyz);

          for (int i = 0; i < MAX_BOUNCES; i++) {
            if (float(i) >= bounces) break;

            uvec4 faceIndices = uvec4(0u);
            vec3 faceNormal = vec3(0.0, 0.0, 1.0);
            vec3 barycoord = vec3(0.0);
            float side = 1.0;
            float dist = 1e20;

            bvhIntersectFirstHit(
              bvh,
              localOrigin,
              localDir,
              faceIndices,
              faceNormal,
              barycoord,
              side,
              dist
            );

            if (dist >= 1e19) {
              return normalize((worldMatrix * vec4(localDir, 0.0)).xyz);
            }

            vec3 hitPos = localOrigin + localDir * max(dist - RAY_OFFSET, 0.0);
            vec3 outwardNormal = normalize(faceNormal);
            vec3 surfaceNormal = dot(localDir, outwardNormal) > 0.0 ? -outwardNormal : outwardNormal;

            vec3 exitDir = refract(localDir, surfaceNormal, etaExit);
            if (length(exitDir) > 0.0) {
              return normalize((worldMatrix * vec4(exitDir, 0.0)).xyz);
            }

            localDir = reflect(localDir, surfaceNormal);
            localOrigin = hitPos + localDir * RAY_OFFSET;
          }

          return normalize((worldMatrix * vec4(localDir, 0.0)).xyz);
        }

        vec3 sampleDispersion(vec3 worldPos, vec3 viewDir, vec3 normal) {
          float iorR = max(1.01, ior * (1.0 - aberrationStrength));
          float iorG = max(1.01, ior);
          float iorB = max(1.01, ior * (1.0 + aberrationStrength));

          vec3 entryR = refract(viewDir, normal, 1.0 / iorR);
          vec3 entryG = refract(viewDir, normal, 1.0 / iorG);
          vec3 entryB = refract(viewDir, normal, 1.0 / iorB);

          if (length(entryR) == 0.0) entryR = reflect(viewDir, normal);
          if (length(entryG) == 0.0) entryG = reflect(viewDir, normal);
          if (length(entryB) == 0.0) entryB = reflect(viewDir, normal);

          vec3 dirR = traceInsideGem(worldPos + entryR * RAY_OFFSET, entryR, iorR);
          vec3 dirG = traceInsideGem(worldPos + entryG * RAY_OFFSET, entryG, iorG);
          vec3 dirB = traceInsideGem(worldPos + entryB * RAY_OFFSET, entryB, iorB);

          return vec3(envSample(dirR).r, envSample(dirG).g, envSample(dirB).b);
        }

        void main() {
          vec3 N = normalize(vWorldNormal);
          vec3 V = normalize(vWorldPosition - cameraPosition);
          vec3 reflected = reflect(V, N);

          vec3 refractedColor = sampleDispersion(vWorldPosition, V, N) * color;
          vec3 reflectedColor = envSample(reflected);

          float fresnel = pow(1.0 - abs(dot(-V, N)), 5.0) * fresnelStrength;
          fresnel = clamp(fresnel + 0.04, 0.0, 1.0);

          // vec3 sparkle = pow(max(refractedColor, vec3(0.0)), vec3(1.35)) * 0.35;
          vec3 finalColor = mix(refractedColor, reflectedColor, fresnel);

          gl_FragColor = vec4(finalColor, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
  });

  material.uniforms['bvh'].value.updateFrom(boundsTree);
  return material;
}

  public getOptimizedScreenshot(size: number = 300): string {
      // --- GUARDAR ESTADO ORIGINAL ---
      const originalCamPos = this.camera.position.clone();
      const originalTarget = this.controls.target.clone();
      const originalShadowsEnabled = this.renderer.shadowMap.enabled;
      const originalControlsEnabled = this.controls.enabled;

      const originalSize = new THREE.Vector2();
      this.renderer.getSize(originalSize);
      const originalAspect = (this.camera instanceof THREE.PerspectiveCamera) ? this.camera.aspect : 1;

      const box = this.ring?.getBox();
      const boxElement = box?.getBoxElement();
      const boxVisibleBackup = boxElement ? boxElement.visible : false;

      let originalZoom: number;
      if (this.camera instanceof THREE.PerspectiveCamera) {
          originalZoom = this.camera.fov;
      } else {
          originalZoom = (this.camera as THREE.OrthographicCamera).top;
      }

      const PHOTO_POS = new THREE.Vector3(0.06, 0.06, 0.04);
      const PHOTO_TARGET = new THREE.Vector3(0, 0, 0);
      const PHOTO_FOV = 20;
      const INTERNAL_RENDER_SIZE = 1024; 

      this.controls.enabled = false;
      if (this.floorPlane) this.floorPlane.visible = false;
      if (boxElement) boxElement.visible = false;
      this.renderer.shadowMap.enabled = false;

      this.renderer.setSize(INTERNAL_RENDER_SIZE, INTERNAL_RENDER_SIZE);
      if (this.composer) {
          this.composer.setSize(INTERNAL_RENDER_SIZE, INTERNAL_RENDER_SIZE);
      }

      this.camera.position.copy(PHOTO_POS);
      this.camera.lookAt(PHOTO_TARGET);
      this.controls.target.copy(PHOTO_TARGET);

      if (this.camera instanceof THREE.PerspectiveCamera) {
          this.camera.fov = PHOTO_FOV;
          this.camera.aspect = 1; 
      }
      this.camera.updateProjectionMatrix();

      // --- RENDERIZAR CAPTURA ---
      if (this.composer) {
          this.composer.render();
      } else {
          this.renderer.render(this.scene, this.camera);
      }

      // --- PROCESAR EL CANVAS ---
      const sourceCanvas = this.renderer.domElement;
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = size;
      offscreenCanvas.height = size;
      const ctx = offscreenCanvas.getContext('2d');

      if (ctx) {
          ctx.drawImage(sourceCanvas, 0, 0, INTERNAL_RENDER_SIZE, INTERNAL_RENDER_SIZE, 0, 0, size, size);
      }

      const dataUrl = offscreenCanvas.toDataURL("image/png", 0.9);

      // --- RESTAURAR TODO AL ESTADO ORIGINAL ---
      
      // Restaurar tamaño del renderer y del composer al de la ventana
      this.renderer.setSize(originalSize.x, originalSize.y);
      if (this.composer) {
          this.composer.setSize(originalSize.x, originalSize.y);
      }

      this.camera.position.copy(originalCamPos);
      this.controls.target.copy(originalTarget);

      if (this.floorPlane) this.floorPlane.visible = true;
      if (boxElement) boxElement.visible = boxVisibleBackup;
      this.renderer.shadowMap.enabled = originalShadowsEnabled;

      if (this.camera instanceof THREE.PerspectiveCamera) {
          this.camera.fov = originalZoom;
          this.camera.aspect = originalAspect; // Restaurar aspecto original
      } else {
          (this.camera as THREE.OrthographicCamera).top = originalZoom;
      }

      this.camera.updateProjectionMatrix();
      this.controls.enabled = originalControlsEnabled;
      this.controls.update();

      return dataUrl;
  }
}