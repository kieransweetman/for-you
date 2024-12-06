import * as uuid from "jsr:@std/uuid";

type Message = {
  to: string;
  from: string;
  message: string;
};

export const db = await Deno.openKv();

export const addMessage = async (message: Message) => {
  const id = uuid.v1.generate();

  const messageData = { ...message };

  const data = await db.set(["messages", `${id}`], messageData);
};

export const getMessages = async () => {
  //   const results = await db.getMany([["messages"]]);
  const results = db.list({ prefix: ["messages"] });

  const messages = [];
  for await (const entry of results) {
    messages.push({
      id: entry.key[1],
      ...entry.value as Message,
    });
  }

  return messages;
};
