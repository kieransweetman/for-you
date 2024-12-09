import { Dialog } from "@headlessui/react";
import { useState } from "react-dom";
import { Button } from "@/components/Button.tsx";

export default function MessageForm() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialog = () => {
    console.log("handling");
    setIsOpen(true);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const data = {
      to: formData.get("to"),
      from: formData.get("from"),
      message: formData.get("message"),
    };

    const res = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("Message sent");
    }

    setIsOpen(false);
  };

  return (
    <div className="z-50">
      <Button onClick={handleDialog}>
        Open dialog
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg space-y-4 border bg-blue-600 p-12">
            <Dialog.Title className="text-lg font-medium">
              Dialog Title
            </Dialog.Title>
            <Dialog.Description className="text-sm">
              This is a description of the dialog.
            </Dialog.Description>
            <form
              onSubmit={handleSubmit}
              method="POST"
              className="flex flex-col h-[400px] justify-evenly"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="to" className="text-lg font-semibold">
                    To:
                  </label>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    className="p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="from" className="text-lg font-semibold">
                    From:
                  </label>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    className="p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="message"
                    className="text-lg font-semibold"
                  >
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="p-2 border rounded-md"
                    required
                  >
                  </textarea>
                </div>
              </div>
              <div className="flex justify-end w-full gap-4">
                <Button className="bg-blue-600" type="submit">Submit</Button>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  close
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
