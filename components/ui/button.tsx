import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group hover:scale-[.97] hover:rounded-md active:scale-[.94] btn",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "btn-error",
        outline:
          "btn-outline border-1 border-foreground/50 hover:border-foreground/0",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
      },
      size: {
        default: "h-9 px-6 py-5 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span className="transition duration-150 group-hover:opacity-90 group-hover:scale-[1.0309] group-active:scale-[1.063]">
        {children}
      </span>
    </Comp>
  );
}

function ButtonAsLink({
  href,
  className,
  variant,
  size,
  children,
  linkProps = {},
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    linkProps: LinkProps;
    href: string;
  }) {
  return (
    <Button
      asChild
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      <Link href={href} {...linkProps}>
        {children}
      </Link>
    </Button>
  );
}

export { Button, buttonVariants, ButtonAsLink };
