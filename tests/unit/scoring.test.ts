import { describe, expect, it } from "vitest";
import { scoreAnswers } from "../../src/features/quizzes/scoring";

const questions = [
  { id: "routing", correctOptionId: "longest-prefix" },
  { id: "services", correctOptionId: "dhcp-relay" },
];

describe("scoreAnswers", () => {
  it("scores a fully correct submission", () => {
    expect(scoreAnswers(questions, [
      { questionId: "routing", selectedOptionId: "longest-prefix" },
      { questionId: "services", selectedOptionId: "dhcp-relay" },
    ])).toEqual({
      score: 2,
      totalQuestions: 2,
      responses: [
        { questionId: "routing", selectedOptionId: "longest-prefix", isCorrect: true },
        { questionId: "services", selectedOptionId: "dhcp-relay", isCorrect: true },
      ],
    });
  });

  it("scores incorrect answers without changing the question count", () => {
    const result = scoreAnswers(questions, [
      { questionId: "routing", selectedOptionId: "shortest-prefix" },
      { questionId: "services", selectedOptionId: "dhcp-relay" },
    ]);

    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(2);
    expect(result.responses.map((response) => response.isCorrect)).toEqual([false, true]);
  });

  it("treats missing answers as incorrect", () => {
    const result = scoreAnswers(questions, []);

    expect(result.score).toBe(0);
    expect(result.responses.every((response) => !response.isCorrect)).toBe(true);
  });
});
