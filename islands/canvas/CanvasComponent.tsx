import * as THREE from "@3d/three";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";

import { useContext, useEffect, useRef } from "react-dom";
import BoidManager from "@/lib/BoidManager.ts";

export default function CanvasComponent() {
  const three = useContext(ThreeContext);
  const canvasRef = useRef<HTMLDivElement>(null);

  const boidManager = new BoidManager();

  if (!three) return <div>Component placeholder</div>;

  useEffect(() => {
    const width = globalThis.innerWidth;
    const height = globalThis.innerHeight;

    // camera
    const camera = new THREE.PerspectiveCamera(
      70,
      width / height,
      0.01,
      10000000,
    );

    // @ts-ignore: `position` does not exist, but it does. not sure why
    // TODO understand type error & fix
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    canvasRef.current?.appendChild(renderer.domElement);

    //scene
    const scene = new THREE.Scene();
    // to slight gray
    scene.background = new THREE.Color(0.1, 0.1, 0.1);

    //Boids
    boidManager.initBoids(scene, 100, new THREE.Vector3(0, 0, 0));
    boidManager.boids.forEach((boid) => {
      scene.add(boid.mesh);
    });

    // TODO remove this model sometime soon (below this comment)

    // geometry
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // renderer
    // Raycaster and mouse vector
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse move event listener
    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
    };
    if (canvasRef) {
      canvasRef.current?.addEventListener("mousemove", onMouseMove, false);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      // Change color of the intersected object
      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
      } else {
        mesh.material.color.set(0x00ff00);
      }

      // if (arrowModel) {
      //   // arrowModel.rotation.y += 0.01;
      //   arrowModel.position.x += 0.01;

      //   // Check if the model has left the scene and warp it to the opposite side
      //   if (arrowModel.position.x > boundary.maxX) {
      //     arrowModel.position.x = boundary.minX;
      //   }
      //   if (arrowModel.position.x < boundary.minX) {
      //     arrowModel.position.x = boundary.maxX;
      //   }
      //   if (arrowModel.position.y > boundary.maxY) {
      //     arrowModel.position.y = boundary.minY;
      //   }
      //   if (arrowModel.position.y < boundary.minY) {
      //     arrowModel.position.y = boundary.maxY;
      //   }
      //   // if (arrowModel.position.z > boundary.maxX) arrowModel.position.z = -1;
      //   // if (arrowModel.position.z < boundary.maxX) arrowModel.position.z = 1;
      // }

      // requestAnimationFrame(animate);

      // @ts-ignore: rotation doesn't exist on `mesh` when it should
      // Rotate the mesh
      mesh.rotation.x += 0.01;
      // @ts-ignore: see above comment
      mesh.rotation.y += 0.01;
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
