import { useState } from "react";
import BoidManager from "@/lib/BoidManager.ts";
import * as THREE from "@3d/three";

import { aspect, bounds, height, IS_MOBILE, width } from "@/lib/common.ts";

export default function BoidSettingsBar({ boidManager, clock }: {
  boidManager: BoidManager;
  clock: THREE.Clock;
}) {
  const [isSeparationChecked, setIsSeparationChecked] = useState(true);
  const [isAlignmentChecked, setIsAlignmentChecked] = useState(true);
  const [isCohesionChecked, setIsCohesionChecked] = useState(true);

  const handleApplySeparation = (e) => {
    boidManager.applySeparationRule = e.target.checked;
    boidManager.update(clock.getDelta(), bounds);
    setIsSeparationChecked(e.target.checked);
    return;
  };
  const handleApplyAlignment = (e) => {
    boidManager.applyAlignmentRule = e.target.checked;
    boidManager.update(clock.getDelta(), bounds);
    setIsAlignmentChecked(e.target.checked);
    return;
  };

  const handleApplyCohesion = (e) => {
    boidManager.applyCohesionRule = e.target.checked;
    boidManager.update(clock.getDelta(), bounds);
    setIsCohesionChecked(e.target.checked);
    return;
  };

  return (
    <div className="flex justify-evenly absolute bottom-0 left-0 p-4 w-full h-54 bg-red-500">
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
          onChange={handleApplySeparation}
          checked={isSeparationChecked}
        />
        <div className="relative w-6 h-6">
          <div
            className={`absolute inset-0 rounded-full shadow-inner ${
              isSeparationChecked ? "bg-green-500" : "bg-gray-300"
            }`}
          >
          </div>
          {isSeparationChecked && (
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

      <label
        htmlFor="alignment-checkbox"
        className="flex items-center space-x-2"
      >
        <span className="text-white">Alignment</span>
        <input
          type="checkbox"
          className="hidden"
          name="Alignment"
          id="alignment-checkbox"
          onChange={handleApplyAlignment}
          checked={isAlignmentChecked}
        />
        <div className="relative w-6 h-6">
          <div
            className={`absolute inset-0 rounded-full shadow-inner ${
              isAlignmentChecked ? "bg-green-500" : "bg-gray-300"
            }`}
          >
          </div>
          {isAlignmentChecked && (
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
      <label
        htmlFor="cohesion-checkbox"
        className="flex items-center space-x-2"
      >
        <span className="text-white">Cohesion</span>
        <input
          type="checkbox"
          className="hidden"
          name="cohesion"
          id="cohesion-checkbox"
          onChange={handleApplyCohesion}
          checked={isCohesionChecked}
        />
        <div className="relative w-6 h-6">
          <div
            className={`absolute inset-0 rounded-full shadow-inner ${
              isCohesionChecked ? "bg-green-500" : "bg-gray-300"
            }`}
          >
          </div>
          {isCohesionChecked && (
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
