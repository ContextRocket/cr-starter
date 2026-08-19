export type WidgetChatStatus = "idle" | "streaming" | "complete" | "error";

export type WidgetChatRole = "user" | "assistant";

export interface WidgetChatMessage {
  id: string;
  role: WidgetChatRole;
  content: string;
}

export type WidgetTransportState =
  | "submitted"
  | "working"
  | "input-required"
  | "completed"
  | "canceled"
  | "failed";

export type WidgetMode = "demo" | "live";

export type WidgetTransportEvent =
  | { type: "delta"; text: string }
  | { type: "done"; taskId?: string }
  | { type: "error"; message: string }
  | { type: "meta"; state: WidgetTransportState }
  | { type: "session"; threadId: string };

export interface WidgetConfig {
  /** Website API key; never a server-side credential. */
  apiKey?: string;
  /** Direct ContextRocket API base for live mode. */
  apiBaseUrl?: string;
  /** `demo` is dependency-free; `live` calls the API from the browser. */
  mode: WidgetMode;
  /** Public organization handle used by the A2A metadata contract. */
  handle?: string;
  accentColor?: string;
  greeting?: string;
  title?: string;
  ref?: string;
}

export interface WidgetSendRequest {
  message: string;
  threadId?: string;
}
