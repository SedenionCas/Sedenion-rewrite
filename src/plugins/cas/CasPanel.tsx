import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";
import CasPlugin from "./CasPlugin";
import { useEffect, useState } from "react";
import { ComputeEngine } from "@cortex-js/compute-engine";
import { EqualIcon } from "lucide-react";

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
    <div className="px-4 py-2 mt-4">
      <div className="space-y-4">
        {calculations.map((calculation, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 px-8 py-4 bg-secondary rounded-md border border-border"
          >
            <StaticMathField children={calculation[0]} />
            <StaticMathField children={calculation[1]} />
          </div>
        ))}
      </div>
      <div className="flex px-4 gap-4 bg-secondary justify-center mt-8 items-center rounded-md border border-border">
        <EditableMathField
          className="w-full border-none focus-within:ring-0 h-full min-h-16 flex items-center"
          latex={input}
          onChange={(field) => {
            setInput(field.latex());
          }}
        />
        <button
          className="bg-primary text-primary-foreground border-none h-fit p-3 rounded-md"
          onClick={() => handelEval()}
        >
          <EqualIcon />
        </button>
      </div>
    </div>
  );
}

export default CasPanel;
