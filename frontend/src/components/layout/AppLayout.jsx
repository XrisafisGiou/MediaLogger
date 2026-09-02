import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AiChatButton from "../ai/AiChatButton";
import AiChatDrawer from "../ai/AiChatDrawer";

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />

      <Outlet />

      <AiChatButton
        onClick={() => setChatOpen(true)}
      />
      <AiChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}