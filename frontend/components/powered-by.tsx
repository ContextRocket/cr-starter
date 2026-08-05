import Image from "next/image";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className = "" }: PoweredByProps) {
  return (
    <a
      href="https://contextrocket.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors ${className}`}
    >
      <Image
        src="/brand/cr-icon-red.svg"
        alt=""
        width={14}
        height={14}
        className="size-3.5 opacity-50"
      />
      <span>Powered by ContextRocket</span>
    </a>
  );
}
