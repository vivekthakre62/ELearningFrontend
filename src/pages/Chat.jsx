// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function Chat() {
  const { studentId } = useParams(); // other user ID
  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const stompClient = useRef(null);

  const teacher = JSON.parse(localStorage.getItem("user")); // logged-in teacher

  // Fetch student info
  useEffect(() => {
    if (!studentId) return;
    axios
      .get(`http://localhost:8080/api/user/getUserById/${studentId}`)
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Error fetching student:", err));
  }, [studentId]);

  // Room ID: smallerId-largerId (same for both users)
  const roomId = student
    ? `room-${Math.min(teacher.id, student.id)}-${Math.max(teacher.id, student.id)}`
    : null;

  // Fetch conversation between teacher and student
  useEffect(() => {
    if (!student) return;
    axios
      .get(`http://localhost:8080/api/messages/conversation/${teacher.id}/${student.id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching conversation:", err));
  }, [student]);

  // Setup WebSocket
  useEffect(() => {
    if (!roomId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.current.subscribe(`/topic/${roomId}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
        });
      },
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    stompClient.current.activate();

    return () => {
      stompClient.current.deactivate();
    };
  }, [roomId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !student) return;

    const message = {
      senderId: teacher.id,
      senderName: teacher.name,
      receiverId: student.id,
      content: input,
      roomId: roomId,
      timestamp: new Date().toISOString(),
    };

    // Send via backend for persistence
    axios
      .post("http://localhost:8080/api/messages/send", message)
      .catch((err) => console.error(err));

    // Send via WebSocket for live update
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(message),
      });
    }

    setInput("");
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading student info...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow">
        {student.image ? (
          <img
            src={student.image}
            alt={student.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
        )}
        <h2 className="text-lg font-semibold text-gray-800">{student.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs break-words ${
              msg.senderId === teacher.id
                ? "bg-green-200 self-end text-right"
                : "bg-white self-start text-left"
            }`}
          >
            <p className="text-sm font-medium">{msg.senderName}</p>
            <p>{msg.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
