import Image from "next/image";
import { t } from "@/i18n/keys";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className = "" }: PoweredByProps) {
  return (
    <a
      href="https://contextrocket.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors ${className}`}
    >
      <span className="text-[10px] tracking-wide uppercase font-semibold">{t("footer.powered_by")}</span>
      <Image
        src="/brand/cr-logo-horizontal.svg"
        alt="ContextRocket"
        width={96}
        height={16}
        className="h-3 w-auto opacity-70 transition-opacity group-hover:opacity-100 dark:hidden"
      />
      <Image
        src="/brand/cr-logo-horizontal-white.png"
        alt="ContextRocket"
        width={96}
        height={16}
        className="h-3 w-auto opacity-70 transition-opacity group-hover:opacity-100 hidden dark:block"
      />
    </a>
  );
}
