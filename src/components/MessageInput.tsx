import React, { useState } from "react";
import { FaLocationArrow, FaStop, FaPaperclip } from "react-icons/fa";

type MessageInputProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isLoading: boolean;
};

export default function MessageInput({ onSend, onStop, isLoading }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-center overflow-hidden absolute bottom-0 w-full left-0 h-[15vh] border border-gray-300 bg-gray-50  rounded-lg ">

      <div className="flex flex-9 h-full">
        <textarea
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-full p-4 overflow-hidden rounded-lg mr-2 resize-none focus:outline-none"

          placeholder="给DeepSeek发送消息..."
        ></textarea>
      </div>
      <div className="flex flex-3 flex-col h-full  p-4">
        <div className="flex flex-1 mb-4">
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-3  flex-12 mx-4 text-center flex justify-center items-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 duration-300"
          >
            <FaLocationArrow />
          </button>
        </div>
        <div className="flex flex-1">
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex justify-center items-center  px-4 py-3 bg-blue-500 flex-1 mx-4 text-center text-white rounded-xl hover:bg-blue-600 duration-300"
          >
            <FaPaperclip />
          </button>
          <button
            onClick={onStop} // Останавливаем ответ
            disabled={!isLoading}
            className="flex justify-center items-center  px-4 py-3 bg-red-500 flex-1 mx-4 text-center text-white rounded-xl hover:bg-red-600 duration-300"
          >
            <FaStop />
          </button>
        </div>
      </div>
    </div>
  );
}
