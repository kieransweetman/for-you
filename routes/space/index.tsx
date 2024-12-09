import { FreshContext } from "$fresh/server.ts";
import { getMessages } from "../../db/db.ts";
import MessageForm from "../../islands/MessageFormDialog.tsx";
import CanvasIsland from "../../islands/CanvasIsland.tsx";

export default async function SpaceIndex(_req: Request, ctx: FreshContext) {
  const messages = await getMessages();

  return (
    <div class="relative flex flex-col gap-5 justify-center items-center  h-[100vh] w-[50vw]">
      <div className="flex flex-col overflow-y-auto h-[80%] z-[100]">
        {messages?.map(({ to, from, message }) => (
          <div class=" p-4 m-4 rounded-lg">
            <h2 class="text-xl font-semibold">{to}</h2>
            {from && <h2 class="text-xl font-semibold">{from}</h2>}
            <p>{message}</p>
          </div>
        ))}
      </div>
      <CanvasIsland />
      <MessageForm />
    </div>
  );
}
