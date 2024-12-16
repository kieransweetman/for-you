import Boid from "@/lib/Boid.ts";
import * as THREE from "@3d/three";
import TriangleBoid from "@/lib/TriangleBoid.ts";

type BoidType = "triangle" | "square";

export default class BoidManager {
  boids: Boid[];
  boidType: BoidType = "square";
  _applySeparationRule: boolean = true;

  constructor() {
    this.boids = [];
    this._applySeparationRule = true;
  }

  update(
    delta: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
  ) {
    for (const boid of this.boids) {
      // Check if any other boid is within the detection range
      this.boids.forEach((otherBoid) => {
        if (boid !== otherBoid) {
          if (boid.isWithinDetectionRange(otherBoid)) {
            boid.drawLineTo(otherBoid);
          } else {
            boid.removeLineTo(otherBoid);
          }
        }
      });
      boid.update(delta, bounds, this.boids, this.applySeparationRule);
    }
  }

  set applySeparationRule(apply: boolean) {
    console.log(apply);
    this._applySeparationRule = apply;
  }

  get applySeparationRule() {
    return this._applySeparationRule;
  }

  initBoids(
    scene: THREE.Scene,
    numberOfBoids: number,
    boidType: "triangle" | "square",
  ) {
    this.boids = this.boids || [];

    let color;

    for (let i = 0; i < numberOfBoids; i++) {
      color = null; // will use default color in getBoid

      // reference boid

      if (i === 0) {
        // reference boid is red
        color = 0xff0000;
        const isRefBoid = true;
        const boid = new TriangleBoid(scene, color, isRefBoid);
        this.boids.push(boid);
        continue;
        // also show the circum of the boids 'range'
      }

      this.boids.push(this.createBoidByType(scene, color, boidType));
    }
  }

  createBoidByType(
    scene: THREE.Scene,
    color: number | null,
    boidType: BoidType,
  ) {
    color = null;
    if (this.boids.length === 0) {
      color = 0xff0000;
    }
    let boid;
    switch (boidType) {
      case "triangle":
        boid = new TriangleBoid(scene, color);
        break;
      case "square":
      default:
        boid = new Boid(scene, color);
        break;
    }

    return boid;
  }
}
