import { StaticMathField, addStyles } from "react-mathquill";
import { ChevronRightIcon, EqualIcon } from "lucide-react";

interface MathCellProps {
  input: string;
  result: string;
}

addStyles();

function MathCell({ input, result }: MathCellProps) {
  return (
    <div className="flex flex-col gap-4 border rounded px-6 py-3 bg-muted">
      <div className="flex items-center">
        <ChevronRightIcon />
        <StaticMathField>{input}</StaticMathField>
      </div>
      <div className="flex items-center">
        <EqualIcon />
        <StaticMathField>{result}</StaticMathField>
      </div>
    </div>
  );
}

export default MathCell;
