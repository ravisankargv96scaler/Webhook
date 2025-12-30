import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Trophy, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which mechanism is more efficient for infrequent events?",
    options: ["Polling (Checking repeatedly)", "Webhooks (Event-driven push)"],
    correctIndex: 1,
    explanation: "Webhooks are 'push' based. You don't waste resources asking 'is it ready?' 1000 times; the server just tells you once when it is."
  },
  {
    id: 2,
    question: "What HTTP method is standard for Webhook payloads?",
    options: ["GET", "POST", "DELETE", "PATCH"],
    correctIndex: 1,
    explanation: "Providers almost exclusively use POST requests because they need to send a data payload (JSON body) to your server."
  },
  {
    id: 3,
    question: "Why is an HMAC signature important?",
    options: ["To encrypt the data so no one can read it", "To verify the sender's identity and ensure integrity"],
    correctIndex: 1,
    explanation: "Webhooks are public URLs. Signatures allow you to cryptographically prove that the request actually came from GitHub/Stripe, not an imposter."
  },
  {
    id: 4,
    question: "What does 'Idempotency' mean in this context?",
    options: ["Handling duplicate events safely", "Processing events as fast as possible", "Rejecting invalid signatures"],
    correctIndex: 0,
    explanation: "Networks are flaky. Sometimes a provider sends the same event twice. Your code must check an ID to ensure you don't charge a customer twice or merge a PR twice."
  }
];

const Tab6Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const getScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = getScore();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!submitted ? (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Knowledge Check</h2>
            <p className="text-slate-400 mt-2">Test your understanding of event-driven architecture.</p>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                <span className="text-primary mr-2">{idx + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between
                      ${answers[q.id] === i 
                        ? 'bg-primary/20 border-primary text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}
                    `}
                  >
                    {opt}
                    {answers[q.id] === i && <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_#6366f1]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="text-center space-y-8">
          <div className="bg-surface p-8 rounded-2xl border border-slate-700 inline-block w-full">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${score === questions.length ? 'text-yellow-400' : 'text-slate-500'}`} />
            <h2 className="text-4xl font-bold text-white mb-2">
              You scored {score} / {questions.length}
            </h2>
            <p className="text-slate-400 mb-6">
              {score === questions.length ? "Perfect! You're a Webhook Master." : "Great effort! Review the answers below."}
            </p>
            
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Try Again
            </button>
          </div>

          <div className="space-y-6 text-left">
            {questions.map((q) => {
               const isCorrect = answers[q.id] === q.correctIndex;
               return (
                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-rose-500/30 bg-rose-900/10'}`}>
                   <div className="flex items-start gap-3">
                     {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> : <XCircle className="w-5 h-5 text-rose-500 mt-1" />}
                     <div>
                       <div className="font-semibold text-slate-200">{q.question}</div>
                       <div className="text-sm mt-1 text-slate-400">
                         Your answer: <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>{q.options[answers[q.id]]}</span>
                       </div>
                       {!isCorrect && (
                         <div className="text-sm text-emerald-400 mt-1">Correct answer: {q.options[q.correctIndex]}</div>
                       )}
                       <p className="text-xs text-slate-500 mt-2 italic border-t border-slate-700/50 pt-2">{q.explanation}</p>
                     </div>
                   </div>
                </div>
               )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab6Quiz;
