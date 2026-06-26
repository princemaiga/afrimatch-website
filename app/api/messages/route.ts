export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

/**
 * Messages API
 * Handles real-time messaging with WebSocket support
 */

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: "text" | "image" | "voice" | "video";
  reactions: Record<string, string[]>; // emoji -> [userIds]
  readAt?: Date;
  createdAt: Date;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

// In-memory storage (replace with database in production)
const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");

    if (conversationId) {
      // Get messages for a conversation
      const conversationMessages = messages.get(conversationId) || [];
      return NextResponse.json(conversationMessages);
    }

    if (userId) {
      // Get all conversations for a user
      const userConversations = Array.from(conversations.values()).filter((conv) =>
        conv.participants.includes(userId)
      );
      return NextResponse.json(userConversations);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, senderId, recipientId, content, type = "text" } = body;

    if (!conversationId || !senderId || !recipientId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or get conversation
    let conversation = conversations.get(conversationId);
    if (!conversation) {
      conversation = {
        id: conversationId,
        participants: [senderId, recipientId],
        updatedAt: new Date(),
      };
      conversations.set(conversationId, conversation);
    }

    // Create message
    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      recipientId,
      content,
      type,
      reactions: {},
      createdAt: new Date(),
    };

    // Store message
    if (!messages.has(conversationId)) {
      messages.set(conversationId, []);
    }
    messages.get(conversationId)!.push(message);

    // Update conversation
    conversation.lastMessage = message;
    conversation.updatedAt = new Date();

    // Broadcast message via WebSocket (implement with Socket.io)
    // broadcastMessage(conversationId, message);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Mark message as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, conversationId, userId } = body;

    if (!messageId || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const conversationMessages = messages.get(conversationId);
    if (!conversationMessages) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const message = conversationMessages.find((m) => m.id === messageId);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    message.readAt = new Date();

    // Broadcast read receipt via WebSocket
    // broadcastReadReceipt(conversationId, messageId, userId);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
