import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { useChat } from "./utils/useChat";

export default function ChatComponent() {
  const { messages, sendMessage, stopResponse, isLoading } = useChat();

  return (
    <div className="w-full h-screen font-sans bg-white rounded-lg shadow-lg">
      <div className="w-[70%] h-[100%] mx-auto pdt-[10%] relative">
        <ChatWindow messages={messages} />
        <MessageInput onSend={sendMessage} onStop={stopResponse} isLoading={isLoading} />
      </div>
    </div>
  );
}
