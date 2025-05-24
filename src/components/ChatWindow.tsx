import { useRef } from "react";
import Message from "./Message";

type Message = {
    text: string;
    sender: "user" | "bot";
};

type ChatWindowProps = {
    messages: Message[];
};

export default function ChatWindow({ messages }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollBottomBehavior = () => {
        // messagesEndRef.current?.scrollIntoView({ behavior });
        scrollToBottom("smooth");
    };

    // 消息变化时触发滚动
    const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    return (
        <div className="pb-[20vh] h-[100vh] overflow-hidden mb-4 pt-[60px] ">
            <div className="absolute left-0 h-[60px] text-center w-full top-0 flex items-center justify-center">
                <strong>会话信息</strong>
            </div>
            <div className="w-full h-full overflow-y-auto" ref={containerRef}>
                {messages.map((msg, idx) => (
                    <Message
                        key={idx}
                        text={msg.text}
                        sender={msg.sender}
                        scrollBottom={scrollBottomBehavior}
                    />
                ))}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
    );
}
