import { ReactNode, useState } from "react";
import { SedenionPlugin } from "../../types/plugin";
import MathCell from "../../components/mathCell/MathCell";
import { EditableMathField } from "react-mathquill";

// TODO: don't use algebrite
// @ts-ignore ts(7016)
import Algebrite from "algebrite";
import { latex_to_js } from "../../lib/latext-to-js";

export class CasPlugin extends SedenionPlugin {
  name: string = "cas";
  version: string = "0.0.1";
  displayname: string = "Cas";
  dependencies: string[] = [];

  init(): void {}

  display(): ReactNode {
    const [calculations, setCalculations] = useState<[string, string][]>([]);
    const [input, setInput] = useState<string>("");

    const handleSubmit = () => {
      if (input === "") return;
      const result = Algebrite.eval(latex_to_js(input)).toString();
      setCalculations([...calculations, [input, result]]);
    };

    return (
      <div className="px-8 py-4">
        <section className="mb-4 space-y-2">
          {calculations.map((calc, i) => (
            <MathCell key={i} input={calc[0]} result={calc[1]} />
          ))}
        </section>

        <EditableMathField
          className="border-outline text-background-on focus-within:border-primary ring-0 shadow-none"
          latex={input}
          onChange={(mathField) => {
            setInput(mathField.latex());
          }}
          onSubmit={() => console.log("submitted")}
        />
        <button
          className="bg-primary-container text-primary-on-container px-3 py-1.5 rounded-md font-semibold ml-2"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    );
  }
}
