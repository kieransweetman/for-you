import * as THREE from "@3d/three";

const minSpeed = 0.35;
const maxSpeed = 2;

const width = globalThis.innerWidth;
const height = globalThis.innerHeight;
const aspect = width / height;

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
  detectionRadius?: number;
  detectionCircle?: THREE.Mesh;
  isRefBoid?: boolean = false;
  lines: Map<number, THREE.Line>;
  boidRadius: number = 0.2;

  constructor(
    scene: THREE.Scene,
    color: number | null,
  ) {
    this._position = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._acceleration = new THREE.Vector3();
    this._maxForce = 0.1;
    this._maxSpeed = 4;
    this.lines = new Map();
    this.detectionRadius = 2;

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
      (Math.random() - 0.5) * 3,
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

  // Method to check if another boid is within the detection radius
  isWithinDetectionRange(otherBoid: Boid): boolean {
    const distance = this.mesh.position.distanceTo(otherBoid.mesh.position);
    const combinedRadius = this.detectionRadius + otherBoid.boidRadius;
    return distance <= combinedRadius;
  }

  // Method to draw a line between the reference boid and the foreign boid
  drawLineTo(otherBoid: Boid) {
    if (!this.isRefBoid) return;

    if (this.lines.has(otherBoid)) {
      this._scene.remove(this.lines.get(otherBoid)!);
      this.lines.delete(otherBoid);
    }

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = [];
    points.push(this._mesh.position.clone());
    points.push(otherBoid._mesh.position.clone());

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.lines.set(otherBoid, line);
    this._scene.add(line);
  }

  // Method to remove the line between the reference boid and the foreign boid
  removeLineTo(otherBoid: Boid) {
    if (this.lines.has(otherBoid)) {
      this._scene.remove(this.lines.get(otherBoid)!);
      this.lines.delete(otherBoid);
    }
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

  // Method to apply a force to the boid
  applyForce(force: THREE.Vector3) {
    this.acceleration.add(force);
  }

  // Method to calculate the separation force
  separation(boids: Boid[]): THREE.Vector3 {
    const steer = new THREE.Vector3();
    let count = 0;

    for (const other of boids) {
      if (other !== this && this.isWithinDetectionRange(other)) {
        const distance = this.mesh.position.distanceTo(other.mesh.position);
        const diff = new THREE.Vector3().subVectors(
          this.mesh.position,
          other.mesh.position,
        );
        diff.normalize();
        diff.divideScalar(distance); // Weight by distance
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.divideScalar(count);
    }

    if (steer.length() > 0) {
      steer.normalize();
      steer.multiplyScalar(this._maxSpeed);
      steer.sub(this._velocity);
      steer.clampLength(0, this._maxForce);
    }

    return steer;
  }

  // Updated method to include separation rule
  update(
    delta: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
    boids: Boid[],
  ) {
    this.counter++;
    this.wanderCounter++;

    // Apply separation force
    const separationForce = this.separation(boids);
    this.applyForce(separationForce);

    // Update velocity and position
    this._velocity.add(this._acceleration);
    this._velocity.clampLength(0, maxSpeed);
    // Ensure the boid never goes below a certain speed
    if (this._velocity.length() < minSpeed) {
      this._velocity.normalize().multiplyScalar(minSpeed);
    }

    this._mesh.position.add(this._velocity.clone().multiplyScalar(delta));
    this._acceleration.set(0, 0, 0);

    // Toroidal wrapping
    if (this._mesh.position.x < bounds.minX) {
      this._mesh.position.x = bounds.maxX;
    } else if (this._mesh.position.x > bounds.maxX) {
      this._mesh.position.x = bounds.minX;
    }

    if (this._mesh.position.y < bounds.minY) {
      this._mesh.position.y = bounds.maxY;
    } else if (this._mesh.position.y > bounds.maxY) {
      this._mesh.position.y = bounds.minY;
    }

    // Rotate the boid to face the direction of its velocity
    const angle = Math.atan2(this._velocity.y, this._velocity.x);
    this._mesh.rotation.z = angle - Math.PI / 2;
  }
}
