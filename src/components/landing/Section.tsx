import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section = ({ children, className = "", id, ...props }: SectionProps) => {
  return (
    <section
      id={id}
      className={`relative px-6 py-24 md:px-12 lg:px-24 ${className}`}
      {...props}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
};
