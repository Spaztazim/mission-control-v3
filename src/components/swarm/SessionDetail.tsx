'use client';

import { useState, useCallback } from 'react';
import { Send, Skull, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatTokens, fetchApi } from '@/lib/utils';
import type { AgentSession } from '@/lib/types';

type DotStatus = 'online' | 'offline' | 'busy' | 'active' | 'idle' | 'error' | 'running' | 'stopped' | 'printing';

function sessionDotStatus(status: AgentSession['status']): DotStatus {
  if (status === 'completed') return 'offline';
  return status;
}

interface SessionDetailProps {
  session: AgentSession;
  onKill: (sessionId: string) => void;
}

export function SessionDetail({ session, onKill }: SessionDetailProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [killing, setKilling] = useState(false);

  const elapsed = Math.floor(
    (Date.now() - new Date(session.startedAt).getTime()) / 1000
  );

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetchApi<{ ok: boolean }>('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', sessionId: session.id, message }),
      });
      setMessage('');
    } catch {
      // toast or inline error could go here
    } finally {
      setSending(false);
    }
  }, [message, session.id]);

  const handleKill = useCallback(async () => {
    setKilling(true);
    try {
      await fetchApi<{ ok: boolean }>('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kill', sessionId: session.id }),
      });
      onKill(session.id);
    } catch {
      // error handling
    } finally {
      setKilling(false);
    }
  }, [session.id, onKill]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Terminal size={16} className="inline mr-2" />
          Session Detail
        </CardTitle>
        <Button
          variant="danger"
          size="sm"
          onClick={handleKill}
          disabled={killing || session.status === 'completed'}
        >
          <Skull size={14} />
          {killing ? 'Killing…' : 'Kill'}
        </Button>
      </CardHeader>

      {/* Session meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div>
          <p className="text-muted text-xs mb-0.5">Agent</p>
          <p className="text-foreground text-sm font-medium flex items-center gap-1.5">
            <StatusDot status={sessionDotStatus(session.status)} />
            {session.agent}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs mb-0.5">Model</p>
          <p className="text-foreground text-sm">{session.model}</p>
        </div>
        <div>
          <p className="text-muted text-xs mb-0.5">Duration</p>
          <p className="text-foreground text-sm">{formatDuration(elapsed)}</p>
        </div>
        <div>
          <p className="text-muted text-xs mb-0.5">Tokens</p>
          <p className="text-foreground text-sm">{formatTokens(session.tokenUsage)}</p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 mb-5">
        <Badge variant={session.status === 'active' ? 'success' : session.status === 'error' ? 'danger' : 'default'}>
          {session.status}
        </Badge>
        <Badge>{session.messageCount} messages</Badge>
      </div>

      {/* Last message */}
      {session.lastMessage && (
        <div className="bg-surface border border-edge rounded-lg p-3 mb-5">
          <p className="text-muted text-xs mb-1">Last Message</p>
          <p className="text-dim text-sm whitespace-pre-wrap">{session.lastMessage}</p>
        </div>
      )}

      {/* Send input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Send a message to this session…"
          disabled={session.status === 'completed' || sending}
          className="flex-1 bg-surface border border-edge rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={!message.trim() || sending || session.status === 'completed'}
        >
          <Send size={14} />
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </Card>
  );
}
