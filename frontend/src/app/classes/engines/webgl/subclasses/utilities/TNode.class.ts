// Para transpilar este archivo:
// 1) Instala TypeScript:
//    - Local (recomendado): npm install typescript --save-dev
//    - Global: npm install -g typescript
// 2) Instala glmatrix:
//    - npm i gl-matrix
// 3) Compila:
//    - Con instalación local: npx tsc tnode.ts
//    - Con instalación global: tsc tnode.ts
// Se generará tnode.js en el mismo directorio.

/**
 * Representa un nodo en un árbol de escena 3D.
 * Cada nodo puede tener una entidad asociada y transformaciones locales.
 */
import { mat4, vec3, quat } from "gl-matrix";
import { IEntity } from "../entities/IEntity.class";
import { RenderContext } from "./RenderContext.class";
import { AnimationEntity } from "../entities/EAnimation.class";

/**
 * Representa un nodo en un árbol de escena 3D.
 * Cada nodo puede tener una entidad asociada y transformaciones locales.
 */
export class TNode {
  private _parent?: TNode;
  private _children: TNode[] = [];
  private _entity?: IEntity;
  private _animation?: AnimationEntity;

  private _vtranslation: vec3 = vec3.create();
  // private _vrotation: vec3 = vec3.create();
  private _vscale: vec3 = vec3.fromValues(1, 1, 1);

  private _qrotation: quat = quat.create();

  private _tmatrix = mat4.create();

  private _dirty: boolean = true;

  public pickingId: number = 0;
  public isPickingRoot: boolean = false;

  // --------------------------
  // Constructor
  // --------------------------

  /**
   * Crea un nodo con una entidad opcional y un nodo padre opcional.
   * @param entity Entidad asociada al nodo. Si no se proporciona, es un nodo grupo.
   * @param parent Nodo padre. Si no se proporciona, es un nodo raíz.
   */
  constructor(entity?: IEntity, parent?: TNode) {
    if (entity) this._entity = entity;
    if (parent) parent.addChild(this);
  }

  // --------------------------
  // Getters y Setters
  // --------------------------

  /** Nodo padre de este nodo, si existe. */
  get parent(): TNode | undefined {
    return this._parent;
  }

  set parent(parent: TNode) {
    this._parent = parent;
  }

  /** Lista de nodos hermanos de este nodo. */
  get siblings(): TNode[] {
    if (!this.parent) return [];
    return this.parent._children.filter((child) => child !== this);
  }

  /** Entidad asociada al nodo, si existe. */
  get entity(): IEntity | undefined {
    return this._entity;
  }

  set entity(entity: IEntity) {
    this._entity = entity;
  }

  /** Animación asociada al nodo, si existe. */
  get animation(): AnimationEntity | undefined {
    return this._animation;
  }

  set animation(animation: AnimationEntity | undefined) {
    this._animation = animation;
  }

  /** Indica si el nodo es raíz (no tiene padre). */
  get isRoot() {
    return !this._parent;
  }

  /** Indica si el nodo es un grupo (no tiene entidad). */
  get isGroup() {
    return !this._entity;
  }

  /** Indica si el nodo es hoja (no tiene hijos). */
  get isLeaf() {
    return this._children.length === 0;
  }

  /** Vector de traslación local del nodo. */
  get translation() {
    return this._vtranslation;
  }

  /** Vector de rotación local del nodo (quat.) */
  get rotation() {
    return this._qrotation;
  }

  /** Vector de escala local del nodo. */
  get scaling() {
    return this._vscale;
  }

  /** Matriz de transformación global del nodo. */
  get tmatrix() {
    this._updateMatrix();
    return this._tmatrix;
  }

  /**
   * Orienta el nodo para que mire hacia un punto objetivo definido por coordenadas.
   * Actualiza el quaternion de rotación interno basándose en la posición actual del nodo.
   *
   * @param tx Coordenada X del objetivo.
   * @param ty Coordenada Y del objetivo.
   * @param tz Coordenada Z del objetivo.
   */
  public lookAt(tx: number, ty: number, tz: number) {
    const target = vec3.fromValues(tx, ty, tz);
    const up = vec3.fromValues(0, 1, 0);
    const tempMat = mat4.create();

    mat4.targetTo(tempMat, this._vtranslation, target, up);

    mat4.getRotation(this._qrotation, tempMat);

    this._markDirty();
  }
  // --------------------------
  // Dirty propagation
  // --------------------------

  /**
   * Marca la matriz local del nodo como sucia (_dirty = true) y propaga
   * la suciedad a todos sus hijos. Esto asegura que la próxima vez que
   * se llame a _updateMatrix(), tanto este nodo como sus descendientes
   * actualizarán sus matrices globales.
   */
  private _markDirty() {
    if (this._dirty) return;

    this._dirty = true;

    for (const c of this._children) {
      c._markDirty();
    }
  }

