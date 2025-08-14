"use client";

import React, { memo, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./index.css";
import { cn } from "@/lib/utils";
import "highlight.js/styles/vs2015.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useChatStore } from "@/store/ChatMemory"; // <-- adjust path if different
import { useSocket } from "@/hooks/socket-context"; // <-- must wrap app with provider

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};

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
          isUser ? "px-4 py-3 rounded-xl shadow-lg glass" : "space-y-4 w-4/5"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">{isUser ? "You" : "Assistant"} said:</p>
          {children}
        </div>
      </div>
    </article>
  );
}

/* ---------------- Row: subscribes to only one message (messages[index]) --------------- */
/* This must live outside Chat so it's stable (not recreated on each Chat render). */
const Row = memo(function Row({ index, style, data }: any) {
  const { setSize, listRef, totalMessages } = data;

  // Subscribe only to this message — prevents whole list re-renders
  const message = useChatStore((s) => s.messages[index]);

  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const height = rowRef.current.getBoundingClientRect().height;
    setSize(index, height);

    // Tell react-window to re-measure from this row onwards
    listRef?.current?.resetAfterIndex(index);

    // If this is the last message, scroll to bottom
    if (index === totalMessages - 1) {
      requestAnimationFrame(() => {
        listRef?.current?.scrollToItem(index, "end");
      });
    }
  }, [index, message?.content, setSize, listRef, totalMessages]);

  if (!message) return null;

  return (
    <div style={style}>
      <div ref={rowRef} className="py-2">
        <ChatMessage isUser={message.role === "user"}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                return inline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <pre style={{ padding: "10px", borderRadius: "4px" }}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
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
});

/* --------------------------------- Chat Component --------------------------------- */
export default function Chat() {
  // socket from SocketProvider (app must be wrapped)
  const { socket } = useSocket();

  // sizing + list refs
  const sizeMap = useRef<{ [index: number]: number }>({});
  const listRef = useRef<List | null>(null);

  // local UI
  const [isLoading, setIsLoading] = useState(false);

  // Zustand selectors/actions
  const messagesCount = useChatStore((s) => s.messages.length);
  const messages = useChatStore((s) => s.messages);

  // helpers for react-window sizing
  const setSize = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      listRef.current?.resetAfterIndex(index);
    }
  };
  const getSize = (index: number) => sizeMap.current[index] ?? 80;

  // scroll to bottom when a new message is appended
  useEffect(() => {
    if (messagesCount > 0) {
      // ensure row rendered/measured before scrolling
      requestAnimationFrame(() => {
        listRef.current?.scrollToItem(messagesCount - 1, "end");
      });
    }
  }, [messagesCount]);

  // Socket listeners: update Zustand store directly for minimal-change updates
  useEffect(() => {
    if (!socket) return;

    const onWelcome = (message: string) => {
      useChatStore.setState((s) => {
        s.messages.push({ role: "assistant", content: String(message) });
      });
    };

    const onServerMessage = (chunk: string) => {
      const state = useChatStore.getState();
      const last = state.messages[state.messages.length - 1];

      if (!last || last.role === "user") {
        // start a new assistant placeholder message
        useChatStore.setState((s) => {
          s.messages.push({ role: "assistant", content: String(chunk) });
        });
      } else {
        // append chunk to last message's content only (minimal change)
        useChatStore.setState((s) => {
          s.messages[s.messages.length - 1].content += String(chunk);
        });
      }
    };

    const onResponseEnd = () => {
      setIsLoading(false);
    };

    const onError = (err: any) => {
      console.error("Socket error:", err);
      setIsLoading(false);
      useChatStore.setState((s) => {
        s.messages.push({
          role: "assistant",
          content: "Error occurred while processing your request.",
        });
      });
    };

    socket.on("welcome", onWelcome);
    socket.on("server_message", onServerMessage);
    socket.on("response_end", onResponseEnd);
    socket.on("error", onError);

    return () => {
      socket.off("welcome", onWelcome);
      socket.off("server_message", onServerMessage);
      socket.off("response_end", onResponseEnd);
      socket.off("error", onError);
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col px-4 md:px-6 lg:px-8  w-5xl overflow-y-auto">
      {/* Chat list */}
      <div className="relative w-full h-full">
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              width={width}
              itemCount={messages.length}
              itemSize={getSize}
              className="overflow-x-clip scrollbar"
              
              itemData={{
                setSize,
                listRef,
                totalMessages: messages.length, // ✅ Now it’s in scope
              }}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>

      {/* Footer / input area */}
      <Footer isLoading={isLoading} />
    </div>
  );
}

/* ------------------------------- Footer (form) ---------------------------------- */
const FormSchema = z.object({
  input: z.string(),
});

function Footer({ isLoading }: { isLoading: boolean }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [isPending, startTransition] = useTransition();
  const { socket, isConnected } = useSocket();

  const addMessage = useChatStore((s) => s.addMessage);

  const onSubmit = (data: { input: string }) => {
    startTransition(() => {
      const text = data.input.trim();
      if (!text || !socket) return;
      // push user message to store
      addMessage({ role: "user", content: text });
      // emit to server
      setTimeout(() => {
        // small timeout to ensure UI added before server response
        try {
          socket.emit("message", text);
        } catch (err) {
          console.error("Emit error:", err);
        }
      }, 0);
      form.reset({ input: "" }); // Explicitly reset input field
      form.setValue("input", "", { shouldValidate: true }); // Force clear textarea
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
      <div className="max-w-3xl mx-auto shadow-lg">
        <div className="relative rounded-[20px] border transition-colors shadow-lg inset-shadow-[0_1px_rgb(255_255_255/0.15)] glass border-input overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="input"
                
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ask me anything..."
                        aria-label="Enter your prompt"
                        spellCheck={true}
                        onKeyDown={handleKeyDown}
                        value={field.value||""}
                        className="w-full px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none border-0 bg-transparent max-h-48 scrollbar resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 p-3">
                <div className="mr-2 text-sm text-muted-foreground">
                  {!isConnected
                    ? "Disconnected"
                    : isPending || isLoading
                    ? "AI is typing..."
                    : "Connected"}
                </div>

                <Button
                  className="rounded-full h-8"
                  disabled={
                    !isConnected || form.getValues("input") === "" || isPending
                  }
                >
                  Ask Bart
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
