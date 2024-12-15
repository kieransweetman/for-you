import * as THREE from "@3d/three";
import Boid from "@/lib/Boid.ts";
const width = globalThis.innerWidth;
const height = globalThis.innerHeight;
const aspect = width / height;

export default class TriangleBoid extends Boid {
  constructor(scene: any, color: number | null, isRefBoid?: boolean) {
    super(scene, color);

    this._position = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._acceleration = new THREE.Vector3();
    this._maxForce = 0.1;
    this._maxSpeed = 4;
    this.isRefBoid = isRefBoid;

    this.scene = scene;

    const { mesh, geometry } = this.getBoid(color);
    this._mesh = mesh;
    this._geometry = geometry;

    //@ts-ignore - position does not exist on mesh, but it does
    this.mesh.position.x = Math.random() * (aspect * 20) - aspect * 10;
    //@ts-ignore - position does not exist on mesh, but it does
    this.mesh.position.y = Math.random() * 20 - 10;

    // re-usable acceleration vector
    this.acceleration = new THREE.Vector3();

    // velocity is speed in a given direction, and in the update method we'll
    // compute an acceleration that will change the velocity
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 3,
      0,
    );
  }

  override getBoid(color: number | null) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0,
      0.175,
      0, // Head of the triangle (leading point)
      -0.175,
      -0.175,
      0, // Left point
      0.175,
      -0.175,
      0, // Right point
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshBasicMaterial({ color: color || 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);

    // Create the detection circle outline
    const circleGeometry = new THREE.CircleGeometry(.5, 32); // Adjust the radius as needed
    this.detectionRadius = .5;
    const edgesGeometry = new THREE.EdgesGeometry(circleGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
    });
    const detectionCircle = new THREE.LineSegments(
      edgesGeometry,
      edgesMaterial,
    );
    detectionCircle.position.z = -0.01; // Slightly behind the boid to avoid z-fighting

    if (this.isRefBoid) {
      mesh.add(detectionCircle);
    }

    return { mesh, geometry };
  }
}
