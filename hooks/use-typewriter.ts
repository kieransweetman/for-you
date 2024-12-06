import { useEffect, useState } from "preact/hooks";

export const useTypewriter = (text: string, speed = 50) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let i = 0;
        speed = Math.random() * 100 + 50;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prevText) => prevText + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);

        return () => {
            clearInterval(typingInterval);
        };
    }, [text, speed]);

    return displayText;
};
