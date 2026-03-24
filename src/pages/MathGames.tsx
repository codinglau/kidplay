import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Star, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Difficulty = "easy" | "medium" | "hard";

const diffConfig: Record<Difficulty, { max: number; ops: string[]; label: string; emoji: string }> = {
  easy: { max: 10, ops: ["+", "-"], label: "Easy", emoji: "🌱" },
  medium: { max: 20, ops: ["+", "-", "×"], label: "Medium", emoji: "🔥" },
  hard: { max: 50, ops: ["+", "-", "×"], label: "Hard", emoji: "🚀" },
};

function generateProblem(diff: Difficulty) {
  const { max, ops } = diffConfig[diff];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;

  if (op === "-" && a < b) [a, b] = [b, a];
  if (op === "×") {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
  }

  let answer: number;
  switch (op) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "×": answer = a * b; break;
    default: answer = a + b;
  }

  // Generate options
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + offset;
    if (wrong !== answer && wrong >= 0) options.add(wrong);
  }

  return { a, b, op, answer, options: Array.from(options).sort(() => Math.random() - 0.5) };
}

const MathGames = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [problem, setProblem] = useState(() => generateProblem("easy"));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(difficulty));
    setFeedback(null);
    setSelected(null);
  }, [difficulty]);

  useEffect(() => {
    nextProblem();
  }, [difficulty]);

  const handleAnswer = (choice: number) => {
    if (feedback) return;
    setSelected(choice);
    setTotal((t) => t + 1);

    if (choice === problem.answer) {
      const bonus = streak >= 3 ? 5 : 0;
      setScore((s) => s + 10 + bonus);
      setStreak((s) => s + 1);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }

    setTimeout(nextProblem, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-fun-green/10 rounded-full px-4 py-2 mb-4">
            <Calculator className="w-5 h-5 text-fun-green" />
            <span className="font-display font-semibold text-fun-green">Math Quest</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Solve & Score!</h1>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-fun-orange">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-display font-bold">{score}</span>
            </div>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-fun-pink"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span className="font-display font-bold">{streak} streak!</span>
              </motion.div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span className="font-body">{total} solved</span>
            </div>
          </div>
        </motion.div>

        {/* Difficulty */}
        <div className="flex justify-center gap-2 mb-6">
          {(Object.keys(diffConfig) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-2xl font-display font-semibold text-sm transition-all ${
                difficulty === d
                  ? "bg-fun-green text-success-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {diffConfig[d].emoji} {diffConfig[d].label}
            </button>
          ))}
        </div>

        {/* Problem Card */}
        <motion.div
          key={`${problem.a}${problem.op}${problem.b}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8 bubble-shadow text-center"
        >
          <div className="font-display text-5xl font-bold text-foreground mb-8">
            {problem.a} {problem.op} {problem.b} = ?
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {problem.options.map((opt) => {
              let btnClass = "bg-muted text-foreground hover:bg-primary/10 border-2 border-transparent";
              if (selected !== null) {
                if (opt === problem.answer) {
                  btnClass = "bg-fun-green text-success-foreground border-2 border-fun-green";
                } else if (opt === selected && feedback === "wrong") {
                  btnClass = "bg-destructive text-destructive-foreground border-2 border-destructive";
                }
              }

              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: feedback ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className={`py-4 rounded-2xl font-display text-2xl font-bold transition-all ${btnClass}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback === "correct" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-success font-display font-bold text-xl"
              >
                🎉 {streak >= 3 ? "Amazing! +15" : "Great! +10"} stars!
              </motion.div>
            )}
            {feedback === "wrong" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-destructive font-display font-bold text-xl"
              >
                ❌ The answer is {problem.answer}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default MathGames;
