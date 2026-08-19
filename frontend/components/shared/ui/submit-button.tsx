import { useFormStatus } from "react-dom";
import { Button } from "@/components/shared/ui/button";

export function SubmitButton({
  text,
  pendingText = "Loading...",
}: {
  text: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? pendingText : text}
    </Button>
  );
}
