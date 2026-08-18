import type { Metadata } from "next";
import { BlogContent } from "@/components/blog-content";
import { InkGate } from "@/components/ink-gate";
import { ThemeControl } from "@/components/theme-control";
import { CursorInk } from "@/components/cursor-ink";

export const metadata: Metadata = {
  title: "守静致虚 · 个人博客",
  description: "软件开发者、创意编程实践者与技术写作者的个人博客。",
};

export default function HomePage() {
  return <><InkGate><BlogContent /></InkGate><ThemeControl /><CursorInk /></>;
}
