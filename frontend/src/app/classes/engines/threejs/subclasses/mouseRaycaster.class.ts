import { Raycaster, Vector2, Object3D, WebGLRenderer, PerspectiveCamera, Scene, Group, Mesh } from "three";
import { OutlinePass } from 'three/examples/jsm/Addons.js';

export class MouseRaycaster {
  private raycaster: Raycaster;
  private pointer: Vector2;
  private selectedObjects: Object3D[];
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private outlinePass: OutlinePass;

  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene, outlinePass: OutlinePass) {
    this.raycaster = new Raycaster();
    this.pointer = new Vector2();
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.outlinePass = outlinePass;

    this.raycaster.near = 0.01;
    this.raycaster.far = 1000;

    renderer.domElement.addEventListener(
      "pointermove",
      this.onPointerMove.bind(this)
    );
    this.selectedObjects = [];
  }

  public onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return;

    this.pointer.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.checkIntersection(this.camera);
  }

  private checkIntersection(camera: PerspectiveCamera) {
    const mousePos = new Vector2(this.pointer.x, this.pointer.y);
    this.raycaster.setFromCamera(mousePos, camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const selectedGroup = intersects[0].object.parent as Group;
      this.addSelectedObject(selectedGroup);
      this.outlinePass.selectedObjects = this.selectedObjects;
    } else {
      this.outlinePass.selectedObjects = [];
    }
  }

  private addSelectedObject(group: Group) {
    this.selectedObjects = [];
    group.traverse((child) => {
      if ((child as Mesh).isMesh) {
        this.selectedObjects.push(child as Mesh);
      }
    });
  }
}