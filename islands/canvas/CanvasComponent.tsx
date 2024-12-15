import * as THREE from "@3d/three";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";

import { useContext, useEffect, useRef } from "react-dom";
import BoidManager from "@/lib/BoidManager.ts";

// Import stats.js from a CDN
import Stats from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/libs/stats.module.js";

const width = globalThis.innerWidth;
const height = globalThis.innerHeight;
const aspect = width / height;
const IS_MOBILE = width < 768;

export default function CanvasComponent() {
  const three = useContext(ThreeContext);
  const canvasRef = useRef<HTMLDivElement>(null);
  const clock = new THREE.Clock();
  const boidManager = new BoidManager();

  if (!three) return <div>Component placeholder</div>;

  useEffect(() => {
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

    //stats setup
    const stats = Stats();
    stats.showPanel(0);

    //adding elements to dom
    canvasRef.current?.appendChild(renderer.domElement);
    canvasRef.current?.appendChild(stats.dom);

    //scene
    const scene = new THREE.Scene();
    // to slight gray
    scene.background = new THREE.Color(0.1, 0.1, 0.1);

    //Boids
    const numOfBoids = IS_MOBILE ? 30 : 450;
    const boidType = "triangle";
    boidManager.initBoids(scene, numOfBoids, boidType);
    boidManager.boids.forEach((boid) => {
      scene.add(boid.mesh);
    });

    const animate = () => {
      stats.begin();
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      boidManager.update(delta, bounds);

      renderer.render(scene, camera);
      stats.end();
    };

    animate();
  }, [canvasRef]);

  return (
    <div
      id="canvas-container"
      className="absolute top-0 bottom-0 left-0 h-[100vh] w-[100vw] z-10 overscroll-none"
      ref={canvasRef}
    >
    </div>
  );
}
