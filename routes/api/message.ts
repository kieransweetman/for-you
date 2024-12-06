import { Handlers } from "$fresh/server.ts";
import { addMessage } from "../../db/db.ts";
export const handler: Handlers<{ to: string; from?: string; message: string }> =
  {
    async POST(req, ctx) {
      const formData = await req.json();
      const { to, from, message } = formData;

      if (!to || !message) {
        return new Response("Missing required fields", { status: 400 });
      }

      formData.from = from || "Anonymous";

      await addMessage(formData);

      // Perform any additional processing or validation here

      return new Response(null, {
        status: 303,
        headers: {
          Location: "/space",
        },
      });
    },
  };
