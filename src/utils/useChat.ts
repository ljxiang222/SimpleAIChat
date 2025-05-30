import { useState, useCallback, useEffect, useRef } from "react";

type Message = {
    text: string;
    sender: "user" | "bot";
};

export function useChat(chartModel = "deepseek-chat") {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [abortController, setAbortController] =
        useState<AbortController | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [chartModelType, setChartModelType] = useState(chartModel);
    const modelRef = useRef(chartModel);

    useEffect(() => {
        // setMessages([]);
        setChartModelType(chartModel);
        modelRef.current = chartModel;
    }, [chartModel]);

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
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer aaabbb",
                    },
                    body: JSON.stringify({
                        model: modelRef.current, //deepseek-r1:8b  //deepseek-coder-v2
                        prompt: text,
                        stream: true,
                    }),
                    signal: controller.signal,
                });

                if (!response.body) throw new Error("错误信息");

                const reader = response.body.getReader(); //获取响应的流对象
                const decoder = new TextDecoder(); //创建TextRead容器
                let botMessage = "";
                let buffer = ""; // 新增缓冲区

                setMessages((prev) => [...prev, { text: "", sender: "bot" }]); //设置缓冲区

                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || ""; // 保留未完成的行

                        for (const line of lines) {
                            try {
                                // 处理数据行前缀和空行
                                const trimmedLine = line.trim();
                                if (
                                    !trimmedLine ||
                                    trimmedLine === "data: [DONE]"
                                )
                                    continue;

                                const jsonStr = trimmedLine.replace(
                                    /^data: /,
                                    ""
                                );
                                const json = JSON.parse(jsonStr);

                                // 提取内容
                                const content =
                                    json.choices?.[0]?.delta?.content || "";

                                // 过滤<think>标签
                                if (
                                    content.includes("<think>") ||
                                    content.includes("</think>")
                                )
                                    continue;

                                console.log(
                                    "每一行返回的消息内容，解析后的值为：",
                                    content
                                );

                                // 拼接消息
                                if (content) {
                                    botMessage += content;
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = {
                                            text: botMessage,
                                            sender: "bot",
                                        };
                                        return newMessages;
                                    });
                                }
                            } catch (error) {
                                console.warn("解析失败:", error, line);
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                }
                // const reader = response.body.getReader();
                // const decoder = new TextDecoder();
                // let botMessage = "";

                // setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

                // while (true) {
                //     const { value, done } = await reader.read();

                //     console.log("response.body---value===", value, done);
                //     if (done) break;

                //     const chunk = decoder.decode(value, { stream: true });
                //     const parts = chunk.split("\n").filter((p) => p !== "");
                //     console.log("chunk ---value===", chunk);

                //     for (const part of parts) {
                //         console.log("value-part", parts);

                //         try {
                //             const json = JSON.parse(part);
                //             if (json.response) {
                //                 if (
                //                     json.response.includes("<think>") ||
                //                     json.response.includes("</think>")
                //                 ) {
                //                     continue;
                //                 }

                //                 console.log("返回的内容是", json.response);

                //                 botMessage += json.response || "\n";

                //                 setMessages((prev) => {
                //                     const updatedMessages = [...prev];
                //                     updatedMessages[
                //                         updatedMessages.length - 1
                //                     ] = {
                //                         text: botMessage,
                //                         sender: "bot",
                //                     };
                //                     return updatedMessages;
                //                 });
                //             }
                //             // eslint-disable-next-line @typescript-eslint/no-unused-vars
                //         } catch (error) {
                //             console.warn("错误的 JSON:", part);
                //         }
                //     }
                // }
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
