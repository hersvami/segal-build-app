import type { QuestionTemplate } from "../utils/smartQuestions";

interface QuestionsStepProps {
  templates: QuestionTemplate[];
  answers: Record<string, string>;
  onPickAnswer: (questionId: string, answer: string) => void;
}

export function QuestionsStep({ templates, answers, onPickAnswer }: QuestionsStepProps) {
  return (
    <section className="space-y-4">
      <h4 className="text-lg font-bold text-slate-900">Smart Questions</h4>
      {templates.map((question) => (
        <div key={question.id} className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-semibold text-slate-900">{question.question}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onPickAnswer(question.id, option)}
                className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                  answers[question.id] === option
                    ? "border-red-400 bg-red-50 text-red-800"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}