import { useEffect, useState } from "react";
import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";
import { ComputeEngine } from "@cortex-js/compute-engine";
import { EqualIcon } from "lucide-react";
import { Button, buttonVariants } from "src/components/ui/button";
import key from "src/lib/key";

import type CasPlugin from "./CasPlugin";

addStyles();

interface CasPanelProps {
  plugin: CasPlugin;
}

function CasPanel({ plugin }: CasPanelProps) {
  const [calculations, setCalculations] = useState<[string, string][]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await plugin.load();
      if (data) {
        setCalculations(data.calculations);
      }
    })();
  }, []);

  const handelEval = () => {
    const ce = new ComputeEngine();
    const result = ce.parse(input).simplify().latex;
    const newCalculations: [string, string][] = [
      ...calculations,
      [input, result],
    ];
    setCalculations(newCalculations);
    plugin.save({ calculations: newCalculations });
  };

  return (
    <div className="mt-4 flex max-h-full flex-col overflow-y-auto px-4 py-2 pb-8">
      <div className="space-y-4">
        {calculations.map((calculation) => (
          <div
            key={key()}
            className="flex flex-col gap-2 rounded-md border border-border bg-secondary px-8 py-4"
          >
            <StaticMathField>{calculation[0]}</StaticMathField>
            <StaticMathField>{calculation[1]}</StaticMathField>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-4 rounded-md border border-border bg-secondary px-4">
        <EditableMathField
          className="flex h-full min-h-16 w-full items-center border-none focus-within:ring-0"
          latex={input}
          onChange={(field) => {
            setInput(field.latex());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handelEval();
            }
          }}
        />
        <Button className={buttonVariants({ size: "icon" })}>
          <EqualIcon />
        </Button>
      </div>
    </div>
  );
}

export default CasPanel;
