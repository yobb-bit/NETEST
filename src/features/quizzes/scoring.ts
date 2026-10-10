export type ScoringQuestion = {
  id: string;
  correctOptionId: string;
};

export type SubmittedAnswer = {
  questionId: string;
  selectedOptionId: string;
};

export type ScoredAnswer = SubmittedAnswer & {
  isCorrect: boolean;
};

export function scoreAnswers(
  questions: ScoringQuestion[],
  answers: SubmittedAnswer[],
): { score: number; totalQuestions: number; responses: ScoredAnswer[] } {
  const answersByQuestion = new Map(answers.map((answer) => [answer.questionId, answer.selectedOptionId]));
  const responses = questions.map((question) => {
    const selectedOptionId = answersByQuestion.get(question.id) ?? "";
    return {
      questionId: question.id,
      selectedOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });

  return {
    score: responses.filter((response) => response.isCorrect).length,
    totalQuestions: questions.length,
    responses,
  };
}
