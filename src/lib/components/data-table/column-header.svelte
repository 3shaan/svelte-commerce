<script lang="ts" generics="TData, TValue">
	import type { Column } from "@tanstack/table-core";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import EyeOffIcon from "@lucide/svelte/icons/eye-off";
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	let {
		column,
		title,
		class: className,
	}: {
		column: Column<TData, TValue>;
		title: string;
		class?: string;
	} = $props();
</script>

{#if !column.getCanSort()}
	<div class={cn(className)}>{title}</div>
{:else}
	<div class={cn("flex items-center space-x-2", className)}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="sm"
						class="data-[state=open]:bg-accent h-8"
					>
						<span>{title}</span>
						{#if column.getIsSorted() === "desc"}
							<ArrowDownIcon class="ms-2 h-4 w-4" />
						{:else if column.getIsSorted() === "asc"}
							<ArrowUpIcon class="ms-2 h-4 w-4" />
						{:else}
							<ChevronsUpDownIcon class="ms-2 h-4 w-4" />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
					<ArrowUpIcon class="text-muted-foreground/70 size-3.5" />
					Asc
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
					<ArrowDownIcon class="text-muted-foreground/70 size-3.5" />
					Desc
				</DropdownMenu.Item>
				{#if column.getCanHide()}
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
						<EyeOffIcon class="text-muted-foreground/70 size-3.5" />
						Hide
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
