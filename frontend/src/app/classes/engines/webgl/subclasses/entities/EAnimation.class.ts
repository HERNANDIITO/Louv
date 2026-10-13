import { mat4, vec3, quat } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { TNode } from "../utilities/TNode.class";

export interface Keyframe {
  time: number; // Segundos desde el inicio
  position?: vec3;
  rotation?: quat;
  scale?: vec3;
}

export class AnimationEntity extends IEntity {
  private _keyframes: Keyframe[];
  private _elapsedTime: number = 0;
  private _duration: number = 0;
  private _loop: boolean = true;
  private _isPlaying: boolean = false; // No comienza automáticamente

  // Variables temporales para evitar creación de objetos en el bucle de renderizado.
  private _scratchPos = vec3.create();
  private _scratchRot = quat.create();
  private _scratchScl = vec3.create();

  public onComplete?: () => void;

  /**
   * @param keyframes Lista de frames. Se ordenan automáticamente por tiempo.
   * @param loop Define si la animación se repite al finalizar.
   */
  constructor(keyframes: Keyframe[], loop: boolean = true) {
    super();
    this._keyframes = keyframes.sort((a, b) => a.time - b.time);
    this._duration = this._keyframes[this._keyframes.length - 1]?.time || 0;
    this._loop = loop;
  }

  /**
   * Actualiza el estado de la animación y aplica las transformaciones al nodo.
   * @param deltaTime Tiempo transcurrido desde el último frame.
   * @param node Nodo al que se le aplicarán las transformaciones.
   */
  public override update(deltaTime: number, node: TNode) {
    if (!this._isPlaying || this._duration === 0) return;

    this._elapsedTime += deltaTime;

    // --- LÓGICA DE TIEMPO Y LOOP ---
    if (this._elapsedTime >= this._duration) {
      if (this._loop) {
        this._elapsedTime %= this._duration;
      } else {
        this._elapsedTime = this._duration;
        this._isPlaying = false;
        if (this.onComplete) this.onComplete();
      }
    }

    // --- BÚSQUEDA DE KEYFRAMES ---
    // Encontramos el par de keyframes (prev y next) que envuelven el tiempo actual
    const time = this._elapsedTime;
    let nextIdx = this._keyframes.findIndex(kf => kf.time >= time);
    if (nextIdx === -1) nextIdx = 0;
    let prevIdx = nextIdx === 0 ? 0 : nextIdx - 1;

    const prev = this._keyframes[prevIdx];
    const next = this._keyframes[nextIdx];

    // --- CÁLCULO DEL FACTOR DE INTERPOLACIÓN (t) ---
    let t = 0;
    const gap = next.time - prev.time;
    if (gap > 0.0001) { // Evitar división por cero
        t = (time - prev.time) / gap;
    } else {
        t = 0; // Si el tiempo es el mismo, nos quedamos en el prev
    }

    // --- INTERPOLACIÓN DE TRANSFORMACIONES ---

    // LERP para posición
    if (prev.position && next.position) {
      vec3.lerp(this._scratchPos, prev.position, next.position, t);
      node.setTranslation(this._scratchPos[0], this._scratchPos[1], this._scratchPos[2]);
    }

    // SLERP para rotación
    if (prev.rotation && next.rotation) {
      quat.slerp(this._scratchRot, prev.rotation, next.rotation, t);
      quat.normalize(this._scratchRot, this._scratchRot);
      node.setRotation(this._scratchRot[0], this._scratchRot[1], this._scratchRot[2], this._scratchRot[3]);
    }

    // LERP para Escala
    if (prev.scale && next.scale) {
      vec3.lerp(this._scratchScl, prev.scale, next.scale, t);
      node.setScale(this._scratchScl[0], this._scratchScl[1], this._scratchScl[2]);
    }
  }

  // --------------------------
  // Control de reproducción
  // --------------------------
  
  public play(): void {
    this._isPlaying = true;
  }

  public stop(): void {
    this._isPlaying = false;
    this._elapsedTime = 0;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get elapsedTime(): number {
    return this._elapsedTime;
  }

  public get duration(): number {
    return this._duration;
  }

  public get keyframes(): Keyframe[] {
    return this._keyframes;
  }

  public render(mat: mat4): void {} // No dibuja nada
  public destroy(): void {
    this.stop(); // Detener reproducción
    this.onComplete = undefined; // romper la referencia al callback
    this._keyframes = []; // Limpiar los datos
  }
}