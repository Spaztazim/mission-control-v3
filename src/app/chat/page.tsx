'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Radio } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChatThread } from '@/components/chat/ChatThread';
import { MessageInput } from '@/components/chat/MessageInput';
import { cn, fetchApi, formatRelativeTime, truncate } from '@/lib/utils';
import { mockSessions, mockChatMessages } from '@/lib/mock-data';
import type { AgentSession, ChatMessage } from '@/lib/types';

type StatusDotStatus = 'online' | 'offline' | 'busy' | 'active' | 'idle' | 'error' | 'running' | 'stopped' | 'printing';

function mapSessionStatus(status: AgentSession['status']): StatusDotStatus {
  if (status === 'completed') return 'offline';
  return status;
}

interface SessionsResponse {
  ok: boolean;
  data?: { sessions: AgentSession[] };
  error?: string;
}

interface MessagesResponse {
  ok: boolean;
  data?: { messages: ChatMessage[] };
  error?: string;
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetchApi<SessionsResponse>('/api/chat');
      if (res.ok && res.data) {
        setSessions(res.data.sessions);
      } else {
        setSessions(mockSessions);
      }
    } catch {
      setSessions(mockSessions);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true);
    setMsgError(null);
    try {
      const res = await fetchApi<MessagesResponse>(`/api/chat?session=${encodeURIComponent(sessionId)}`);
      if (res.ok && res.data) {
        setMessages(res.data.messages);
      } else {
        setMessages(mockChatMessages[sessionId] ?? []);
      }
    } catch {
      setMessages(mockChatMessages[sessionId] ?? []);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession);
    }
  }, [selectedSession, loadMessages]);

  async function handleSendMessage(content: string) {
    if (!selectedSession) return;
    setSending(true);
    try {
      const optimisticMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      await fetchApi<{ ok: boolean }>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSession, message: content }),
      });

      // Reload messages to get any assistant response
      await loadMessages(selectedSession);
    } catch (e) {
      setMsgError(e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function selectSession(sessionId: string) {
    setSelectedSession(sessionId);
    setMessages([]);
    setMsgError(null);
  }

  const activeSession = sessions.find((s) => s.id === selectedSession);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-xl font-bold tracking-wide flex items-center gap-2">
          <MessageSquare size={22} className="text-primary" />
          Chat
        </h2>
        <p className="text-muted text-sm mt-1">Communicate with your agents</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Sessions Sidebar */}
        <Card className="w-72 shrink-0 flex flex-col overflow-hidden" padding={false}>
          <div className="px-4 py-3 border-b border-edge">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">Sessions</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingSessions ? (
              <div className="p-4 space-y-3">
                <Skeleton lines={4} />
              </div>
            ) : sessions.length === 0 ? (
              <EmptyState icon={Radio} title="No sessions" description="No active agent sessions" />
            ) : (
              <div className="p-2 space-y-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => selectSession(session.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer',
                      selectedSession === session.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-highlight/50 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StatusDot status={mapSessionStatus(session.status)} />
                      <span className="text-foreground text-sm font-medium truncate">
                        {session.agent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{session.model}</span>
                      <span>{formatRelativeTime(session.startedAt)}</span>
                    </div>
                    {session.lastMessage && (
                      <p className="text-dim text-xs mt-1 truncate">
                        {truncate(session.lastMessage, 50)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden" padding={false}>
          {!selectedSession ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Select a session"
                description="Choose an agent session from the sidebar to start chatting"
              />
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-edge flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {activeSession && <StatusDot status={mapSessionStatus(activeSession.status)} />}
                  <div>
                    <span className="text-foreground font-medium text-sm">
                      {activeSession?.agent ?? 'Agent'}
                    </span>
                    <span className="text-muted text-xs ml-2">
                      {activeSession?.model}
                    </span>
                  </div>
                </div>
                {activeSession && (
                  <Badge variant="default">
                    {activeSession.messageCount} messages
                  </Badge>
                )}
              </div>

              {/* Messages */}
              {loadingMessages ? (
                <div className="flex-1 p-6">
                  <Skeleton lines={6} />
                </div>
              ) : msgError ? (
                <div className="flex-1 flex items-center justify-center">
                  <ErrorBox message={msgError} onRetry={() => loadMessages(selectedSession)} />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    icon={MessageSquare}
                    title="No messages yet"
                    description="Send a message to start the conversation"
                  />
                </div>
              ) : (
                <ChatThread messages={messages} />
              )}

              {/* Input */}
              <MessageInput onSend={handleSendMessage} disabled={sending || loadingMessages} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
