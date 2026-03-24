import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Play, Trash2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

// Define custom blocks for kids
const defineCustomBlocks = () => {
  // Move character block
  Blockly.Blocks["move_character"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Move")
        .appendField(new Blockly.FieldDropdown([
          ["up ⬆️", "UP"],
          ["down ⬇️", "DOWN"],
          ["left ⬅️", "LEFT"],
          ["right ➡️", "RIGHT"],
        ]), "DIRECTION")
        .appendField(new Blockly.FieldNumber(1, 1, 10), "STEPS")
        .appendField("steps");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Move the character in a direction");
    },
  };

  // Say block
  Blockly.Blocks["say_message"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Say")
        .appendField(new Blockly.FieldTextInput("Hello!"), "MESSAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Make the character say something");
    },
  };

  // Wait block
  Blockly.Blocks["wait_seconds"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Wait")
        .appendField(new Blockly.FieldNumber(1, 0.1, 10), "SECONDS")
        .appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Wait for some time");
    },
  };

  // Change color block
  Blockly.Blocks["change_color"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Change color to")
        .appendField(new Blockly.FieldDropdown([
          ["red 🔴", "red"],
          ["blue 🔵", "blue"],
          ["green 🟢", "green"],
          ["yellow 🟡", "yellow"],
          ["purple 🟣", "purple"],
        ]), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Change the character color");
    },
  };

  // Play sound block
  Blockly.Blocks["play_sound"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Play sound")
        .appendField(new Blockly.FieldDropdown([
          ["pop 🎵", "pop"],
          ["whoosh 💨", "whoosh"],
          ["ding 🔔", "ding"],
          ["boing 🏀", "boing"],
        ]), "SOUND");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Play a fun sound");
    },
  };

  // JavaScript generators
  (javascriptGenerator.forBlock as any)["move_character"] = function (block: any) {
    const dir = block.getFieldValue("DIRECTION");
    const steps = block.getFieldValue("STEPS");
    return `move("${dir}", ${steps});\n`;
  };
  (javascriptGenerator.forBlock as any)["say_message"] = function (block: any) {
    const msg = block.getFieldValue("MESSAGE");
    return `say("${msg}");\n`;
  };
  (javascriptGenerator.forBlock as any)["wait_seconds"] = function (block: any) {
    const sec = block.getFieldValue("SECONDS");
    return `wait(${sec});\n`;
  };
  (javascriptGenerator.forBlock as any)["change_color"] = function (block: any) {
    const color = block.getFieldValue("COLOR");
    return `changeColor("${color}");\n`;
  };
  (javascriptGenerator.forBlock as any)["play_sound"] = function (block: any) {
    const sound = block.getFieldValue("SOUND");
    return `playSound("${sound}");\n`;
  };
};

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "🎮 Movement",
      colour: "#5B80A5",
      contents: [
        { kind: "block", type: "move_character" },
      ],
    },
    {
      kind: "category",
      name: "💬 Talk",
      colour: "#5CA65C",
      contents: [
        { kind: "block", type: "say_message" },
      ],
    },
    {
      kind: "category",
      name: "🎨 Looks",
      colour: "#A5745B",
      contents: [
        { kind: "block", type: "change_color" },
      ],
    },
    {
      kind: "category",
      name: "🔊 Sound",
      colour: "#A55BA5",
      contents: [
        { kind: "block", type: "play_sound" },
      ],
    },
    {
      kind: "category",
      name: "⏰ Control",
      colour: "#5BA58C",
      contents: [
        { kind: "block", type: "wait_seconds" },
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_if" },
      ],
    },
    {
      kind: "category",
      name: "🔢 Math",
      colour: "#5B67A5",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
      ],
    },
    {
      kind: "category",
      name: "📝 Text",
      colour: "#5BA55B",
      contents: [
        { kind: "block", type: "text" },
        { kind: "block", type: "text_join" },
      ],
    },
    {
      kind: "category",
      name: "🔁 Loops",
      colour: "#5BA5A5",
      contents: [
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_whileUntil" },
      ],
    },
  ],
};

// Character display
interface CharState {
  x: number;
  y: number;
  color: string;
  message: string;
  sound: string;
}

