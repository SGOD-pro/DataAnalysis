"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./index.css";
import { cn } from "@/lib/utils";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};

interface ChatMessages {
  id: string;
  user?: boolean;
  content: string;
}

const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function ChatMessage({ isUser, children }: ChatMessageProps) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 text-[15px] leading-relaxed",
        isUser && "justify-end"
      )}
    >
      <div
        className={cn(
          isUser
            ? " px-4 py-3 rounded-xl shadow-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] glass"
            : "space-y-4 w-4/5"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">{isUser ? "You" : "Bart"} said:</p>
          {children}
          {!isUser && (
            <p className="sr-only">
              Let me know if you&lsquo;d like more details!
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Chat() {
  // virtualization sizing map and ref
  const sizeMap = useRef<{ [index: number]: number }>({});
  const listRef = useRef<List | null>(null);

  // chat state
  const [items, setItems] = useState<ChatMessages[]>([]);

  // socket & UI state
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");

  // --- helpers for VariableSizeList ---
  const setSize = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      listRef.current?.resetAfterIndex(index);
    }
  };

  const getSize = (index: number) => {
    return sizeMap.current[index] ?? 80; // fallback guess
  };

  // --- Socket setup (uses localhost:8000; swap to env var as needed) ---
  useEffect(() => {
    const s = io("http://localhost:8000");
    socketRef.current = s;

    s.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server", s.id);
    });

    s.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    s.on("welcome", (message: string) => {
      setItems((prev) => [
        ...prev,
        { id: generateId(), content: String(message), user: false },
      ]);
    });

    // server streams message chunks — append to last AI message or create a new one
    s.on("server_message", (chunk: string) => {
      setItems((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].user === true) {
          return [
            ...prev,
            { id: generateId(), content: String(chunk), user: false },
          ];
        } else {
          const lastIndex = prev.length - 1;
          const updated = {
            ...prev[lastIndex],
            content: prev[lastIndex].content + String(chunk),
          };
          return [...prev.slice(0, lastIndex), updated];
        }
      });
      // demo set isLoading false on chunk; keep streaming indicator controlled by response_end
      // but we can mark that we received text
    });

    s.on("response_end", () => {
      setIsLoading(false);
    });

    s.on("error", (err: any) => {
      console.error("Socket error:", err);
      setIsLoading(false);
      setItems((prev) => [
        ...prev,
        {
          id: generateId(),
          content: "Error occurred while processing your request.",
          user: false,
        },
      ]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("welcome");
        socketRef.current.off("server_message");
        socketRef.current.off("response_end");
        socketRef.current.off("error");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // --- scroll to bottom when items change ---
  useEffect(() => {
    if (items && items.length > 0) {
      // guard: if listRef exists, call scrollToItem
      listRef.current?.scrollToItem(items.length - 1, "end");
    }
  }, [items]);

  // send message to backend
  const sendMessage = () => {
    const trimmed = userInput.trim();
    if (!trimmed || !socketRef.current) return;

    // add user message locally
    const userMsg: ChatMessages = {
      id: generateId(),
      content: trimmed,
      user: true,
    };
    setItems((prev) => [...(prev || []), userMsg]);

    // emit to server
    try {
      socketRef.current.emit("message", trimmed);
      setIsLoading(true);
    } catch (err) {
      console.error("Emit error:", err);
      setIsLoading(false);
    }
    setUserInput("");
  };

  // Row renderer for VariableSizeList
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const message = items[index];

    useEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height;
        setSize(index, height);
      }
      // re-measure when content changes
    }, [index, message.content]);

    if (!message) return null;

    return (
      <div style={style}>
        <div ref={rowRef} className="py-2">
          <ChatMessage isUser={message.user ?? false}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <pre className="hljs">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: hljs.highlight(children.toString(), {
                            language: match[1],
                          }).value,
                        }}
                      />
                    </pre>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img({ node, ...props }: any) {
                  return <img style={{ maxWidth: "100%" }} {...props} />;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </ChatMessage>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-6 lg:px-8 w-5xl overflow-y-auto">
      {/* Chat */}
      <div className="relative w-full h-full">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={items.length}
              itemSize={getSize}
              overscanCount={5}
              ref={listRef}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
        <div className="max-w-3xl mx-auto shadow-lg">
          <div className="relative rounded-[20px] border transition-colors shadow-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] glass border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none overflow-hidden">
            <textarea
              className="flex sm:min-h-[84px] w-full shadow-lg px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none [resize:none]"
              placeholder="Ask me anything..."
              aria-label="Enter your prompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            {/* Textarea buttons */}
            <div className="flex items-center justify-end gap-2 p-3">
              {/* Connection indicator + loader */}
              <div className="mr-2 text-sm text-muted-foreground">
                {!isConnected
                  ? "Disconnected"
                  : isLoading
                  ? "AI is typing..."
                  : "Connected"}
              </div>

              <Button
                className="rounded-full h-8"
                onClick={() => sendMessage()}
                disabled={!isConnected || userInput.trim().length === 0}
              >
                Ask Bart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
