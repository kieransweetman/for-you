import { IS_BROWSER } from "$fresh/runtime.ts";
import * as THREE from "@3d/three";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react-dom";

const ThreeContext = createContext<typeof THREE | null>(null);

function ThreeProvider({ children }: { children: React.ReactNode }) {
  if (!IS_BROWSER) {
    return (
      <p>Three js must be loaded on the client. No children will render</p>
    );
  }

  const [value, setValue] = useState<typeof THREE | null>(null);

  useEffect(() => {
    if (!value) {
      setValue(THREE);
    }
  }, [THREE]);

  return (
    <ThreeContext.Provider value={value}>
      {children}
    </ThreeContext.Provider>
  );
}

function CanvasComponent() {
  const three = useContext(ThreeContext);
  const canvasRef = useRef<HTMLDivElement>(null);
  if (!three) return <div>Component placeholder</div>;

  useEffect(() => {
    const width = globalThis.innerWidth;
    const height = globalThis.innerHeight;

    // camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);

    // @ts-ignore: `position` does not exist, but it does. not sure why
    // TODO understand type error & fix
    camera.position.z = 1;

    //scene
    const scene = new THREE.Scene();
    // to slight gray
    scene.background = new THREE.Color(0.1, 0.1, 0.1);

    // geometry
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    canvasRef.current?.appendChild(renderer.domElement);

    // Raycaster and mouse vector
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse move event listener
    if (canvasRef) {
      canvasRef.current?.addEventListener("mousemove", onMouseMove, false);
    }

    function onMouseMove(event: MouseEvent) {
      // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
    }

    const animate = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      // Change color of the intersected object
      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
      } else {
        mesh.material.color.set(0x00ff00);
      }

      // requestAnimationFrame(animate);

      // @ts-ignore: rotation doesn't exist on `mesh` when it should
      // Rotate the mesh
      mesh.rotation.x += 0.01;
      // @ts-ignore: see above comment
      mesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);
  }, [canvasRef]);

  return (
    <div
      id="canvas-container"
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
      {children}
    </ThreeProvider>
  );
}
