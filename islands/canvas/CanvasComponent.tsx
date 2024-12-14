import * as THREE from "@3d/three";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";

import { useContext, useEffect, useRef } from "react-dom";
import BoidManager from "@/lib/BoidManager.ts";

export default function CanvasComponent() {
  const three = useContext(ThreeContext);
  const canvasRef = useRef<HTMLDivElement>(null);
  const clock = new THREE.Clock();
  const boidManager = new BoidManager();

  if (!three) return <div>Component placeholder</div>;

  useEffect(() => {
    const width = globalThis.innerWidth;
    const height = globalThis.innerHeight;
    const aspect = width / height;

    // camera
    const camera = new THREE.OrthographicCamera(
      -aspect * 10,
      aspect * 10,
      10,
      -10,
      0.1,
      1000,
    );

    const bounds = {
      minX: -aspect * 10,
      maxX: aspect * 10,
      minY: -10,
      maxY: 10,
    };

    // @ts-ignore: `position` does not exist, but it does. not sure why
    // TODO understand type error & fix
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    canvasRef.current?.appendChild(renderer.domElement);

    //scene
    const scene = new THREE.Scene();
    // to slight gray
    scene.background = new THREE.Color(0.1, 0.1, 0.1);

    //Boids
    boidManager.initBoids(scene, 500);
    boidManager.boids.forEach((boid) => {
      scene.add(boid.mesh);
    });

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      boidManager.update(delta, bounds);

      renderer.render(scene, camera);
    };

    animate();
  }, [canvasRef]);

  return (
    <div
      id="canvas-container"
      className="absolute top-0 bottom-0 left-0 h-[100vh] w-[100vw] z-10"
      ref={canvasRef}
    >
    </div>
  );
}
