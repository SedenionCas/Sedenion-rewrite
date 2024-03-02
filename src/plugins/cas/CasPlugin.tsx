import { ReactNode, useState } from "react";
import { SedenionPlugin } from "../../types/plugin";
import MathCell from "./components/mathCell/MathCell";
import { EditableMathField } from "react-mathquill";
import { EqualIcon } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { ComputeEngine } from "@cortex-js/compute-engine";

export class CasPlugin extends SedenionPlugin {
  name: string = "cas";
  version: string = "0.0.1";
  displayname: string = "Cas";
  dependencies: string[] = [];

  display(): ReactNode {
    const [calculations, setCalculations] = useState<[string, string][]>([]);
    const [input, setInput] = useState<string>("");

    const handleSubmit = () => {
      if (input === "") return;

      const ce = new ComputeEngine();
      const result = ce.parse(input).simplify().latex;
      setCalculations([...calculations, [input, result]]);
      setInput("");
    };

    return (
      <div className="px-8 py-4">
        <section className="mb-4 space-y-2">
          {calculations.map((calc, i) => (
            <MathCell key={i} input={calc[0]} result={calc[1]} />
          ))}
        </section>

        <Card>
          <CardContent className="flex pb-0 items-center justify-between bg-muted">
            <EditableMathField
              className="w-11/12 h-full border-none rounded-md focus-within:ring-0"
              latex={input}
              onChange={(mathField) => {
                setInput(mathField.latex());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <Button className="my-4" onClick={handleSubmit}>
              <EqualIcon />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
