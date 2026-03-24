import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, Star, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const wordBank = [
  { word: "ELEPHANT", hint: "A big grey animal with a trunk 🐘" },
  { word: "BUTTERFLY", hint: "A colorful flying insect 🦋" },
  { word: "RAINBOW", hint: "Colorful arc in the sky after rain 🌈" },
  { word: "DINOSAUR", hint: "Ancient giant reptile 🦕" },
  { word: "PENGUIN", hint: "A bird that cannot fly but loves cold 🐧" },
  { word: "VOLCANO", hint: "A mountain that can erupt with lava 🌋" },
  { word: "DOLPHIN", hint: "A smart, friendly sea creature 🐬" },
  { word: "ROCKET", hint: "Goes to space! 🚀" },
  { word: "CASTLE", hint: "Where kings and queens live 🏰" },
  { word: "DRAGON", hint: "A mythical fire-breathing creature 🐉" },
];

function shuffle(str: string): string {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === str ? shuffle(str) : result;
}

const EnglishGames = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const currentWord = wordBank[currentIndex];

  const resetWord = useCallback(() => {
    setScrambled(shuffle(wordBank[currentIndex].word));
    setGuess("");
    setFeedback(null);
    setShowHint(false);
  }, [currentIndex]);

  useEffect(() => {
    resetWord();
  }, [resetWord]);

  const handleSubmit = () => {
    if (guess.toUpperCase() === currentWord.word) {
      setFeedback("correct");
      setScore((s) => s + (showHint ? 5 : 10));
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % wordBank.length);
      }, 1500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const skip = () => {
    setCurrentIndex((i) => (i + 1) % wordBank.length);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-primary">Word Scramble</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Unscramble the Word!</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-fun-orange">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-display font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span className="font-body text-sm">{currentIndex + 1}/{wordBank.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Card */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8 bubble-shadow text-center"
        >
          {/* Scrambled letters */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {scrambled.split("").map((letter, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center font-display text-xl font-bold text-secondary-foreground shadow-sm"
              >
                {letter}
              </motion.div>
            ))}
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-muted-foreground font-body mb-4 text-sm"
              >
                💡 {currentWord.hint}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your answer..."
              className="w-full px-5 py-3 rounded-2xl border-2 border-border bg-background font-display text-lg text-center tracking-widest focus:outline-none focus:border-primary transition-colors"
              maxLength={currentWord.word.length}
            />
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback === "correct" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-success font-display font-bold text-xl mb-4"
              >
                🎉 Correct! +{showHint ? 5 : 10} stars!
              </motion.div>
            )}
            {feedback === "wrong" && (
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: [10, -10, 10, 0] }}
                className="text-destructive font-display font-bold mb-4"
              >
                ❌ Try again!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={handleSubmit}
              disabled={!guess || feedback === "correct"}
              className="rounded-2xl font-display bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            >
              Check ✓
            </Button>
            {!showHint && (
              <Button
                variant="outline"
                onClick={() => setShowHint(true)}
                className="rounded-2xl font-display border-2"
              >
                💡 Hint
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={skip}
              className="rounded-2xl font-display text-muted-foreground"
            >
              Skip <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              onClick={resetWord}
              className="rounded-2xl font-display text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnglishGames;
