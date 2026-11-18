'use client';

import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

interface ChatThreadProps {
  messages: ChatMessage[];
}

export function ChatThread({ messages }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center">
              <span className="text-muted text-xs bg-surface px-3 py-1 rounded-full border border-edge">
                {msg.content}
              </span>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
          >
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-3',
                isUser
                  ? 'bg-primary/20 text-foreground border border-primary/30'
                  : 'bg-card text-foreground border border-edge'
              )}
            >
              {msg.agent && !isUser && (
                <div className="text-primary text-xs font-medium mb-1">{msg.agent}</div>
              )}
              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              <div className={cn('text-xs mt-2', isUser ? 'text-primary/60 text-right' : 'text-muted')}>
                {formatRelativeTime(msg.timestamp)}
              </div>
            </div>
            {isUser && (
              <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
