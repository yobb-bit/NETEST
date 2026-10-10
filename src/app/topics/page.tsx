import type { Metadata } from "next";
import Link from "next/link";
import { topics } from "@/features/reviewer/topics";

export const metadata: Metadata = { title: "Study topics · NETEST", description: "Browse introductory CCNA study notes by topic." };

export default function TopicsPage() {
  return <div className="content reviewer-content">
    <div className="page-intro"><p className="eyebrow">THE CCNA FOUNDATIONS</p><h1>Study topics</h1><p className="welcome-copy">Pick an area to explore original, bite-sized notes. Start anywhere and follow your curiosity.</p></div>
    <div className="topic-grid topic-grid-large" aria-label="Study topics">{topics.map((topic) => <Link className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}><div className={`topic-icon ${topic.tint}`} aria-hidden="true">{topic.icon}</div><span className="topic-number">TOPIC {topic.number}</span><h2>{topic.title}</h2><p>{topic.shortDescription}</p><span className="topic-objective">{topic.objective}</span><span className="topic-arrow" aria-hidden="true">↗</span></Link>)}</div>
    <p className="content-note">Study notes are original learning summaries aligned to Cisco CCNA 200-301 v1.1 exam domains. They are not official Cisco material. The published v1.1 exam version is scheduled through February 2, 2027; check Cisco’s <a href="https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html" target="_blank" rel="noreferrer">CCNA exam page</a> for current details.</p>
  </div>;
}
