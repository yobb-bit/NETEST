"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getTopicBySlug } from "@/features/reviewer/topics";

const navItems = [
  { label: "Overview", href: "/", icon: "⌂", key: "overview" },
  { label: "Study topics", href: "/topics", icon: "▤", key: "topics" },
  { label: "Quiz practice", href: "/quizzes", icon: "◎", key: "quizzes" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const topic = segments[0] === "topics" && segments[1] ? getTopicBySlug(segments[1]) : undefined;
  const activeItem = pathname === "/" ? "overview" : segments[0] === "quizzes" ? "quizzes" : "topics";
  const currentPage = topic?.title ?? (activeItem === "quizzes" ? "Quiz practice" : activeItem === "topics" ? "Study topics" : "Overview");

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="NETEST home"><span className="brand-mark">N<span>·</span></span><span>netest</span></Link>
        <p className="nav-label">YOUR WORKSPACE</p>
        <nav aria-label="Main navigation" className="main-nav">
          {navItems.map((item) => <Link className={`nav-link${activeItem === item.key ? " active" : ""}`} href={item.href} key={item.key} aria-current={activeItem === item.key ? "page" : undefined}><span aria-hidden="true">{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="sidebar-bottom"><div className="offline-indicator"><span className="status-dot" /> Everything stays on this device</div><div className="profile"><div className="avatar">N</div><div><strong>My study space</strong><small>CCNA learner</small></div><span className="profile-menu" aria-hidden="true">···</span></div></div>
      </aside>
      <section className="main-area">
        <header className="topbar"><div className="breadcrumb"><Link href="/">Workspace</Link><span>/</span>{topic && <><Link href="/topics">Study topics</Link><span>/</span></>}{currentPage}</div><div className="topbar-right"><span className="today">A little progress goes a long way.</span><div className="top-avatar" aria-hidden="true">N</div></div></header>
        {children}
      </section>
    </main>
  );
}
