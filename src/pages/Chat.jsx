import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { ArrowLeft, Send, UserCircle2 } from "lucide-react";

const BASE_URL = "http://localhost:8080";

function Chat() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const stompClient = useRef(null);
  const messageEndRef = useRef(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  useEffect(() => {
    if (!currentUser?.id || !studentId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/api/user/getUserById/${studentId}`, { headers })
      .then((res) => setPartner(res.data))
      .catch((err) => {
        console.error("Error fetching chat partner:", err);
        setStatus("Unable to load this chat user.");
      });
  }, [currentUser?.id, headers, navigate, studentId]);

  const roomId = useMemo(() => {
    if (!partner || !currentUser?.id) return null;
    return `room-${Math.min(currentUser.id, partner.id)}-${Math.max(currentUser.id, partner.id)}`;
  }, [currentUser?.id, partner]);

  useEffect(() => {
    if (!partner || !currentUser?.id) return;

    setLoading(true);
    axios
      .get(`${BASE_URL}/api/messages/conversation/${currentUser.id}/${partner.id}`, { headers })
      .then((res) => {
        const conversation = Array.isArray(res.data) ? res.data : [];
        const deduped = Array.from(
          new Map(
            conversation.map((message) => [
              `${message.id || ""}-${message.senderId}-${message.receiverId}-${message.timestamp}-${message.content}`,
              message,
            ])
          ).values()
        );
        setMessages(deduped);
      })
      .catch((err) => {
        console.error("Error fetching conversation:", err);
        setStatus("Unable to load conversation history.");
      })
      .finally(() => setLoading(false));
  }, [currentUser?.id, headers, partner]);

  useEffect(() => {
    if (!roomId) return undefined;

    const socket = new SockJS(`${BASE_URL}/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      onConnect: () => {
        stompClient.current.subscribe(`/topic/${roomId}`, (frame) => {
          const incoming = JSON.parse(frame.body);
          setMessages((prev) => {
            const exists = prev.some(
              (message) =>
                message.id === incoming.id ||
                `${message.senderId}-${message.receiverId}-${message.timestamp}-${message.content}` ===
                  `${incoming.senderId}-${incoming.receiverId}-${incoming.timestamp}-${incoming.content}`
            );

            return exists ? prev : [...prev, incoming];
          });
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setStatus("Live chat connection failed.");
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !partner || !currentUser?.id) return;

    const draftMessage = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: partner.id,
      content: input.trim(),
      roomId,
      timestamp: new Date().toISOString(),
    };

    setSending(true);
    setStatus("");

    try {
      const response = await axios.post(`${BASE_URL}/api/messages/send`, draftMessage, { headers });
      const savedMessage = response.data || draftMessage;

      setMessages((prev) => {
        const exists = prev.some(
          (message) =>
            message.id === savedMessage.id ||
            `${message.senderId}-${message.receiverId}-${message.timestamp}-${message.content}` ===
              `${savedMessage.senderId}-${savedMessage.receiverId}-${savedMessage.timestamp}-${savedMessage.content}`
        );
        return exists ? prev : [...prev, savedMessage];
      });

      if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: `/app/chat/${roomId}`,
          body: JSON.stringify(savedMessage),
        });
      }

      setInput("");
    } catch (err) {
      console.error("Message send failed:", err);
      setStatus(err.response?.data?.message || "Message failed to send.");
    } finally {
      setSending(false);
    }
  };

  if (!partner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>{status || "Loading chat..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f172a_0%,#0b3a63_45%,#d6f4ff_100%)] p-4 md:p-6">
      <div className="mx-auto flex h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/30 px-5 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/messageList")}
              className="rounded-2xl bg-white/10 p-2 transition hover:bg-white/20"
            >
              <ArrowLeft size={18} />
            </button>
            {partner.image || partner.avatar ? (
              <img
                src={partner.image || partner.avatar}
                alt={partner.name}
                className="h-12 w-12 rounded-2xl object-cover"
              />
            ) : (
              <UserCircle2 className="h-12 w-12 text-cyan-200" />
            )}
            <div>
              <h2 className="text-lg font-bold">{partner.name}</h2>
              <p className="text-sm text-cyan-100">{partner.email || "Direct conversation"}</p>
            </div>
          </div>
          <p className="hidden rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 md:block">
            Live messaging
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {loading ? (
            <p className="text-center text-white/80">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="mx-auto mt-16 max-w-md rounded-[28px] bg-white/70 p-8 text-center text-slate-700">
              <p className="text-lg font-bold">Start the conversation</p>
              <p className="mt-2 text-sm">Send the first message to begin chatting.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id || `${msg.timestamp}-${index}`}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-[24px] px-4 py-3 shadow-lg ${
                        isMine
                          ? "bg-emerald-400 text-slate-950"
                          : "bg-white text-slate-800"
                      }`}
                    >
                      <p className="text-sm font-semibold">{isMine ? "You" : msg.senderName}</p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm">{msg.content}</p>
                      <p className={`mt-2 text-[11px] ${isMine ? "text-slate-700" : "text-slate-500"}`}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/70 p-4 backdrop-blur">
          {status && <p className="mb-3 text-sm text-rose-600">{status}</p>}
          <div className="flex items-end gap-3">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Write a message..."
              className="max-h-36 min-h-[52px] flex-1 resize-none rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="inline-flex h-[52px] items-center gap-2 rounded-[24px] bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Send size={16} />
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
