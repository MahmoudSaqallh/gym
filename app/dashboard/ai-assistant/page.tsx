import type { Metadata } from "next";
import { AiAssistant } from "@/components/dashboard/ai/ai-assistant";

export const metadata: Metadata = { title: "AI Assistant – Kinora" };

export default function AiAssistantPage() {
  return <AiAssistant />;
}
