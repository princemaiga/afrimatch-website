"use client";

import { useState, useEffect, useRef } from "react";
import { useMessaging, MessagingService, type Message, type Conversation } from "@/lib/messaging";
import { useSession } from "next-auth/react";

interface ChatInterfaceProps {
  conversationId: string;
  participantName: string;
  participantImage: string;
}

export function ChatInterface({ conversationId, participantName, participantImage }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const { messages, addMessage, markAsRead } = useMessaging();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messagingService, setMessagingService] = useState<MessagingService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!session?.user?.email) return;

    const service = new MessagingService(session.user.email);
    setMessagingService(service);

    service.connect(
      (data) => {
        if (data.type === "message") {
          addMessage({
            id: data.id,
            senderId: data.senderId,
            senderName: data.senderName,
            senderImage: data.senderImage,
            recipientId: data.recipientId,
            content: data.content,
            timestamp: new Date(data.timestamp),
            read: false,
            type: data.messageType || "text",
          });
        } else if (data.type === "typing") {
          setIsTyping(data.isTyping);
        }
      },
      (error) => {
        console.error("Messaging error:", error);
      }
    );

    return () => {
      service.disconnect();
    };
  }, [session, addMessage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !messagingService) return;

    // Send message via WebSocket
    messagingService.sendMessage(conversationId, newMessage, "text");

    // Optimistically add message to UI
    addMessage({
      id: `${Date.now()}`,
      senderId: session?.user?.email || "",
      senderName: session?.user?.name || "You",
      senderImage: session?.user?.image || "",
      recipientId: conversationId,
      content: newMessage,
      timestamp: new Date(),
      read: true,
      type: "text",
    });

    setNewMessage("");
  };

  const handleTyping = () => {
    if (!messagingService) return;

    messagingService.sendTypingIndicator(conversationId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      messagingService.sendTypingIndicator(conversationId, false);
    }, 3000);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!messagingService) return;
    messagingService.addReaction(messageId, emoji);
  };

  const conversationMessages = messages.filter(
    (msg) =>
      (msg.senderId === conversationId && msg.recipientId === session?.user?.email) ||
      (msg.senderId === session?.user?.email && msg.recipientId === conversationId)
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={participantImage}
            alt={participantName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-white">{participantName}</h3>
            <p className="text-xs text-slate-400">
              {isTyping ? "typing..." : "Online"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            📞
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            📹
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            ⋯
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-slate-400">No messages yet. Say hello!</p>
            </div>
          </div>
        ) : (
          conversationMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === session?.user?.email ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId === session?.user?.email
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.read && message.senderId === session?.user?.email && (
                    <span className="text-xs">✓✓</span>
                  )}
                </div>

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {Object.entries(message.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(message.id, emoji)}
                        className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 transition-all"
                      >
                        {emoji} {count > 1 ? count : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reaction Picker */}
              <div className="flex gap-1 ml-2 opacity-0 hover:opacity-100 transition-opacity">
                {["😂", "❤️", "😍", "😮", "😢", "😡"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800 p-4 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            className="p-2 hover:bg-slate-700 rounded-lg transition-all text-xl"
          >
            😊
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-slate-400"
          />

          <button
            type="button"
            className="p-2 hover:bg-slate-700 rounded-lg transition-all text-xl"
          >
            📎
          </button>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
