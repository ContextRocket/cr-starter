export interface NavLink {
  label: string;
  href: string;
  variant?: "default" | "primary";
  current?: boolean;
}

export type LocaleOption = {
  code: string;
  label: string;
  href: string;
};
