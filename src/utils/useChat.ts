import { useState, useCallback } from "react";

type Message = {
    text: string;
    sender: "user" | "bot";
};

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [abortController, setAbortController] =
        useState<AbortController | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text || isLoading) return;
            setMessages((prev) => [...prev, { text, sender: "user" }]);
            setIsLoading(true);
            setIsThinking(true);

            const controller = new AbortController();
            setAbortController(controller);

            try {
                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "deepseek-coder-v2", //deepseek-r1:8b  //deepseek-coder-v2
                        prompt: text,
                        stream: true,
                    }),
                    signal: controller.signal,
                });

                if (!response.body) throw new Error("错误信息");

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let botMessage = "";

                setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const parts = chunk.split("\n").filter((p) => p !== "");

                    for (const part of parts) {
                        try {
                            const json = JSON.parse(part);
                            if (json.response) {
                                if (
                                    json.response.includes("<think>") ||
                                    json.response.includes("</think>")
                                ) {
                                    continue;
                                }

                                // console.log("返回的内容是", json.response);

                                botMessage += json.response || "\n";

                                setMessages((prev) => {
                                    const updatedMessages = [...prev];
                                    updatedMessages[
                                        updatedMessages.length - 1
                                    ] = {
                                        text: botMessage,
                                        sender: "bot",
                                    };
                                    return updatedMessages;
                                });
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (error) {
                            console.warn("错误的 JSON:", part);
                        }
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.warn("错误警告");
                    } else {
                        console.error("错误内容:", error.message);
                    }
                } else {
                    console.error("错误内容:", error);
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
                setIsThinking(false);
            }
        },
        [isLoading]
    );

    const stopResponse = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    return { messages, sendMessage, stopResponse, isLoading, isThinking };
}
