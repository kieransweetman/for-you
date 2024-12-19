import * as THREE from "@3d/three";

import { render, useContext, useEffect, useRef } from "react-dom";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";
import BoidManager from "@/lib/BoidManager.ts";
import BoidSettingsBar from "@/islands/canvas/BoidSettingsBar.tsx";

// Import stats.js from a CDN
import Stats from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/libs/stats.module.js";

import { aspect, bounds, height, IS_MOBILE, width } from "@/lib/common.ts";

const boidManager = new BoidManager();

export default function CanvasComponent() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeCanvasContext = useContext(ThreeContext);
  const clock = new THREE.Clock();
  const mouse = new THREE.Vector2();

  if (!threeCanvasContext) return null;

  const initCanvasSettings = (
    camera: THREE.Camera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
  ) => {
    // @ts-ignore: `position` does not exist, but it does. not sure why
    // TODO understand type error & fix
    camera.position.z = 10;
    renderer.setSize(width, height);
    scene.background = new THREE.Color(0.1, 0.1, 0.1);

    canvasRef.current?.appendChild(renderer.domElement);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const { camera, renderer, scene } = threeCanvasContext;
    initCanvasSettings(camera, scene, renderer);

    //stats setup
    const stats = Stats();
    stats.showPanel(0);

    //adding elements to dom
    canvasRef.current?.appendChild(stats.dom);

    // to slight gray

    //Boids
    const numOfBoids = IS_MOBILE ? 100 : 450;
    const boidType = "triangle";
    boidManager.initBoids(scene, numOfBoids, boidType);
    boidManager.boids.forEach((boid) => {
      scene.add(boid.mesh);
    });

    const raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / globalThis.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / globalThis.innerHeight) * 2 + 1;
    };

    globalThis.addEventListener("mousemove", onMouseMove, false);

    const animate = () => {
      stats.begin();
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      boidManager.update(delta, bounds);

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Reset color of all boids
      boidManager.boids.forEach((boid) => {
        boid.mesh.material.color.set(0xffffff); // Reset to original color (white)
      });

      // // Calculate objects intersecting the ray
      const intersects = raycaster.intersectObjects(
        scene.children,
      );

      // // Change color of intersected objects
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xff0000); // Change to red
      }

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
      <BoidSettingsBar
        clock={clock}
        boidManager={boidManager}
      />
    </div>
  );
}
