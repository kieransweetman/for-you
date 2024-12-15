import * as THREE from "@3d/three";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";

import { useContext, useEffect, useRef, useState } from "react-dom";
import BoidManager from "@/lib/BoidManager.ts";

// Import stats.js from a CDN
import Stats from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/libs/stats.module.js";
import { defineLayout } from "$fresh/src/server/defines.ts";

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
    const numOfBoids = IS_MOBILE ? 50 : 450;
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

  const [isChecked, setIsChecked] = useState(true);

  const handleSetIsChecked = () => {
    setIsChecked(!isChecked);
    boidManager.setactiveSeparation(!isChecked, clock.getDelta());
  };
  return (
    <div
      id="canvas-container"
      className="absolute top-0 bottom-0 left-0 h-[100vh] w-[100vw] z-10 overscroll-none"
      ref={canvasRef}
    >
      <div className="absolute bottom-0 left-0 p-4">
        <label
          htmlFor="separation-checkbox"
          className="flex items-center space-x-2"
        >
          <span className="text-white">Separation</span>
          <input
            type="checkbox"
            className="hidden"
            name="separation"
            id="separation-checkbox"
            onChange={handleSetIsChecked}
            checked={isChecked}
          />
          <div className="relative w-6 h-6">
            <div
              className={`absolute inset-0 rounded-full shadow-inner ${
                isChecked ? "bg-green-500" : "bg-gray-300"
              }`}
            >
            </div>
            {isChecked && (
              <svg
                className="absolute inset-0 w-full h-full text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
