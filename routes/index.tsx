import Typewriter from "../islands/Typewriter.tsx";
import { useState } from "preact/hooks";
import TypewriterIntro from "../islands/TypewriterIntro.tsx";

export default function Home() {
  return (
    <div class="flex justify-center items-center bg-gray-900 h-[100vh] w-[100vw]">
      <TypewriterIntro />
    </div>
  );
}
