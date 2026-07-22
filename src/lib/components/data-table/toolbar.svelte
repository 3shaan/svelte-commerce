<script lang="ts" generics="TData">
	import type { Component } from "svelte";
	import XIcon from "@lucide/svelte/icons/x";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { useDataTable } from "./context.svelte.js";
	import DataTableFacetedFilter from "./faceted-filter.svelte";
	import DataTableViewOptions from "./view-options.svelte";

	let {
		searchPlaceholder = "Filter...",
		searchKey,
		filters = [],
	}: {
		searchPlaceholder?: string;
		searchKey?: string;
		filters?: {
			columnId: string;
			title: string;
			options: {
				label: string;
				value: string | number;
				icon?: Component<{ class?: string }>;
			}[];
		}[];
	} = $props();

	const { table } = useDataTable<TData>();

	const isFiltered = $derived(
		table.getState().columnFilters.length > 0 || Boolean(table.getState().globalFilter)
	);

	const searchValue = $derived(
		searchKey !== undefined
			? ((table.getColumn(searchKey)?.getFilterValue() as string | undefined) ?? "")
			: ((table.getState().globalFilter as string | undefined) ?? "")
	);

	function onSearchInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		if (searchKey !== undefined) {
			table.getColumn(searchKey)?.setFilterValue(value);
		} else {
			table.setGlobalFilter(value);
		}
	}

	function resetFilters() {
		table.resetColumnFilters();
		table.setGlobalFilter("");
	}
</script>

<div class="flex items-center justify-between">
	<div
		class="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2"
	>
		<Input
			placeholder={searchPlaceholder}
			value={searchValue}
			oninput={onSearchInput}
			class="h-8 w-[150px] lg:w-[250px]"
		/>
		<div class="flex gap-x-2">
			{#each filters as filter (filter.columnId)}
				{@const column = table.getColumn(filter.columnId)}
				{#if column}
					<DataTableFacetedFilter
						{column}
						title={filter.title}
						options={filter.options}
					/>
				{/if}
			{/each}
		</div>
		{#if isFiltered}
			<Button variant="ghost" onclick={resetFilters} class="h-8 px-2 lg:px-3">
				Reset
				<XIcon class="ms-2 size-4" />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
