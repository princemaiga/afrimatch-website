import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: "text" | "image" | "voice";
  reactions?: Record<string, number>; // emoji reactions
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantImage: string;
  lastMessage?: Message;
  unreadCount: number;
  mode: "dating" | "professional";
  createdAt: Date;
}

interface MessagingStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isConnected: boolean;
  typingUsers: Set<string>;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsConnected: (connected: boolean) => void;
  setTypingUsers: (users: Set<string>) => void;
  markAsRead: (messageId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
}

export const useMessaging = create<MessagingStore>()(
  subscribeWithSelector((set) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    isConnected: false,
    typingUsers: new Set(),

    setConversations: (conversations) => set({ conversations }),
    setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),
    setIsConnected: (connected) => set({ isConnected: connected }),
    setTypingUsers: (users) => set({ typingUsers: users }),
    markAsRead: (messageId) =>
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      })),
    addReaction: (messageId, emoji) =>
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || {};
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            return { ...msg, reactions };
          }
          return msg;
        }),
      })),
  }))
);

// WebSocket connection manager
export class MessagingService {
  private ws: WebSocket | null = null;
  private userId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(userId: string) {
    this.userId = userId;
  }

  connect(onMessage: (data: any) => void, onError: (error: any) => void) {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/messages/ws?userId=${this.userId}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        useMessaging.setState({ isConnected: true });
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        useMessaging.setState({ isConnected: false });
        onError(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        useMessaging.setState({ isConnected: false });
        this.attemptReconnect(onMessage, onError);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      onError(error);
    }
  }

  private attemptReconnect(onMessage: (data: any) => void, onError: (error: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(onMessage, onError);
      }, delay);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  sendMessage(recipientId: string, content: string, type: "text" | "image" | "voice" = "text") {
    this.send({
      type: "message",
      recipientId,
      content,
      messageType: type,
      timestamp: new Date(),
    });
  }

  sendTypingIndicator(recipientId: string, isTyping: boolean) {
    this.send({
      type: "typing",
      recipientId,
      isTyping,
    });
  }

  markAsRead(messageId: string) {
    this.send({
      type: "read",
      messageId,
    });
  }

  addReaction(messageId: string, emoji: string) {
    this.send({
      type: "reaction",
      messageId,
      emoji,
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Message encryption utility
export function encryptMessage(content: string, key: string): string {
  // Simple encryption - in production use proper encryption library
  return Buffer.from(content).toString("base64");
}

export function decryptMessage(encrypted: string, key: string): string {
  // Simple decryption - in production use proper decryption library
  return Buffer.from(encrypted, "base64").toString("utf-8");
}
