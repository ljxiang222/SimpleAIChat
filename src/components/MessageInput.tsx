import React, { useState } from "react";
import { FaLocationArrow, FaStop, FaPaperclip } from "react-icons/fa";

type MessageInputProps = {
    onSend: (text: string) => void;
    onStop: () => void;
    isLoading: boolean;
    changeModel?: (type: string) => void;
};

const defaultOptions = [
    {
        label: "DeepSeek R1 大模型",
        value: "deepseek-chat",
    },
    {
        label: "元宝R1大模型",
        value: "doubao-1.5-pro-32k-250115",
    },
];

export default function MessageInput({
    onSend,
    onStop,
    isLoading,
    changeModel = (data?: string) => {},
}: MessageInputProps) {
    const [input, setInput] = useState("");

    const [checkedlabel, setCheckedLabel] = useState("DeepSeek R1 大模型");
    const [checkedvalue, setCheckedValue] = useState("deepseek-chat");
    const [selectVisible, setSelectVisible] = useState<boolean>(false);
    const [selectOptions, setSelectOptions] = useState(defaultOptions);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (selectVisible) setSelectVisible(false);
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="gap-3 overflow-visible absolute bottom-[15px] w-full left-0 h-[20vh] ">
            <div className="w-full h-[calc(100%-45px)] flex relative items-center  border border-gray-300 bg-gray-50  rounded-lg">
                <div className="flex-9 h-full relateive  p-4">
                    <div className="flex w-full h-[calc(100%-40px)] ">
                        <textarea
                            value={input}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-full p-1 overflow-hidden rounded-lg mr-2 resize-none focus:outline-none"
                            placeholder="给DeepSeek发送消息..."
                        ></textarea>
                    </div>
                    <div className="w-[200px] h-[40px] relative">
                        {selectVisible ? (
                            <div className="w-[240px] p-[10px] h-[120px] absolute border-1 border-[#eee] rounded-lg top-[-130px] left-[-20px] bg-[#fff] z-[999] shadow-[0_35px_60px_-15px_rgba(0, 0, 0, 0.3)]">
                                {selectOptions.map((item, index) => {
                                    return (
                                        <button
                                            className="w-full h-[50px] bg-[#fff] hover:bg-[#eee] text-[#333] cursor-pointer flex justify-start items-center"
                                            key={"options-" + index}
                                            onClick={() => {
                                                setCheckedLabel(item.label);
                                                setCheckedValue(item.value);
                                                setSelectVisible(false);
                                                changeModel(item.value);
                                            }}
                                        >
                                            <span className="text-left px-[10px]">
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                        <button
                            className="w-full h-[40px] leading-[40px] text-center bg-[#eee] rounded-[20px] cursor-pointer"
                            onClick={() => {
                                setSelectVisible(!selectVisible);
                            }}
                        >
                            {checkedlabel}
                        </button>
                    </div>
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
            <div className="w-full h-[45px] leading-[45px] text-center text-[14px]">
                内容由AI生成，仅供参考
            </div>
        </div>
    );
}
