"use client";

import { Button } from "@/components/ui/button";

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
};
function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-8 flex items-center justify-center before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70">
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="dark px-2 py-1 text-xs">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

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
            : "space-y-4"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">{isUser ? "You" : "Bart"} said:</p>
          {children}
        </div>
      </div>
    </article>
  );
}
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  return (
    <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
      {/* Chat */}
      <div className="relative grow">
        <div className="max-w-3xl mx-auto mt-6 space-y-6">
          <ChatMessage isUser>
            <p>Hey Bolt, can you tell me more about AI Agents?</p>
          </ChatMessage>
          <ChatMessage>
            <p>
              AI agents are software that perceive their environment and act
              autonomously to achieve goals, making decisions, learning, and
              interacting. For example, an AI agent might schedule meetings by
              resolving conflicts, contacting participants, and finding optimal
              times—all without constant supervision.
            </p>
            <p>Let me know if you&lsquo;d like more details!</p>
          </ChatMessage>
          <ChatMessage isUser>
            <p>All clear, thank you!</p>
          </ChatMessage>
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
        <div className="max-w-3xl mx-auto shadow-lg">
          <div className="relative rounded-[20px] border transition-colors shadow-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] glass border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none overflow-hidden">
            <textarea
              className="flex sm:min-h-[84px] w-full shadow-lg px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none [resize:none]"
              placeholder="Ask me anything..."
              aria-label="Enter your prompt"
            />

            {/* Textarea buttons */}
            <div className="flex items-center justify-end gap-2 p-3">
              {/* Right buttons */}

              <Button className="rounded-full h-8">Ask Bart</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
