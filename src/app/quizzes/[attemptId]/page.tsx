import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/quiz-runner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Quiz attempt · NETEST", description: "Answer questions and review your quiz results." };
export const dynamic = "force-dynamic";

export default async function QuizAttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      topic: { select: { title: true } },
      responses: {
        orderBy: { question: { sortOrder: "asc" } },
        include: {
          question: { include: { options: { orderBy: { sortOrder: "asc" } } } },
          selectedOption: true,
        },
      },
    },
  });

  if (!attempt) notFound();

  if (!attempt.completedAt) {
    return <QuizRunner
      attemptId={attempt.id}
      questions={attempt.responses.map((response) => ({
        id: response.questionId,
        prompt: response.question.prompt,
        options: response.question.options.map(({ id, text }) => ({ id, text })),
      }))}
    />;
  }

  return <article className="content reviewer-content quiz-results">
    <p className="eyebrow">QUIZ COMPLETE{attempt.topic ? ` · ${attempt.topic.title.toUpperCase()}` : ""}</p>
    <h1>Your results</h1>
    <section className="score-card" aria-label="Quiz score">
      <div className="score-number">{attempt.score ?? 0}<span> / {attempt.totalQuestions}</span></div>
      <p>{attempt.score === attempt.totalQuestions ? "Excellent work. You got every answer right." : "Review the explanations to strengthen your understanding."}</p>
      <div className="score-track" aria-label={`${attempt.score ?? 0} of ${attempt.totalQuestions} correct`}><span style={{ width: `${attempt.totalQuestions ? ((attempt.score ?? 0) / attempt.totalQuestions) * 100 : 0}%` }} /></div>
    </section>
    <div className="result-heading"><h2>Answer review</h2><span>{attempt.responses.length} questions</span></div>
    <div className="result-list">{attempt.responses.map((response, index) => {
      const correctOption = response.question.options.find((option) => option.isCorrect);
      return <section className="result-card" key={response.id}>
        <div className="result-question-top"><span>QUESTION {String(index + 1).padStart(2, "0")}</span><span className={response.isCorrect ? "answer-status correct" : "answer-status incorrect"}>{response.isCorrect ? "Correct" : "Review"}</span></div>
        <h3>{response.question.prompt}</h3>
        <p className="answer-line"><strong>Your answer:</strong> {response.selectedOption?.text ?? "No answer recorded"}</p>
        {!response.isCorrect && correctOption && <p className="answer-line"><strong>Correct answer:</strong> {correctOption.text}</p>}
        <div className="explanation"><strong>Explanation</strong><p>{response.question.explanation}</p></div>
      </section>;
    })}</div>
    <p className="quiz-footnote">Completed {attempt.completedAt.toLocaleString()} · This result is saved locally.</p>
  </article>;
}
