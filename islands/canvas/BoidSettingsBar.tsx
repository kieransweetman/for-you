import * as THREE from "@3d/three";
import { ThreeContext } from "@/islands/canvas/ThreeProvider.tsx";

import { useContext, useEffect, useRef, useState } from "react-dom";
import BoidManager from "@/lib/BoidManager.ts";

// Import stats.js from a CDN
import Stats from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/libs/stats.module.js";
import { consumeToken } from "$std/media_types/_util.ts";

const width = globalThis.innerWidth;
const height = globalThis.innerHeight;
const aspect = width / height;

export default function CanvasComponent({ handleSetIsChecked, isChecked }: {
  handleSetIsChecked: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}) {
  return (
    <div className="absolute bottom-0 left-0 p-4 w-full h-54 bg-red-500">
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
  );
}
