import { StaticMathField, addStyles } from "react-mathquill";

interface MathCellProps {
  input: string;
  result: string;
}

addStyles();

function MathCell({ input, result }: MathCellProps) {
  return (
    <div className="flex flex-col gap-5 bg-secondary-container w-full text-secondary-on-container px-4 py-2 rounded-md">
      <StaticMathField>{input}</StaticMathField>
      <StaticMathField>{result}</StaticMathField>
    </div>
  );
}

export default MathCell;
