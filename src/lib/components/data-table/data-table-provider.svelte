<script lang="ts" generics="TData">
	import type { Snippet } from "svelte";
	import type {
		ColumnDef,
		RowSelectionState,
		SortingState,
		TableOptions,
		Updater,
		VisibilityState,
	} from "@tanstack/table-core";
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
	} from "@tanstack/table-core";
	import {
		createSvelteTable,
		mergeObjects,
	} from "$lib/components/ui/data-table/index.js";
	import { setDataTableContext } from "./context.svelte.js";
	import {
		createTableUrlState,
		type ColumnFilterConfig,
	} from "./table-url-state.svelte.js";
	import "./table-meta.js";

	type ExtraTableOptions = Omit<
		TableOptions<TData>,
		| "getCoreRowModel"
		| "getFilteredRowModel"
		| "getSortedRowModel"
		| "getFacetedRowModel"
		| "getFacetedUniqueValues"
		| "getPaginationRowModel"
		| "data"
		| "columns"
	>;

	let {
		data,
		columns,
		// Reserved for future URL sync (same API as React provider)
		columnFilterConfig: _columnFilterConfig = undefined,
		search: _search = {},
		extraTableOptions = {},
		children,
	}: {
		data: TData[];
		columns: ColumnDef<TData, unknown>[];
		columnFilterConfig?: ColumnFilterConfig;
		search?: Record<string, unknown>;
		extraTableOptions?: ExtraTableOptions;
		children: Snippet;
	} = $props();

	let rowSelection = $state.raw<RowSelectionState>({});
	let columnVisibility = $state.raw<VisibilityState>({});
	let sorting = $state.raw<SortingState>([]);

	const urlState = createTableUrlState({
		pagination: { defaultPage: 1, defaultPageSize: 10 },
		globalFilter: { enabled: false },
	});

	function onRowSelectionChange(updater: Updater<RowSelectionState>) {
		rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
	}

	function onSortingChange(updater: Updater<SortingState>) {
		sorting = typeof updater === "function" ? updater(sorting) : updater;
	}

	function onColumnVisibilityChange(updater: Updater<VisibilityState>) {
		columnVisibility =
			typeof updater === "function" ? updater(columnVisibility) : updater;
	}

	const table = createSvelteTable(
		mergeObjects(
			{
				get data() {
					return data;
				},
				get columns() {
					return columns;
				},
				get state() {
					return {
						sorting,
						pagination: urlState.pagination,
						rowSelection,
						columnFilters: urlState.columnFilters,
						columnVisibility,
					};
				},
				enableRowSelection: true,
				onPaginationChange: urlState.onPaginationChange,
				onColumnFiltersChange: urlState.onColumnFiltersChange,
				onRowSelectionChange,
				onSortingChange,
				onColumnVisibilityChange,
				getPaginationRowModel: getPaginationRowModel(),
				getCoreRowModel: getCoreRowModel(),
				getFilteredRowModel: getFilteredRowModel(),
				getSortedRowModel: getSortedRowModel(),
				getFacetedRowModel: getFacetedRowModel(),
				getFacetedUniqueValues: getFacetedUniqueValues(),
			},
			() => extraTableOptions
		) as TableOptions<TData>
	);

	setDataTableContext({ table });

	$effect(() => {
		urlState.ensurePageInRange(table.getPageCount());
	});
</script>

{@render children()}
