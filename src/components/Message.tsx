import { useEffect, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";

// import "highlight.js/styles/vs.css";
import "highlight.js/styles/vs2015.css";
import "../assets/markdown.css";

type MessageProps = {
    text: string;
    sender: "user" | "bot";
    scrollBottom: VoidFunction;
};

interface CodeBlockProps {
    className?: string;
    code: string;
    language: string;
}

/**
 * 检查语言是否支持
 * @param lang 语言名称（如 'javascript', 'python'）
 * @returns 是否支持该语言
 */
const isValidLanguage = (lang: string): boolean => {
    return !!hljs.getLanguage(lang);
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    let defaultLanguage = isValidLanguage(language) ? language : "text";

    console.log("当前渲染的语言类型", defaultLanguage);

    return <code className={`language-${language}`}>{code}</code>;
};

export default function Message({ text, sender, scrollBottom }: MessageProps) {
    const [visibleText, setVisibleText] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentIndex, setCurrentIndex] = useState(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [theme, ChangeTheme] = useState("");

    useEffect(() => {
        ChangeTheme("dark");
        hljs.registerLanguage("javascript", javascript);
        hljs.registerLanguage("python", python);
        hljs.registerLanguage("java", java);
        hljs.highlightAll();
    }, [""]);

    useEffect(() => {
        setCurrentIndex(0);
        setVisibleText(text);
        // const interval = setInterval(() => {
        //     setCurrentIndex((prevIndex: number) => {
        //         if (prevIndex < text.length) {
        //             setVisibleText((prev) => prev + text.charAt(prevIndex));
        //             return prevIndex + 1;
        //         } else {
        //             clearInterval(interval);
        //             scrollBottom();
        //             return prevIndex;
        //         }
        //     });
        // }, 20);

        // return () => {
        //     clearInterval(interval);
        // };
    }, [text]);

    useEffect(() => {
        scrollBottom();
    }, [visibleText]);

    // 严格类型化的 components 配置
    const components: Components = {
        // 类型安全的代码块组件
        code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
                <CodeBlock code={children} language={match[1]} />
            ) : (
                <code className={className}>{children}</code>
            );
        },

        // 类型安全的图片组件
        img({ src, alt, ...props }: any) {
            return (
                <img
                    src={src || ""}
                    alt={alt || ""}
                    onClick={() => window.open(src || "", "_blank")}
                    style={{
                        maxWidth: "100%",
                        cursor: "pointer",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    {...props}
                />
            );
        },
    };

    return (
        <div
            className={`mb-2 transition-opacity duration-300 ${
                sender === "user"
                    ? "text-left flex flex-row justify-end"
                    : "text-left bg-[#ffffff]"
            }`}
        >
            {sender == "user" ? (
                <div className=" bg-[#eff6ff] px-4 py-2 rounded-lg w-auto markdown-container ">
                    {visibleText}
                </div>
            ) : (
                <ReactMarkdown
                    className="text-gray-700 markdown-container"
                    components={components}
                    remarkPlugins={[remarkGfm]}
                >
                    {visibleText}
                </ReactMarkdown>
            )}
        </div>
    );
}
