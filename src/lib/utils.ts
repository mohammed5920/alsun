import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//added by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
