import { cva } from "class-variance-authority";

// Links and buttons share the same Tailwind styles.
export const actionButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-foreground hover:bg-accent",
        outline: "border-primary bg-transparent text-primary hover:bg-accent",
        inverted: "shrink-0 border-white bg-white text-primary hover:border-accent hover:bg-accent focus-visible:outline-white!",
      },
      size: {
        default: "min-h-11 rounded-md px-[18px] py-[11px] text-sm font-medium focus-visible:outline-offset-4",
        landing: "min-h-12 gap-4 rounded border px-5 py-[13px] text-[13px] font-semibold no-underline focus-visible:outline-offset-[5px] max-[760px]:px-[14px] max-[760px]:text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);
