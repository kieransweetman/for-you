import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

const FormToEnvelope = () => {
  const [formData, setFormData] = useState({
    to: "",
    from: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [show, setShow] = useState(false);

  const handleInputChange = (
    e,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    // Start the animation
    setSubmitted(true);

    // Simulate sending the message (e.g., making a request)
    setTimeout(async () => {
      await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setShow(false);
      setAnimationComplete(true);
    }, 3000); // Wait for 3 seconds before showing the check mark
  };

  return (
    <>
      {show
        ? (
          <div
            className={`flex justify-center items-center min-h-screen ${
              submitted ? "space-out" : ""
            }`}
          >
            {!submitted
              ? (
                <form
                  onSubmit={handleSubmit}
                  method="POST"
                  className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-96"
                >
                  <label htmlFor="to" className="text-lg font-semibold">
                    To:
                  </label>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />

                  <label htmlFor="from" className="text-lg font-semibold">
                    From:
                  </label>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />

                  <label
                    htmlFor="message"
                    className="text-lg font-semibold"
                  >
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  >
                  </textarea>

                  <button
                    type="submit"
                    className="py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </form>
              )
              : (
                <div className="w-24 h-16 bg-gray-100 border border-gray-300 rounded-md relative overflow-hidden animate-envelope">
                  {animationComplete && (
                    <div className="absolute top-2 left-2 text-2xl text-green-500 animate-checkmark">
                      &#10003;
                    </div>
                  )}
                </div>
              )}
          </div>
        )
        : (
          <button
            onClick={() => {
              setShow(true);
            }}
            className="bg-red-600 p-3 rounded-md"
          >
            show form
          </button>
        )}
    </>
  );
};

export default FormToEnvelope;
