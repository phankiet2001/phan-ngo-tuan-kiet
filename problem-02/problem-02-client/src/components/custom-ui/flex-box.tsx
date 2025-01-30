import { cn } from "../../lib/utils";

interface FlexBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const FlexBox: React.FC<FlexBoxProps> = ({ className, ...props }) => {
  return <div className={cn("flex justify-between items-center flex-row gap-2", className)} {...props} />;
};
