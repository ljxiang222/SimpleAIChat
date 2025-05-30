import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { useChat } from "./utils/useChat";

export default function ChatComponent() {
    const [chartModel, setChartModel] = useState("deepseek-chat"); //默认是deepseek-chat
    const { messages, sendMessage, stopResponse, isLoading } =
        useChat(chartModel);

    return (
        <div className="w-full h-screen font-sans bg-[#fff] rounded-lg shadow-lg">
            <div className="w-[70%] h-[100%] mx-auto pdt-[10%] relative">
                <ChatWindow messages={messages} />
                <MessageInput
                    onSend={sendMessage}
                    onStop={stopResponse}
                    isLoading={isLoading}
                    changeModel={(value) => {
                        console.log("选中的内容", value);
                        setChartModel(value);
                    }}
                />
            </div>
        </div>
    );
}
