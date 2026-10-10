import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicBySlug, topics } from "@/features/reviewer/topics";

type TopicPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return topics.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  return { title: topic ? `${topic.title} · NETEST` : "Study topic · NETEST", description: topic?.description };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  return <article className="content reviewer-content note-page">
    <Link className="back-link" href="/topics"><span aria-hidden="true">←</span> All study topics</Link>
    <header className="note-header"><div className={`topic-icon topic-icon-large ${topic.tint}`} aria-hidden="true">{topic.icon}</div><p className="eyebrow">TOPIC {topic.number} · {topic.objective}</p><h1>{topic.title}</h1><p className="welcome-copy">{topic.description}</p></header>
    <div className="notes-list">{topic.notes.map((note, index) => <section className="note-card" key={note.title}><div className="note-index">NOTE {String(index + 1).padStart(2, "0")}</div><div><h2>{note.title}</h2><p>{note.body}</p><h3>Key ideas</h3><ul>{note.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></div></section>)}</div>
    <div className="note-footer"><span>Original introductory study notes · CCNA 200-301 v1.1</span><Link className="text-link" href={`/topics/${topics[(topics.findIndex((item) => item.slug === slug) + 1) % topics.length].slug}`}>Next topic <span aria-hidden="true">→</span></Link></div>
  </article>;
}
