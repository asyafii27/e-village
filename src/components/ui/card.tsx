import type { PropsWithChildren, HTMLAttributes } from "react";

interface CardProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  title?: string;
}

export function Card({ title, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={["card-root", className].filter(Boolean).join(" ")}
      {...props}
    >
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-body">{children}</div>
    </div>
  );
}
