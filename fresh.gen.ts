// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_message from "./routes/api/message.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $space_index from "./routes/space/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $FormEnvelop from "./islands/FormEnvelop.tsx";
import * as $MessageFormDialog from "./islands/MessageFormDialog.tsx";
import * as $Typewriter from "./islands/Typewriter.tsx";
import * as $TypewriterIntro from "./islands/TypewriterIntro.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/message.ts": $api_message,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/space/index.tsx": $space_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/FormEnvelop.tsx": $FormEnvelop,
    "./islands/MessageFormDialog.tsx": $MessageFormDialog,
    "./islands/Typewriter.tsx": $Typewriter,
    "./islands/TypewriterIntro.tsx": $TypewriterIntro,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
