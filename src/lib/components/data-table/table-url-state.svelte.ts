import type {
	ColumnFiltersState,
	PaginationState,
	Updater,
} from "@tanstack/table-core";

/**
 * Local-state stand-in for URL-synced table filters/pagination.
 * Swap this for a SvelteKit `goto` + `page.url` implementation later
 * without changing DataTableProvider consumers.
 */
export type ColumnFilterConfig = unknown;

export type UseTableUrlStateParams = {
	search?: Record<string, unknown>;
	pagination?: { defaultPage?: number; defaultPageSize?: number };
	columnFilters?: ColumnFilterConfig;
	globalFilter?: { enabled?: boolean };
};

export function createTableUrlState(params: UseTableUrlStateParams = {}) {
	const defaultPage = params.pagination?.defaultPage ?? 1;
	const defaultPageSize = params.pagination?.defaultPageSize ?? 10;

	let columnFilters = $state.raw<ColumnFiltersState>([]);
	let pagination = $state.raw<PaginationState>({
		pageIndex: Math.max(0, defaultPage - 1),
		pageSize: defaultPageSize,
	});

	function onColumnFiltersChange(updater: Updater<ColumnFiltersState>) {
		columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
	}

	function onPaginationChange(updater: Updater<PaginationState>) {
		pagination = typeof updater === "function" ? updater(pagination) : updater;
	}

	function ensurePageInRange(pageCount: number) {
		if (pageCount <= 0) return;
		if (pagination.pageIndex > pageCount - 1) {
			pagination = { ...pagination, pageIndex: Math.max(0, pageCount - 1) };
		}
	}

	return {
		get columnFilters() {
			return columnFilters;
		},
		onColumnFiltersChange,
		get pagination() {
			return pagination;
		},
		onPaginationChange,
		ensurePageInRange,
	};
}
