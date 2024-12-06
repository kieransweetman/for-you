import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const className =
    "px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors ";
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      className={className + props.className}
    />
  );
}
