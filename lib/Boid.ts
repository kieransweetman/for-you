import * as THREE from "@3d/three";

const minSpeed = 1;
const maxSpeed = 5;

const numSamplesForSmoothing = 20;

const wanderWeight = 0.2;
// Steer towards the average position of nearby boids
const cohesionWeight = 1;
// Steers away from nearby boids
const separationWeight = 1;
// Adopt the average velocity of bearby boids
const alignmentWeight = 1;

const visionRange = 150;

const origin = new THREE.Vector3();
const boundaryRadius = 370;

export default class Boid {
  _scene: any;
  _target: any;
  _mesh: THREE.Mesh;
  _position: THREE.Vector3;
  _geometry: THREE.BufferGeometry;
  _velocity: THREE.Vector3;
  _acceleration: THREE.Vector3;
  _maxForce: number;
  _maxSpeed: number;
  counter: number;
  wanderCounter: number;

  constructor(
    scene: THREE.Scene,
    color: number | null,
  ) {
    const width = globalThis.innerWidth;
    const height = globalThis.innerHeight;
    const aspect = width / height;

    this._position = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._acceleration = new THREE.Vector3();
    this._maxForce = 0.1;
    this._maxSpeed = 4;

    this.scene = scene;

    const { mesh, geometry } = this.getBoid(color);
    this._mesh = mesh;

    // randomize starting position
    //@ts-ignore - position does not exist on mesh, but it does
    this.mesh.position.x = Math.random() * (aspect * 20) - aspect * 10;
    //@ts-ignore - position does not exist on mesh, but it does
    this.mesh.position.y = Math.random() * 20 - 10;
    this._geometry = geometry;

    // re-usable acceleration vector
    this.acceleration = new THREE.Vector3();

    // velocity is speed in a given direction, and in the update method we'll
    // compute an acceleration that will change the velocity
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      0,
    );

    this.counter = 0;
    this.wanderCounter = 0;
  }

  getBoid(
    color: number | null = 0x00ff00,
  ) {
    if (color === null) {
      color = 0x00ff00;
    }

    // geometry
    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    const material = new THREE.MeshBasicMaterial({ color });

    this.mesh = new THREE.Mesh(this.geometry, material);

    return { mesh: this.mesh, geometry: this.geometry };
  }

  get scene() {
    return this._scene;
  }

  set scene(scene) {
    this._scene = scene;
  }

  get mesh() {
    return this._mesh;
  }

  set mesh(mesh) {
    this._mesh = mesh;
  }

  get geometry() {
    return this._geometry;
  }

  set geometry(geometry) {
    this._geometry = geometry;
  }

  get target() {
    return this._target;
  }

  set target(target) {
    this._target = target;
  }

  set position(position) {
    this._position = position;
  }

  get position() {
    return this._position;
  }

  set velocity(velocity) {
    this._velocity = velocity;
  }

  get velocity() {
    return this._velocity;
  }

  set acceleration(acceleration) {
    this._acceleration = acceleration;
  }

  get acceleration() {
    return this._acceleration;
  }

  get maxForce() {
    return this._maxForce;
  }

  get maxSpeed() {
    return this._maxSpeed;
  }

  update(
    delta: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
  ) {
    this.counter++;
    this.wanderCounter++;

    //@ts-ignore - position does not exist on mesh, but it does
    // TODO: understand type error & fix
    this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));

    // Teleport to the opposite side if the boid crosses the boundary

    // ignore all ts errors in this block
    //@ts-ignore - position does not exist on mesh, but it does
    if (this.mesh.position.x < bounds.minX) {
      //@ts-ignore - position does not exist on mesh, but it does
      this.mesh.position.x = bounds.maxX;
      //@ts-ignore - position does not exist on mesh, but it does
    } else if (this.mesh.position.x > bounds.maxX) {
      //@ts-ignore - position does not exist on mesh, but it does
      this.mesh.position.x = bounds.minX;
    }
    //@ts-ignore - position does not exist on mesh, but it does
    if (this.mesh.position.y < bounds.minY) {
      //@ts-ignore - position does not exist on mesh, but it does
      this.mesh.position.y = bounds.maxY;
      //@ts-ignore - position does not exist on mesh, but it does
    } else if (this.mesh.position.y > bounds.maxY) {
      //@ts-ignore - position does not exist on mesh, but it
      this.mesh.position.y = bounds.minY;
    }
  }
}