  // --------------------------
  // Manejo del árbol
  // --------------------------
  /**
   * Añade un nodo hijo a este nodo.
   * Establece este nodo como padre del hijo y lo agrega al array de hijos.
   * @param child Nodo a añadir.
   */
  public addChild(child: TNode): void {
    this._children.push(child);
    child._parent = this;
  }

  /**
   * Inserta un nodo hijo en una posición específica del array de hijos.
   * Establece este nodo como padre del hijo.
   * @param child Nodo a insertar.
   * @param index Posición en el array de hijos.
   */
  public insertChild(child: TNode, index: number): void {
    this._children.splice(index, 0, child);
    child._parent = this;
  }

  /**
   * Busca un nodo específico entre este nodo y todos sus descendientes.
   * @param target Nodo a buscar.
   * @returns El nodo encontrado o undefined si no existe.
   */
  public findChild(target: TNode): TNode | undefined {
    if (this === target) return this;

    for (const child of this._children) {
      const res = child.findChild(target);
      if (res) return res;
    }

    return undefined;
  }

  /**
   * Elimina un hijo directo de este nodo.
   * Desvincula el hijo eliminándolo del array de hijos y limpiando su padre.
   * @param target Nodo hijo a eliminar.
   * @returns True si se eliminó correctamente, false si no se encontró.
   */
  public removeChild(target: TNode): boolean {
    const i = this._children.indexOf(target);
    if (i === -1) return false;
    this._children.splice(i, 1);
    target._parent = undefined;
    return true;
  }

  /**
   * Limpia todos los hijos de este nodo de forma profunda.
   * Útil para resetear el rootNode sin perder la referencia del mismo.
   */
  public clear(): void {
    // Limpiamos los hijos de nuestros hijos primero (recursivo)
    for (const child of this._children) {
      child.clear();
      child._parent = undefined;
      child._entity = undefined; // Muy importante para liberar memoria de GPU
    }
    // Vaciamos nuestra lista de hijos
    this._children = [];
    this._dirty = true;
  }

  /**
   * Elimina un descendiente del árbol (puede no ser hijo directo).
   * Busca el nodo en todo el árbol y, si se encuentra, lo desvincula
   * de su padre.
   * @param target Nodo descendiente a eliminar.
   * @returns True si se eliminó correctamente, false si no se encontró.
   */
  public removeDescendant(target: TNode): boolean {
    const node = this.findChild(target);

    const parent = node?._parent;
    if (!parent) return false;

    const siblings = parent._children;
    const i = siblings.indexOf(node);
    if (i < 0) return false;

    siblings.splice(i, 1);
    node._parent = undefined;

    return true;
  }

  public update(deltaTime: number = 0): void {
    // Primero aplicar la animación (si existe) - anima transformaciones
    this._animation?.update?.(deltaTime, this);

    // Luego la entidad hace su lógica (render, etc.)
    this._entity?.update?.(deltaTime, this);

    // Finalmente actualizar hijos con transformaciones ya actualizadas
    for (const child of this._children) {
      child.update(deltaTime);
    }
  }

  // --------------------------
  // Recorridos
  // --------------------------

  /**
   * Recorre este nodo y todos sus descendientes en preorden.
   * Ejecuta la función de callback en cada nodo.
   * @param callback Función a ejecutar en cada nodo durante el recorrido.
   */
  public traverse(callback: (node: TNode) => void) {
    callback(this);
    this._children.forEach((child) => child.traverse(callback));
  }

  // --------------------------
  // Transformaciones
  // --------------------------

  /**
   * Aplica una traslación relativa al nodo.
   * La traslación se suma a la posición actual del nodo.
   * @param x Desplazamiento en unidades sobre el eje X.
   * @param y Desplazamiento en unidades sobre el eje Y.
   * @param z Desplazamiento en unidades sobre el eje Z.
   */
  public translate(x: number, y: number, z: number) {
    vec3.add(this._vtranslation, this._vtranslation, vec3.fromValues(x, y, z));
    this._markDirty();
  }

  /**
   * Sustituye la traslación del nodo por la proporcionada.
   * Esto reemplaza completamente la posición actual del nodo.
   * @param x Posición absoluta sobre el eje X.
   * @param y Posición absoluta sobre el eje Y.
   * @param z Posición absoluta sobre el eje Z.
   */
  public setTranslation(x: number, y: number, z: number) {
    this._vtranslation = vec3.fromValues(x, y, z);
    this._markDirty();
  }

