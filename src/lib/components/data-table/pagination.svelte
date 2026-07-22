<script lang="ts" generics="TData">
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { cn, getPageNumbers } from "$lib/utils.js";
	import { useDataTable } from "./context.svelte.js";

	let { class: className }: { class?: string } = $props();

	const { table } = useDataTable<TData>();

	const currentPage = $derived(table.getState().pagination.pageIndex + 1);
	const totalPages = $derived(table.getPageCount());
	const pageNumbers = $derived(getPageNumbers(currentPage, totalPages));
	const pageSize = $derived(String(table.getState().pagination.pageSize));
</script>

<div
	class={cn(
		"flex items-center justify-between overflow-clip px-2",
		"@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4",
		className
	)}
	style="overflow-clip-margin: 1px"
>
	<div class="flex w-full items-center justify-between">
		<div
			class="flex w-[100px] items-center justify-center text-sm font-medium @2xl/content:hidden"
		>
			Page {currentPage} of {totalPages}
		</div>
		<div class="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
			<Select.Root
				type="single"
				value={pageSize}
				onValueChange={(value) => {
					if (value) table.setPageSize(Number(value));
				}}
			>
				<Select.Trigger class="h-8 w-[70px]">
					{pageSize}
				</Select.Trigger>
				<Select.Content side="top">
					{#each [10, 20, 30, 40, 50] as size (size)}
						<Select.Item value={`${size}`} label={`${size}`} />
					{/each}
				</Select.Content>
			</Select.Root>
			<p class="hidden text-sm font-medium sm:block">Rows per page</p>
		</div>
	</div>

	<div class="flex items-center sm:space-x-6 lg:space-x-8">
		<div
			class="flex w-[100px] items-center justify-center text-sm font-medium @max-3xl/content:hidden"
		>
			Page {currentPage} of {totalPages}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				class="size-8 p-0 @max-md/content:hidden"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to first page</span>
				<ChevronsLeftIcon class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeftIcon class="size-4" />
			</Button>

			{#each pageNumbers as pageNumber, index (`${pageNumber}-${index}`)}
				<div class="flex items-center">
					{#if pageNumber === "..."}
						<span class="text-muted-foreground px-1 text-sm">...</span>
					{:else}
						<Button
							variant={currentPage === pageNumber ? "default" : "outline"}
							class="h-8 min-w-8 px-2"
							onclick={() => table.setPageIndex(pageNumber - 1)}
						>
							<span class="sr-only">Go to page {pageNumber}</span>
							{pageNumber}
						</Button>
					{/if}
				</div>
			{/each}

			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRightIcon class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0 @max-md/content:hidden"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to last page</span>
				<ChevronsRightIcon class="size-4" />
			</Button>
		</div>
	</div>
</div>
