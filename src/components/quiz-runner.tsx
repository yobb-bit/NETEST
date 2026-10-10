"use client";

import { useActionState } from "react";
import { submitQuizAction, type SubmitQuizState } from "@/app/quizzes/actions";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
};

export function QuizRunner({ attemptId, questions }: { attemptId: string; questions: QuizQuestion[] }) {
  const initialState: SubmitQuizState = { error: null };
  const [state, formAction, pending] = useActionState(submitQuizAction.bind(null, attemptId), initialState);

  return <div className="content reviewer-content quiz-runner">
    <p className="eyebrow">TAKE YOUR TIME · FEEDBACK AT THE END</p>
    <h1>Quiz questions</h1>
    <p className="welcome-copy quiz-instructions">Choose one answer for each question. You’ll see your score and explanations after you submit.</p>
    <form action={formAction} className="question-form">
      {questions.map((question, index) => <fieldset className="quiz-question" key={question.id}>
        <legend><span>QUESTION {String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
        <div className="quiz-options">{question.options.map((option) => <label className="quiz-option" key={option.id}>
          <input type="radio" name={`question-${question.id}`} value={option.id} required />
          <span>{option.text}</span>
        </label>)}</div>
      </fieldset>)}
      {state.error && <p className="quiz-error" role="alert">{state.error}</p>}
      <button className="button-primary quiz-start-button" type="submit" disabled={pending}>{pending ? "Checking answers…" : "Submit answers"}<span aria-hidden="true">→</span></button>
    </form>
  </div>;
}
