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

const clamp = function (it, min, max) {
  return Math.min(Math.max(it, min), max);
};

export default class Boid {
  _scene: any;
  _mesh: THREE.Mesh;
  _target: any;
  _geometry: THREE.Geometry;
  _position: THREE.Vector3;
  _velocity: THREE.Vector3;
  _acceleration: THREE.Vector3;
  _maxForce: number;
  _maxSpeed: number;

  constructor(
    scene,
    target,
    position,
    quaternion,
    colour,
    followTarget = false,
  ) {
    this._position = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._acceleration = new THREE.Vector3();
    this._maxForce = 0.1;
    this._maxSpeed = 4;

    this.scene = scene;
    const { mesh, geometry } = this.getBoid(position, quaternion, colour);
    this.mesh = mesh;
    this.geometry = geometry;
    this.target = target;

    // re-usable acceleration vector
    this.acceleration = new THREE.Vector3();

    // velocity is speed in a given direction, and in the update method we'll
    // compute an acceleration that will change the velocity
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
    );

    // whether this boid will follow the target
    this.followTarget = followTarget;

    // remember the last however many velocities so we can smooth the heading of the boid
    this.velocitySamples = [];

    this.wanderTarget = new THREE.Vector3(
      mesh.position.x,
      mesh.position.y,
      300,
    );