const BlocklyPlayground = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [character, setCharacter] = useState<CharState>({
    x: 150, y: 150, color: "blue", message: "", sound: "",
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    defineCustomBlocks();

    if (blocklyDiv.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox,
        grid: { spacing: 20, length: 3, colour: "#e0e0e0", snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9 },
        trashcan: true,
        move: { scrollbars: true, drag: true, wheel: true },
        renderer: "zelos",
        theme: Blockly.Themes.Classic,
      });
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  const runCode = () => {
    if (!workspaceRef.current) return;
    setIsRunning(true);
    setOutput([]);

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    const logs: string[] = [];
    let charState = { x: 150, y: 150, color: "blue", message: "", sound: "" };

    // Simulated runtime
    const move = (dir: string, steps: number) => {
      const px = steps * 30;
      switch (dir) {
        case "UP": charState.y = Math.max(0, charState.y - px); break;
        case "DOWN": charState.y = Math.min(280, charState.y + px); break;
        case "LEFT": charState.x = Math.max(0, charState.x - px); break;
        case "RIGHT": charState.x = Math.min(280, charState.x + px); break;
      }
      logs.push(`Moved ${dir} ${steps} steps`);
    };
    const say = (msg: string) => {
      charState.message = msg;
      logs.push(`Says: "${msg}"`);
    };
    const wait = (sec: number) => {
      logs.push(`Waited ${sec} seconds`);
    };
    const changeColor = (color: string) => {
      charState.color = color;
      logs.push(`Changed color to ${color}`);
    };
    const playSound = (sound: string) => {
      charState.sound = sound;
      logs.push(`Played sound: ${sound}`);
    };

    try {
      // eslint-disable-next-line no-new-func
      new Function("move", "say", "wait", "changeColor", "playSound", code)(
        move, say, wait, changeColor, playSound
      );
      setCharacter({ ...charState });
      if (logs.length === 0) logs.push("No blocks to run! Drag some blocks to get started.");
    } catch (e: any) {
      logs.push(`Error: ${e.message}`);
    }

    setOutput(logs);
    setTimeout(() => setIsRunning(false), 500);
  };

  const clearWorkspace = () => {
    workspaceRef.current?.clear();
    setOutput([]);
    setCharacter({ x: 150, y: 150, color: "blue", message: "", sound: "" });
  };

  const colorMap: Record<string, string> = {
    red: "hsl(0, 80%, 55%)",
    blue: "hsl(220, 90%, 56%)",
    green: "hsl(150, 70%, 45%)",
    yellow: "hsl(45, 100%, 55%)",
    purple: "hsl(270, 70%, 60%)",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-hero">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-fun-purple/10 rounded-full px-4 py-2 mb-3">
            <Code2 className="w-5 h-5 text-fun-purple" />
            <span className="font-display font-semibold text-fun-purple">Code Lab</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Build Your Game!</h1>
          <p className="text-muted-foreground text-sm font-body">Drag blocks from the left panel to create your program</p>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Blockly Editor */}
          <div className="lg:col-span-2 bg-card rounded-3xl bubble-shadow overflow-hidden border-2 border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <span className="font-display font-semibold text-sm text-foreground">Block Editor</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={runCode}
                  disabled={isRunning}
                  className="rounded-xl font-display bg-fun-green text-success-foreground hover:bg-fun-green/90"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearWorkspace}
                  className="rounded-xl font-display border-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div ref={blocklyDiv} className="w-full" style={{ height: "450px" }} />
          </div>

          {/* Preview + Output */}
          <div className="flex flex-col gap-4">
            {/* Stage */}
            <div className="bg-card rounded-3xl bubble-shadow p-4">
              <h3 className="font-display font-semibold text-sm text-foreground mb-2">🎬 Stage</h3>
              <div className="relative bg-muted rounded-2xl overflow-hidden" style={{ width: "100%", height: "200px" }}>
                {/* Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={300} stroke="currentColor" strokeWidth={1} />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`h${i}`} x1={0} y1={i * 30} x2={300} y2={i * 30} stroke="currentColor" strokeWidth={1} />
                  ))}
                </svg>

                {/* Character */}
                <motion.div
                  animate={{ left: character.x, top: character.y }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
                  style={{ backgroundColor: colorMap[character.color] || colorMap.blue }}
                >
                  🤖
                </motion.div>

                {/* Speech bubble */}
                {character.message && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-card rounded-2xl px-3 py-1 shadow font-body text-xs max-w-[120px]"
                  >
                    {character.message}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Output log */}
            <div className="bg-card rounded-3xl bubble-shadow p-4 flex-1">
              <h3 className="font-display font-semibold text-sm text-foreground mb-2">📋 Output</h3>
              <div className="bg-muted rounded-2xl p-3 h-40 overflow-y-auto font-body text-xs space-y-1">
                {output.length === 0 ? (
                  <p className="text-muted-foreground">Click "Run" to see what happens!</p>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className="text-foreground">
                      <span className="text-fun-green mr-1">▸</span> {line}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-secondary/30 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-fun-orange" />
                <span className="font-display font-semibold text-sm text-foreground">Tips</span>
              </div>
              <ul className="text-xs text-muted-foreground font-body space-y-1">
                <li>• Drag blocks from the left panel</li>
                <li>• Connect blocks together</li>
                <li>• Press Run to see your code work!</li>
                <li>• Try using loops to repeat actions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocklyPlayground;
