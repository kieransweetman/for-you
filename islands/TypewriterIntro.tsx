import { useEffect, useState } from "preact/hooks";
import Typewriter from "./Typewriter.tsx";

const messages = [
    "if you could send a message...",
    "anonymous, untraceable...",
    "or with your name...",
    "what would you say?",
];

const speeds = [50, 100, 75, 50]; // Define speeds for each message

export default function TypewriterIntro() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [skip, setSkip] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const handleComplete = () => {
        if (currentMessageIndex < messages.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setFadeOut(true);
                setTimeout(() => {
                    setSkip(true);
                    setFadeOut(false);
                }, 2000); // Wait for fade-out animation to complete
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setSkip(false);
            }
        };

        globalThis.addEventListener("keydown", handleKeyDown);
        globalThis.addEventListener("keyup", handleKeyUp);

        return () => {
            globalThis.removeEventListener("keydown", handleKeyDown);
            globalThis.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (skip) {
            setCurrentMessageIndex(messages.length); // Set index beyond the last message
            setTimeout(() => {
                globalThis.location.href = "/space";
            }, 1500);
        }
    }, [skip]);

    return (
        <div class="flex justify-center items-center bg-gray-900 h-[100vh] w-[100vw]">
            {!skip && currentMessageIndex < messages.length && (
                <Typewriter
                    key={currentMessageIndex}
                    className={`text-white ${fadeOut ? "fade-out" : ""}`}
                    speed={speeds[currentMessageIndex]} // Use the speed corresponding to the current message
                    onTextRendered={handleComplete}
                >
                    {messages[currentMessageIndex]}
                </Typewriter>
            )}

            <div
                className={(skip ? "fade-out" : "") +
                    " absolute bottom-4 text-white"}
            >
                Press space to skip
            </div>
        </div>
    );
}
