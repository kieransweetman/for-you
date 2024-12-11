import CanvasComponent from "@/islands/canvas/CanvasComponent.tsx";
import { ThreeProvider } from "@/islands/canvas/ThreeProvider.tsx";

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
