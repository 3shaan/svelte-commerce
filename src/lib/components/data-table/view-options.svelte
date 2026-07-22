<script lang="ts" generics="TData">
	import type { Table } from "@tanstack/table-core";
	import SlidersHorizontalIcon from "@lucide/svelte/icons/sliders-horizontal";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { useDataTable } from "./context.svelte.js";

	let {
		table: tableProp,
	}: {
		table?: Table<TData>;
	} = $props();

	const ctx = useDataTable<TData>();
	const table = $derived(tableProp ?? ctx.table);

	const hideableColumns = $derived(
		table
			.getAllColumns()
			.filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ms-auto hidden h-8 lg:flex">
				<SlidersHorizontalIcon class="size-4" />
				View
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[150px]">
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each hideableColumns as column (column.id)}
			<DropdownMenu.CheckboxItem
				class="capitalize"
				checked={column.getIsVisible()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				{column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