    this.debug = false;
    this.counter = 0;
    this.wanderCounter = 0;
    this.arrows = [];
  }

  getBoid(
    position = new THREE.Vector3(0, 0, 0),
    quaternion = null,
    color = 0x156289,
  ) {
    if (color === null) {
      color = 0x156289;
    }

    let geometry = new THREE.ConeGeometry(5, 10, 8);
    // rotate the geometry, because the face used by lookAt is not the cone's "tip"
    const degToRad = (d: number) => d * (Math.PI / 180);
    geometry.rotateX(degToRad(90));

    let mesh = new THREE.Group();
    let lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    let meshMaterial = new THREE.MeshPhongMaterial({
      color,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    mesh.add(
      new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        lineMaterial,
      ),
    );
    mesh.add(new THREE.Mesh(geometry, meshMaterial));

    mesh.position.copy(position);

    return { mesh, geometry };
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

  update(delta, neighbours, obstacles) {
    this.counter++;
    this.wanderCounter++;

    // fly towards the target
    if (this.target && this.followTarget) {
      // let pos = this.target.position.clone()
      // pos.sub(this.mesh.position);
      // let accelerationTowardsTarget = this.steerTowards(pos).multiplyScalar(maxForceSeek);

      let accelerationTowardsTarget = this.seek(delta, this.target.position);

      // "flee" would use sub
      this.acceleration.add(accelerationTowardsTarget);
    } else {
      if (this.mesh.position.distanceTo(origin) > boundaryRadius) {
        this.acceleration.add(this.wander(delta).multiplyScalar(20));
      } else {
        this.acceleration.add(this.wander(delta).multiplyScalar(wanderWeight));
      }
    }

    // steering behaviour: alignment
    this.acceleration.add(
      this.alignment(delta, neighbours).multiplyScalar(alignmentWeight),
    );

    // steering behaviour: cohesion
    this.acceleration.add(
      this.cohesion(delta, neighbours).multiplyScalar(cohesionWeight),
    );

    // steering behaviour: separation
    this.acceleration.add(
      this.separation(delta, neighbours).multiplyScalar(separationWeight),
    );

    // avoid collisions with world obstacles
    let originPoint = this.mesh.position.clone();
    let localVertex = this.geometry.vertices[0].clone();
    let globalVertex = localVertex.applyMatrix4(this.mesh.matrix);
    let directionVector = globalVertex.sub(this.mesh.position);
    let raycaster = new THREE.Raycaster(
      originPoint,
      directionVector.clone().normalize(),
      0,
      visionRange,
    );

    if (this.debug) {
      const arrow = new THREE.ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        50,
        0xff0000,
      );
      if (this.counter % 50 === 0) {
        arrow.name = Math.random().toString(36).substring(2, 15);
        this.arrows.push(arrow);
        this.scene.add(arrow);
        if (this.arrows.length > 3) {
          let toBeRemoved = this.arrows.shift();
          this.scene.remove(this.scene.getObjectByName(toBeRemoved.name));
        }
      }
    }

    // obstacle meshes are Group, and the first child is the mesh we want to ray-trace
    let collisionResults = raycaster.intersectObjects(
      obstacles.map((o) => o.mesh.children[0]),
    );
    if (collisionResults.length > 0) {
      // flee from the object
      // let seek = this.seek(delta, collisionResults[0].point)
      // this.acceleration.add(seek.negate().multiplyScalar(100))

      // gently dodge object
      for (let i = 0; i < utils.sphereCastDirections.length; i++) {
        const direction = utils.sphereCastDirections[i];
        raycaster = new THREE.Raycaster(originPoint, direction, 0, visionRange);
        let spectrumCollision = raycaster.intersectObject(
          collisionResults[0].object,
        );
        if (spectrumCollision.length === 0) {
          this.acceleration.add(direction.clone().multiplyScalar(100));
          break;
        }
      }
    }

    this.applyAcceleration(delta);

    this.lookWhereGoing();
  }

  applyAcceleration(delta: number) {
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0, 0); // reset
    this.velocity.clampLength(minSpeed, maxSpeed);
    this.mesh.position.add(this.velocity);
  }

  /**
   * From the paper:
   * Collision Avoidance: avoid collisions with nearby flockmates (aka separation)
   *
   * Simply look at each neighbour, and if it's within a defined small distance (say 100 units),
   * then move it as far away again as it already is. This is done by subtracting from a vector
   * "steerVector" (initialised to zero) the displacement of each neighbour which is nearby.
   */
  separation(delta, neighbours, range = 30) {
    const steerVector = new THREE.Vector3();

    let neighbourInRangeCount = 0;

    neighbours.forEach((neighbour) => {
      // skip same object
      if (neighbour.mesh.id === this.mesh.id) return;

      const distance = neighbour.mesh.position.distanceTo(this.mesh.position);
      if (distance <= range) {
        let diff = this.mesh.position.clone().sub(neighbour.mesh.position);
        diff.divideScalar(distance); // weight by distance
        steerVector.add(diff);
        neighbourInRangeCount++;
      }
    });

    if (neighbourInRangeCount !== 0) {
      steerVector.divideScalar(neighbourInRangeCount);
      steerVector.normalize();
      steerVector.multiplyScalar(maxSpeed);
      let maxForce = delta * 5;
      steerVector.clampLength(0, maxForce);
    }

    return steerVector;
  }

  /**
   * Produces a steering force that keeps a boid's heading aligned with its neighbours.
   * (average velocity)
   *
   * @param {*} neighbours
   */
  alignment(delta, neighbours, range = 50) {
    let steerVector = new THREE.Vector3();
    const averageDirection = new THREE.Vector3();

    let neighboursInRangeCount = 0;

    neighbours.forEach((neighbour) => {
      // skip same object
      if (neighbour.mesh.id === this.mesh.id) return;

      const distance = neighbour.mesh.position.distanceTo(this.mesh.position);
      if (distance <= range) {
        neighboursInRangeCount++;
        averageDirection.add(neighbour.velocity.clone());
      }
    });

    if (neighboursInRangeCount > 0) {
      averageDirection.divideScalar(neighboursInRangeCount);
      averageDirection.normalize();
      averageDirection.multiplyScalar(maxSpeed);

      steerVector = averageDirection.sub(this.velocity);
      let maxForce = delta * 5;
      steerVector.clampLength(0, maxForce);
    }

    return steerVector;
  }

  /**
   * Produces a steering force that moves a boid toward the average position of its neighbours.
   *
   * @param {*} neighbours
   */
  cohesion(delta, neighbours, range = 50) {
    const centreOfMass = new THREE.Vector3();

    let neighboursInRangeCount = 0;

    neighbours.forEach((neighbour) => {
      // skip same object
      if (neighbour.mesh.id === this.mesh.id) return;

      const distance = neighbour.mesh.position.distanceTo(this.mesh.position);
      if (distance <= range) {
        neighboursInRangeCount++;
        centreOfMass.add(neighbour.mesh.position);
      }
    });

    if (neighboursInRangeCount > 0) {
      centreOfMass.divideScalar(neighboursInRangeCount);

      // "seek" the centre of mass
      return this.seek(delta, centreOfMass);
    } else {
      return new THREE.Vector3();
    }
  }

  rndCoord(range = 295) {
    return (Math.random() - 0.5) * range * 2;
  }
  wander(delta) {
    let distance = this.mesh.position.distanceTo(this.wanderTarget);
    if (distance < 5) {
      // when we reach the target, set a new random target
      this.wanderTarget = new THREE.Vector3(
        this.rndCoord(),
        this.rndCoord(),
        this.rndCoord(),
      );
      this.wanderCounter = 0;
    } else if (this.wanderCounter > 500) {
      this.wanderTarget = new THREE.Vector3(
        this.rndCoord(),
        this.rndCoord(),
        this.rndCoord(),
      );
      this.wanderCounter = 0;
    }

    return this.seek(delta, this.wanderTarget);
  }

  lookWhereGoing(smoothing = true) {
    let direction = this.velocity.clone();
    if (smoothing) {
      if (this.velocitySamples.length == numSamplesForSmoothing) {
        this.velocitySamples.shift();
      }

      this.velocitySamples.push(this.velocity.clone());
      direction.set(0, 0, 0);
      this.velocitySamples.forEach((sample) => {
        direction.add(sample);
      });
      direction.divideScalar(this.velocitySamples.length);
    }

    direction.add(this.mesh.position);
    this.mesh.lookAt(direction);
  }
}
