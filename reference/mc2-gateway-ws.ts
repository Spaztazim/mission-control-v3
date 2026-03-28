import { readFileSync } from "fs";
import { join } from "path";

let WebSocketClass: typeof import("ws").default | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  WebSocketClass = require("ws") as typeof import("ws").default;
} catch { /* not available */ }

const GATEWAY_URL = "ws://127.0.0.1:18789";
const CONFIG_PATH = join(homedir(), ".openclaw", "openclaw.json");

function readToken(): string {
  const raw = readFileSync(CONFIG_PATH, "utf-8");
  const config = JSON.parse(raw);
  return config.gateway?.auth?.token ?? "";
}

type PendingRpc = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

class GatewayBridge {
  private ws: InstanceType<typeof import("ws").default> | null = null;
  private token: string = "";
  private connected = false;
  private connecting = false;
  private pendingRpcs = new Map<string, PendingRpc>();
  private rpcCounter = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectPromise: Promise<void> | null = null;

  async ensureConnected(): Promise<void> {
    if (this.connected && this.ws?.readyState === 1) return;
    if (this.connecting && this.connectPromise) return this.connectPromise;
    return this.connect();
  }

  private connect(): Promise<void> {
    if (!WebSocketClass) return Promise.reject(new Error("ws not available"));
    this.connecting = true;
    this.connected = false;

    this.connectPromise = new Promise<void>((resolve, reject) => {
      try {
        this.token = readToken();
      } catch (e) {
        this.connecting = false;
        reject(new Error("Cannot read gateway token: " + e));
        return;
      }

      const ws = new WebSocketClass!(GATEWAY_URL);
      this.ws = ws;

      const timeout = setTimeout(() => {
        ws.close();
        this.connecting = false;
        reject(new Error("Connection timeout"));
      }, 10000);

      const connectId = `connect-${Date.now()}`;

      ws.on("open", () => {
        // Wait for challenge
      });

      ws.on("message", (data: Buffer | string) => {
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(data.toString());
        } catch {
          return;
        }

        // Step 1: Gateway sends connect.challenge
        if (msg.type === "event" && msg.event === "connect.challenge") {
          const connectReq = {
            type: "req",
            id: connectId,
            method: "connect",
            params: {
              minProtocol: 3,
              maxProtocol: 3,
              client: {
                id: "cli",
                version: "1.0.0",
                platform: "win32",
                mode: "cli",
              },
              role: "operator",
              scopes: ["operator.admin"],
              caps: [],
              commands: [],
              permissions: {},
              auth: { token: this.token },
              locale: "en-US",
              userAgent: "mission-control/1.0.0",
            },
          };
          ws.send(JSON.stringify(connectReq));
          return;
        }

        // Step 2: Auth response
        if (msg.type === "res" && msg.id === connectId) {
          clearTimeout(timeout);
          if (msg.ok) {
            this.connected = true;
            this.connecting = false;
            resolve();
          } else {
            this.connecting = false;
            reject(new Error("Auth failed: " + JSON.stringify(msg.error)));
          }
          return;
        }

        // Step 3: Handle RPC responses (payload-based)
        if (msg.type === "res" && msg.id && typeof msg.id === "string") {
          const pending = this.pendingRpcs.get(msg.id);
          if (pending) {
            this.pendingRpcs.delete(msg.id);
            clearTimeout(pending.timer);
            if (msg.ok) {
              pending.resolve(msg.payload ?? msg.result ?? {});
            } else {
              pending.reject(new Error(JSON.stringify(msg.error)));
            }
          }
        }
      });

      ws.on("close", () => {
        this.connected = false;
        this.connecting = false;
        this.ws = null;
        for (const [id, p] of this.pendingRpcs) {
          clearTimeout(p.timer);
          p.reject(new Error("Connection closed"));
          this.pendingRpcs.delete(id);
        }
        this.scheduleReconnect();
      });

      ws.on("error", () => {
        // close fires after
      });
    });
    return this.connectPromise;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(() => { /* retry on next rpc call */ });
    }, 3000);
  }

  async rpc(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    await this.ensureConnected();
    if (!this.ws || !this.connected) throw new Error("Not connected to gateway");

    const id = `mc-${++this.rpcCounter}-${Date.now()}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRpcs.delete(id);
        reject(new Error("RPC timeout"));
      }, 30000);

      this.pendingRpcs.set(id, { resolve, reject, timer });
      this.ws!.send(JSON.stringify({ type: "req", id, method, params }));
    });
  }

  get isConnected() {
    return this.connected;
  }
}

const bridge = new GatewayBridge();
export default bridge;


