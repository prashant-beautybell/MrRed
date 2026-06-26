import { cn } from "@/lib/utils";

/** Shared horizontal padding for every page shell and navbar. */
export const APP_CONTAINER_PADDING = "px-4 sm:px-6 lg:px-8";

/** Centered content column — keeps marketing and app pages readable on wide screens. */
export const APP_CONTAINER_MAX = "max-w-7xl mx-auto";

export function appContainerClassName(className?: string, fluid = false) {
  return cn("w-full", APP_CONTAINER_PADDING, !fluid && APP_CONTAINER_MAX, className);
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Skip max-width — use for dashboard main column beside the chat sidebar. */
  fluid?: boolean;
}

export function Container({ children, className, fluid }: ContainerProps) {
  return <div className={appContainerClassName(className, fluid)}>{children}</div>;
}
