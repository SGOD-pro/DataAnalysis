"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/ChatMemory";
import { useSocketStore } from "@/store/Socket";
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./index.css";
import { Socket } from "socket.io-client";

type Message = { role: "user" | "assistant"; content: string; id?: string };

const makeKey = (m: Message, index: number) =>
  m.id ?? `${m.role}-${index}-${String(m.content).slice(0, 30)}`;

const ChatMessage = memo(
  ({ isUser, content }: { isUser: boolean; content: string }) => {
    // memoize markdown renderers so they are stable across renders
    const markdownComponents = useMemo(
      () => ({
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          return inline ? (
            <code className={className} {...props}>
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              language={language}
              style={oneDark} // official Prism theme
              PreTag="div"
              showLineNumbers
              wrapLines
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
        img({ node, ...props }: any) {
          return <img style={{ maxWidth: "100%" }} {...props} />;
        },
      }),
      []
    );

    return (
      <article
        className={cn(
          "flex items-start gap-4 text-[15px] leading-relaxed py-2",
          isUser && "justify-end"
        )}
      >
        <div
          className={cn(
            isUser ? "px-4 py-3 rounded-xl shadow-lg glass" : "space-y-4 w-full min-h-[40dvvh] pb-40"
          )}
        >
          {isUser ? (
            <div className="flex flex-col gap-3">
              <p className="sr-only">You said:</p>
              {content}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </article>
    );
  },
  // custom comparator: only re-render when role or content actually change
  (prev, next) => prev.isUser === next.isUser && prev.content === next.content
);

const MessageList = memo(() => {
  const messages = useChatStore((s: any) => s.messages);
  return (
    <>
      {messages.map((message: Message, index: number) => (
        <ChatMessage
          key={makeKey(message, index)}
          isUser={message.role === "user"}
          content={message.content}
        />
      ))}
    </>
  );
});

const Stream = memo(
  ({
    socket,
    userText,
    reset,
  }: {
    socket: Socket | null;
    userText: string;
    reset: () => void;
  }) => {
    const [streamedValue, setStreamedValue] = useState<string>("");
    const streamedValueRef = useRef("");
    const addMessage = useChatStore((s: any) => s.addMessage);
    const endRef = useRef<HTMLDivElement>(null);
    // ✅ Keep the latest user text in a ref
    const userTextRef = useRef(userText);

    useEffect(() => {
      userTextRef.current = userText;
    }, [userText]);

    useEffect(() => {
      if (!socket) return;
      socket.on("server_message", (data: string) => {
        setStreamedValue((prev) => prev + data);
        streamedValueRef.current += data;
      });
      socket.on("response_end", () => {
        const input = userTextRef.current;
        addMessage([
          { role: "user", content: input },
          { role: "assistant", content: streamedValueRef.current },
        ]);
        streamedValueRef.current = "";
        setStreamedValue("");
        userTextRef.current = "";
        reset();
      });
      return () => {
        socket.off("server_message");
        socket.off("response_end");
      };
    }, []);

    useEffect(() => {
      if (endRef.current) {
        endRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, []);

    return (
      <>
        <div className="min-h-[40dvvh] pb-40">
          <ChatMessage isUser={false} content={streamedValue} />
        </div>

        <div className="p-40" ref={endRef} />
      </>
    );
  }
);
const NewChatBubble = memo(() => {
  const [userInput, setUserInput] = useState("");
  const socket = useSocketStore((s: any) => s.socket);

  const handleChange = useCallback((text: string) => {
    setUserInput(text);
  }, []);

  const reset = useCallback(() => {
    setUserInput("");
  }, []);

  return (
    <>
      {userInput && <ChatMessage isUser content={userInput} />}
      {userInput && (
        <Stream socket={socket} userText={userInput} reset={reset} />
      )}
      <Footer
        onSend={(text: string) => {
          handleChange(text);
        }}
      />
    </>
  );
});

const Footer = memo(({ onSend }: { onSend: (t: string) => void }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const socket = useSocketStore((s) => s.socket);
  const setSocket = useSocketStore((s) => s.setSocket);
  const isConnected = useSocketStore((s) => s.isConnected);

  const setIsConnected = useSocketStore((s) => s.setIsConnected);
  const addMessage = useChatStore((s) => s.addMessage);
  const onSubmit = useCallback(() => {
    if (!socket) {
      toast("Socket not connected", {
        description: "Please refresh the page",
      });
      return;
    }

    const text = textareaRef.current?.value.trim();
    if (!text) return;

    if (socket) socket.emit("message", text);
    onSend(text);
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.value = "";
  }, [socket]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("response_end", () => {
      setIsLoading(false);
    });
    socket.on("disconnect", () => {
      toast("Socket disconnected", {
        description: "Please refresh the page",
        action: {
          label: "Refresh",
          onClick: () => {
            setSocket();
          },
        },
      });
      setIsConnected(false);
    });
    socket.on("welcome", (data: string) => {
      addMessage({ role: "assistant", content: data });
    });

    return () => {
      socket.off("response_end");
      socket.off("disconnect");
      socket.off("welcome");
    };
  }, [socket]);
  return (
    <div className="fixed left-16 sm:left-20 bottom-0  pt-2 md:pt-4 z-50 w-[calc(100%-4rem)] sm:w-[calc(100%-5rem)] flex items-center justify-center">
      <div className="max-w-4xl w-4xl shadow-lg  bg-background pb-7 rounded-t-[20px]">
        <div className="relative rounded-[20px] border transition-colors shadow-lg inset-shadow-[0_1px_rgb(255_255_255/0.15)] glass border-input overflow-hidden backdrop-blur-3xl">
          <div className="p-3">
            <textarea
              ref={textareaRef}
              placeholder="Ask me anything..."
              aria-label="Enter your prompt"
              spellCheck={true}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none border-0 bg-transparent max-h-48 scrollbar resize-none rounded-lg"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <div className="mr-2 text-sm text-muted-foreground">
                {!isConnected
                  ? "Disconnected"
                  : isLoading
                  ? "AI is typing..."
                  : "Connected"}
              </div>
              <Button
                className="rounded-full h-8"
                disabled={!isConnected || isLoading}
                onClick={onSubmit}
              >
                Ask Visu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function ChatPage() {
  const socket = useSocketStore((s) => s.socket);
  const setSocket = useSocketStore((s) => s.setSocket);
  const setIsConnected = useSocketStore((s) => s.setIsConnected);

  useEffect(() => {
    if (!socket) {
      setSocket();
      return;
    }
    socket.on("connect", () => {
      toast("Socket connected");
      if (!socket) {
        setSocket();
      }
      setIsConnected(true);
    });
    return () => {
      socket.off("connect");
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="relative grow">
        <div className="max-w-4xl mx-auto mt-6 space-y-6 h-full pl-2">
          <MessageList />
          <NewChatBubble />
        </div>
      </div>
    </div>
  );
}
