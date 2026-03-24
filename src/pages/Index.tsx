import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Code2, Sparkles, Star, Rocket } from "lucide-react";

const zones = [
  {
    title: "English Fun",
    description: "Unscramble words, learn spelling & vocabulary!",
    icon: BookOpen,
    path: "/english",
    colorClass: "bg-primary",
    emoji: "📚",
  },
  {
    title: "Math Quest",
    description: "Solve problems, earn stars & level up!",
    icon: Calculator,
    path: "/math",
    colorClass: "bg-fun-green",
    emoji: "🔢",
  },
  {
    title: "Code Lab",
    description: "Drag & drop blocks to build your own games!",
    icon: Code2,
    path: "/blockly",
    colorClass: "bg-fun-purple",
    emoji: "🧩",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-hero">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 bg-secondary/50 rounded-full px-5 py-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-fun-orange" />
          <span className="font-display font-semibold text-secondary-foreground">Learn • Play • Create</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-gradient-fun leading-tight"
        >
          Welcome to KidPlay!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 font-body"
        >
          A fun learning playground where you can master English, Math, and even build your own games with code blocks!
        </motion.p>

        {/* Floating decorations */}
        <div className="relative">
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-8 left-[10%] text-4xl">⭐</motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute -top-4 right-[15%] text-3xl">🎮</motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }} className="absolute top-4 left-[5%] text-2xl">🌟</motion.div>
        </div>
      </section>

      {/* Activity Zones */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {zones.map((zone) => (
            <motion.div key={zone.path} variants={item}>
              <Link
                to={zone.path}
                className="block group"
              >
                <div className="bg-card rounded-3xl p-6 bubble-shadow card-hover border-2 border-transparent hover:border-primary/20 text-center">
                  <div className={`${zone.colorClass} w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {zone.emoji}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {zone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body">
                    {zone.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-primary font-display font-semibold text-sm group-hover:gap-2 transition-all">
                    <Rocket className="w-4 h-4" />
                    Let's Go!
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-8 mt-12 text-center"
        >
          {[
            { icon: Star, label: "Fun Games", value: "10+" },
            { icon: Sparkles, label: "Skills to Learn", value: "50+" },
            { icon: Rocket, label: "Adventures", value: "∞" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="w-6 h-6 text-fun-orange" />
              <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground font-body">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