  // /**
  //  * Aplica una rotación relativa al nodo usando ángulos Euler.
  //  * Sincroniza el quaternion de rotación automáticamente.
  //  * @param x Rotación en grados sobre el eje X.
  //  * @param y Rotación en grados sobre el eje Y.
  //  * @param z Rotación en grados sobre el eje Z.
  //  */
  // public rotate(x: number, y: number, z: number) {
  //   const q = quat.create();
  //   quat.fromEuler(q, x, y, z);
  //   quat.multiply(this._qrotation, this._qrotation, q);
  //   update del quat para sincronizacion...
  //   this._markDirty();
  // }

  // /**
  //  * Sustituye la rotación del nodo usando ángulos Euler.
  //  * Esto reemplaza completamente la rotación existente.
  //  * Sincroniza el quaternion de rotación automáticamente.
  //  * @param x Rotación en grados sobre el eje X.
  //  * @param y Rotación en grados sobre el eje Y.
  //  * @param z Rotación en grados sobre el eje Z.
  //  */
  // public setRotation(x: number, y: number, z: number) {
  //   quat.fromEuler(this._qrotation, x, y, z);
  //   update del quat para sincronizacion...
  //   this._markDirty();
  // }

  /**
   * Aplica una rotación relativa al nodo usando un quaternion.
   * La rotación se multiplica sobre la rotación existente.
   * @param x Componente X del quaternion.
   * @param y Componente Y del quaternion.
   * @param z Componente Z del quaternion.
   * @param w Componente W del quaternion.
   */
  public rotate(x: number, y: number, z: number, w: number) {
    quat.multiply(
      this._qrotation,
      this._qrotation,
      quat.fromValues(x, y, z, w),
    );
    // this._updateEulerFromQuat();
    this._markDirty();
  }

  /**
   * Sustituye la rotación del nodo usando un quaternion.
   * Esto reemplaza completamente la rotación existente.
   * @param x Componente X del quaternion.
   * @param y Componente Y del quaternion.
   * @param z Componente Z del quaternion.
   * @param w Componente W del quaternion.
   */
  public setRotation(x: number, y: number, z: number, w: number) {
    quat.copy(this._qrotation, quat.fromValues(x, y, z, w));
    // this._updateEulerFromQuat();
    this._markDirty();
  }

  /**
   * Aplica una escala relativa al nodo.
   * La escala se multiplica por la escala actual del nodo.
   * @param x Factor de escala relativo sobre el eje X.
   * @param y Factor de escala relativo sobre el eje Y.
   * @param z Factor de escala relativo sobre el eje Z.
   */
  public scale(x: number, y: number, z: number) {
    vec3.multiply(this._vscale, this._vscale, vec3.fromValues(x, y, z));
    this._markDirty();
  }

  /**
   * Sustituye la escala del nodo por la proporcionada.
   * Esto reemplaza completamente la escala actual del nodo.
   * @param x Factor de escala absoluto sobre el eje X.
   * @param y Factor de escala absoluto sobre el eje Y.
   * @param z Factor de escala absoluto sobre el eje Z.
   */
  public setScale(x: number, y: number, z: number) {
    this._vscale = vec3.fromValues(x, y, z);
    this._markDirty();
  }

  /**
   * Actualiza la matriz de transformación local del nodo si está marcada como sucia.
   * La matriz se considera sucia cuando alguno de los vectores de transformación
   * (_vtranslation, _vscale) o la rotación (_qrotation) han cambiado.
   *
   * Si el nodo tiene un padre, la matriz local se multiplica por la matriz global
   * del padre para calcular la transformación global del nodo.
   * Una vez actualizada, la matriz se marca como limpia (_dirty = false).
   */
  private _updateMatrix() {
    if (!this._dirty) return;

    mat4.fromRotationTranslationScale(
      this._tmatrix,
      this._qrotation,
      this._vtranslation,
      this._vscale,
    );

    if (this._parent) {
      mat4.multiply(this._tmatrix, this._parent.tmatrix, this._tmatrix);
    }

    this._dirty = false;
  }

  /**
   * Sustituye la matriz de transformación del nodo por la proporcionada.
   * Esto reemplaza la matriz local del nodo y marca el nodo como sucio,
   * provocando que sus hijos también actualicen sus matrices en el próximo render.
   * @param tmatrix Matriz de transformación 4x4 que reemplazará la matriz actual del nodo.
   */
  public setTransformationMatrix(tmatrix: mat4) {
    mat4.copy(this._tmatrix, tmatrix);
    this._markDirty();
  }

  // --------------------------
  // Render
  // --------------------------

  /**
   * Recorre el nodo y todos sus descendientes en preorden.
   * Actualiza las matrices de transformación si están marcadas como sucias
   * y llama al método render de la entidad asociada (si existe).
   */
  public render(context: RenderContext) {
    this._updateMatrix();

    this._entity?.render(this._tmatrix, context);

    for (const child of this._children) {
      child.render(context);
    }
  }
}
