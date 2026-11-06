import type { ReactNode } from "react";
import { site } from "@/lib/site";

type InstagramLinkProps = {
  label: string;
  className?: string;
  children?: ReactNode;
};

export function InstagramLink({ label, className, children }: InstagramLinkProps) {
  return (
    <a
      href={site.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 fill-current">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 7.4A4.6 4.6 0 1 1 7.4 12 4.6 4.6 0 0 1 12 7.4zm0 1.6A3 3 0 1 0 15 12a3 3 0 0 0-3-3zm5.15-2.35a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05z" />
      </svg>
      {children}
    </a>
  );
}
