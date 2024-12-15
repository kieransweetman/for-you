import { IS_BROWSER } from "$fresh/runtime.ts";
import * as THREE from "@3d/three";

import { createContext, useEffect, useState } from "react-dom";

export const ThreeContext = createContext<typeof THREE | null>(null);

export function ThreeProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<typeof THREE | null>(null);

  useEffect(() => {
    if (IS_BROWSER && !value) {
      setValue(THREE);
    }
  }, [value]);

  if (!IS_BROWSER || !value) {
    return <p>Loading Three.js...</p>;
  }

  return (
    <ThreeContext.Provider value={value}>
      {children}
    </ThreeContext.Provider>
  );
}
