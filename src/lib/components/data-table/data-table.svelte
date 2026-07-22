<script lang="ts" generics="TData">
	import { cn } from "$lib/utils.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import FlexRender from "$lib/components/ui/data-table/flex-render.svelte";
	import { useDataTable } from "./context.svelte.js";
	import "./table-meta.js";

	let { class: className }: { class?: string } = $props();

	const { table } = useDataTable<TData>();
</script>

<div class={cn("overflow-hidden rounded-md border", className)}>
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row class="group/row">
					{#each headerGroup.headers as header (header.id)}
						<Table.Head
							colspan={header.colSpan}
							class={cn(
								"bg-primary text-white group-data-[state=selected]/row:bg-muted",
								header.column.columnDef.meta?.className,
								header.column.columnDef.meta?.thClassName
							)}
						>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && "selected"} class="group/row">
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell
							class={cn(
								"bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
								cell.column.columnDef.meta?.className,
								cell.column.columnDef.meta?.tdClassName
							)}
						>
							<FlexRender
								content={cell.column.columnDef.cell}
								context={cell.getContext()}
							/>
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell
						colspan={table.getHeaderGroups()[0]?.headers.length ?? 0}
						class="h-24 text-center"
					>
						No results.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
