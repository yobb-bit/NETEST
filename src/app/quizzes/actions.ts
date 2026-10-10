"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { scoreAnswers } from "@/features/quizzes/scoring";

export type SubmitQuizState = { error: string | null };

export async function startQuizAction(formData: FormData) {
  const topicSlugValue = formData.get("topicSlug");
  const countValue = formData.get("questionCount");

  if (typeof topicSlugValue !== "string" || typeof countValue !== "string") {
    redirect("/quizzes?error=invalid");
  }

  const requestedCount = Number(countValue);
  if (!Number.isInteger(requestedCount) || ![3, 6].includes(requestedCount)) {
    redirect("/quizzes?error=invalid");
  }

  const topicSlug = topicSlugValue || undefined;
  if (topicSlug) {
    const topic = await prisma.topic.findUnique({ where: { slug: topicSlug }, select: { id: true } });
    if (!topic) redirect("/quizzes?error=invalid-topic");
  }

  const questions = await prisma.question.findMany({
    where: topicSlug ? { topic: { slug: topicSlug } } : undefined,
    orderBy: [{ topic: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    take: requestedCount,
    select: { id: true },
  });

  if (questions.length === 0) redirect("/quizzes?error=no-questions");

  const attempt = await prisma.$transaction(async (transaction) => {
    const created = await transaction.quizAttempt.create({
      data: {
        totalQuestions: questions.length,
        topic: topicSlug ? { connect: { slug: topicSlug } } : undefined,
      },
    });

    for (const question of questions) {
      await transaction.quizResponse.create({
        data: { attemptId: created.id, questionId: question.id },
      });
    }

    return created;
  });

  redirect(`/quizzes/${attempt.id}`);
}

export async function submitQuizAction(
  attemptId: string,
  _previousState: SubmitQuizState,
  formData: FormData,
): Promise<SubmitQuizState> {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      responses: {
        include: {
          question: { include: { options: { orderBy: { sortOrder: "asc" } } } },
        },
      },
    },
  });

  if (!attempt) return { error: "This quiz attempt could not be found." };
  if (attempt.completedAt) redirect(`/quizzes/${attempt.id}`);

  const answers: { questionId: string; selectedOptionId: string }[] = [];
  for (const response of attempt.responses) {
    const value = formData.get(`question-${response.questionId}`);
    if (typeof value !== "string" || !response.question.options.some((option) => option.id === value)) {
      return { error: "Choose one answer for each question before submitting." };
    }
    answers.push({ questionId: response.questionId, selectedOptionId: value });
  }

  const result = scoreAnswers(
    attempt.responses.map((response) => ({
      id: response.questionId,
      correctOptionId: response.question.options.find((option) => option.isCorrect)?.id ?? "",
    })),
    answers,
  );

  await prisma.$transaction(async (transaction) => {
    for (const response of result.responses) {
      await transaction.quizResponse.update({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: response.questionId } },
        data: { selectedOptionId: response.selectedOptionId, isCorrect: response.isCorrect },
      });
    }

    await transaction.quizAttempt.update({
      where: { id: attempt.id },
      data: { score: result.score, completedAt: new Date() },
    });
  });

  redirect(`/quizzes/${attempt.id}`);
}
