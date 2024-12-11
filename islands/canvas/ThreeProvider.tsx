import { IS_BROWSER } from "$fresh/runtime.ts";
import * as THREE from "@3d/three";

import { createContext, useEffect, useState } from "react-dom";

export const ThreeContext = createContext<typeof THREE | null>(null);

export function ThreeProvider({ children }: { children: React.ReactNode }) {
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
