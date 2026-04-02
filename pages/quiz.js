import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const questions = [
  { id: 1, question: 'Quelle couleur préférez-vous ?', options: ['Rouge', 'Bleu', 'Vert', 'Noir'] },
  { id: 2, question: 'Votre style vestimentaire quotidien ?', options: ['Décontracté', 'Élégant', 'Sportif', 'Créatif'] },
  // Ajouter plus
];

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const router = useRouter();

  const current = questions[step];

  const handleChoice = (answer) => {
    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      finishQuiz({ ...answers, [current.id]: answer });
    }
  };

  const finishQuiz = async (finalAnswers) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers: Object.entries(finalAnswers).map(([q, a]) => ({ questionId: q, answer: a })) }),
    });
    if (res.ok) router.push('/');
    else alert('Erreur lors de l\'envoi du quiz');
  };

  return (
    <Layout>
      <section className="container py-20">
        <div className="max-w-xl mx-auto card p-10">
          <div className="mb-4 text-xs uppercase tracking-widest text-[var(--muted)]">Quiz de personnalité</div>
          <h2 className="text-4xl font-black mb-3">Étape {step + 1} / {questions.length}</h2>
          <p className="text-lg text-[var(--muted)] mb-8">{current.question}</p>

          <div className="grid gap-4">
            {current.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleChoice(opt)}
                className="text-left rounded-xl border border-[var(--border)] p-5 transition hover:border-[var(--accent)] hover:bg-[rgba(34,34,34,0.04)]"
              >
                <span className="text-base text-[var(--text)] font-medium">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
            </div>
            <div className="mt-2 text-right text-xs text-[var(--muted)]">{Math.round(((step + 1) / questions.length) * 100)}% complété</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}