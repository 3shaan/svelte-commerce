import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Build a compact page number list with ellipsis for pagination controls.
 * @example getPageNumbers(5, 10) => [1, '...', 4, 5, 6, '...', 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
	if (totalPages <= 0) return [];
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages: (number | "...")[] = [1];

	if (currentPage <= 3) {
		pages.push(2, 3, 4, "...", totalPages);
	} else if (currentPage >= totalPages - 2) {
		pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
	} else {
		pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
	}

	return pages;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
