import dbConnect from '../../../lib/mongodb';
import PersonalityProfile from '../../../models/PersonalityProfile';
import User from '../../../models/User';
import { authenticate } from '../../../middleware/auth';

const questions = [
  { id: 1, question: 'Quelle couleur préférez-vous ?', options: ['Rouge', 'Bleu', 'Vert', 'Noir'] },
  { id: 2, question: 'Votre style vestimentaire quotidien ?', options: ['Décontracté', 'Élégant', 'Sportif', 'Créatif'] },
  // Ajouter plus de questions
];

const calculateStyle = (answers) => {
  // Logique simple : compter les réponses
  const counts = {};
  answers.forEach(answer => {
    counts[answer] = (counts[answer] || 0) + 1;
  });
  const max = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  return max; // Style basé sur la réponse la plus fréquente
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  authenticate(req, res, async () => {
    await dbConnect();

    const { answers } = req.body; // answers: [{ questionId, answer }]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers' });
    }

    try {
      const styleType = calculateStyle(answers.map(a => a.answer));

      const profile = new PersonalityProfile({
        user: req.user._id,
        styleType,
        quizAnswers: answers,
      });

      await profile.save();

      // Mettre à jour l'utilisateur
      await User.findByIdAndUpdate(req.user._id, { personalityProfile: profile._id });

      res.status(201).json({ profile });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}