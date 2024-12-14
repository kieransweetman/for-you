import Boid from "@/lib/Boid.ts";
import * as THREE from "@3d/three";

export default class BoidManager {
  boids: Boid[];

  constructor() {
    this.boids = [];
  }

  update(
    delta: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
  ) {
    for (const boid of this.boids) {
      boid.update(delta, bounds);
    }
  }

  initBoids(scene: THREE.Scene, numberOfBoids: number) {
    this.boids = this.boids || [];

    let color;

    for (let i = 0; i < numberOfBoids; i++) {
      color = null; // will use default color in getBoid

      const boid = new Boid(
        scene,
        color,
      );
      this.boids.push(boid);
    }
  }
}
