import { FreshContext } from "$fresh/server.ts";
import FormToEnvelope from "../../islands/FormEnvelop.tsx";
import { getMessages } from "../../db/db.ts";
interface Message {
  to: string;
  from?: string;
  message: string;
}

export default async function SpaceIndex(_req: Request, ctx: FreshContext) {
  const messages = await getMessages();

  return (
    <div class="flex justify-center items-center bg-gray-900 h-[100vh] w-[100vw]">
      <div className="flex flex-col h-full overflow-y-auto">
        {messages?.map(({ to, from, message }) => (
          <div class="bg-white p-4 m-4 rounded-lg">
            <h2 class="text-xl font-semibold">{to}</h2>
            {from && <h2 class="text-xl font-semibold">{from}</h2>}
            <p>{message}</p>
          </div>
        ))}
      </div>

      <FormToEnvelope />;
    </div>
  );
}
