import type { Metadata } from "next";
import Link from "next/link";
import { startQuizAction } from "@/app/quizzes/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Quiz practice · NETEST", description: "Practice CCNA questions and review explanations." };
export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  invalid: "Choose a question count and try again.",
  "invalid-topic": "That topic is unavailable. Choose another topic.",
  "no-questions": "There are no questions in that topic yet.",
};

export default async function QuizSetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, topics, totalQuestions] = await Promise.all([
    searchParams,
    prisma.topic.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, _count: { select: { questions: true } } },
    }),
    prisma.question.count(),
  ]);

  return <div className="content reviewer-content quiz-setup">
    <div className="page-intro"><p className="eyebrow">PRACTICE WITH PURPOSE</p><h1>Quiz practice</h1><p className="welcome-copy">Take a short multiple-choice quiz, then review each answer and its explanation.</p></div>
    {totalQuestions > 0 ? <form action={startQuizAction} className="quiz-setup-card">
      <label className="quiz-field" htmlFor="topicSlug"><span>Study area</span><select id="topicSlug" name="topicSlug" defaultValue=""><option value="">All study areas ({totalQuestions} questions)</option>{topics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title} ({topic._count.questions} {topic._count.questions === 1 ? "question" : "questions"})</option>)}</select></label>
      <label className="quiz-field" htmlFor="questionCount"><span>Question count</span><select id="questionCount" name="questionCount" defaultValue={String(totalQuestions >= 6 ? 6 : 3)}><option value="3">3 questions</option><option value="6">6 questions</option></select></label>
      <p className="quiz-help">A topic with fewer questions than the selected count will use all questions available.</p>
      {error && errorMessages[error] && <p className="quiz-error" role="alert">{errorMessages[error]}</p>}
      <button className="button-primary quiz-start-button" type="submit">Start quiz <span aria-hidden="true">→</span></button>
    </form> : <section className="quiz-setup-card empty-quiz-state"><h2>No quiz questions yet</h2><p>Add sample questions by running the database seed command.</p><Link className="text-link" href="/topics">Review study topics <span aria-hidden="true">→</span></Link></section>}
    <p className="quiz-footnote">These are original sample questions. Your attempts and answers are saved in the local database on this computer.</p>
  </div>;
}
