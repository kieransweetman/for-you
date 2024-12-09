import { IS_BROWSER } from "$fresh/runtime.ts";
import * as THREE from "@3d/three";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const ThreeContext = createContext<typeof THREE | null>(null);

function ThreeProvider({ children }: { children: React.ReactNode }) {
  if (!IS_BROWSER) {
    return (
      <p>Three js must be loaded on the client. No children will render</p>
    );
  }

  const [value, setValue] = useState<typeof THREE | null>(null);

  return (
    <>
      <div className="">
        <ThreeContext.Provider value={value}>
          {children}
        </ThreeContext.Provider>
        {children}
      </div>

      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={() => {
          // @ts-ignore
          setValue(window.THREE);
          //remove all other instaneces of three on the window object
        }}
        defer
      >
      </script>
    </>
  );
}

function CanvasComponent() {
  const three = useContext(ThreeContext);
  const canvasRef = useRef<HTMLDivElement>(null);
  if (!three) return <div>Component placeholder</div>;
  console.log(three);
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    // to slight gray
    scene.background = new THREE.Color(0.1, 0.1, 0.1);
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    // Set background to transparent
    // renderer.setClearColor(0x000000, 0);

    canvasRef.current?.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the mesh
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, [canvasRef]);
  return (
    <div
      id="canvas"
      className="absolute top-0 bottom-0 left-0  h-[100vh] w-[100vw] z-10"
      ref={canvasRef}
    >
    </div>
  );
}

export default function CanvasIsland(
  { children }: { children?: React.ReactNode },
) {
  return (
    <ThreeProvider>
      <CanvasComponent />
      {children && children}
    </ThreeProvider>
  );
}
