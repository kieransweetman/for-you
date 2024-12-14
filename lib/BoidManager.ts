import Boid from "@/lib/Boid.ts";
import * as THREE from "@3d/three";

export default class BoidManager {
  boids;

  constructor() {
    this.boids = [];
    this.initBoids();
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  update() {
    for (const boid of this.boids) {
      boid.update(this.boids);
    }
  }

  initBoids(scene: THREE.Scene, numberOfBoids: number, target: THREE.Vector3) {
    this.boids = this.boids || [];

    let randomX, randomY, randomZ, colour, followTarget, quaternion;

    for (let i = 0; i < numberOfBoids; i++) {
      randomX = Math.random() * 250 - 125;
      randomY = Math.random() * 250 - 125;
      randomZ = Math.random() * 250 - 125;
      colour = null; // will use default color in getBoid
      followTarget = false;
      quaternion = null;

      // reference boid
      if (i === 0) {
        randomX = 0;
        randomY = 0;
        randomZ = 0;
        colour = 0xe56289;
        // followTarget = true
        quaternion = null;
      }

      let position = new THREE.Vector3(randomX, randomY, randomZ);

      const boid = new Boid(
        scene,
        target,
        position,
        quaternion,
        colour,
        followTarget,
      );
      this.boids.push(boid);
    }
  }
}
