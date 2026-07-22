<script lang="ts" generics="TData, TValue">
	import type { Component } from "svelte";
	import type { Column } from "@tanstack/table-core";
	import CheckIcon from "@lucide/svelte/icons/check";
	import CirclePlusIcon from "@lucide/svelte/icons/circle-plus";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { cn } from "$lib/utils.js";

	let {
		column,
		title,
		options,
	}: {
		column?: Column<TData, TValue>;
		title?: string;
		options: {
			label: string;
			value: string | number;
			icon?: Component<{ class?: string }>;
		}[];
	} = $props();

	const facets = $derived(column?.getFacetedUniqueValues());
	const filterValue = $derived(
		(column?.getFilterValue() as (string | number)[] | undefined) ?? []
	);
	const selectedValues = $derived(new Set(filterValue));

	function toggleOption(value: string | number) {
		const next = new Set(selectedValues);
		if (next.has(value)) {
			next.delete(value);
		} else {
			next.add(value);
		}
		const filterValues = Array.from(next);
		column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<CirclePlusIcon class="size-4" />
				{title}
				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedValues.size}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{selectedValues.size} selected
							</Badge>
						{:else}
							{#each options.filter((option) => selectedValues.has(option.value)) as option (option.value)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						{@const isSelected = selectedValues.has(option.value)}
						<Command.Item onSelect={() => toggleOption(option.value)}>
							<div
								class={cn(
									"border-primary flex size-4 items-center justify-center rounded-sm border",
									isSelected
										? "bg-primary text-primary-foreground"
										: "opacity-50 [&_svg]:invisible"
								)}
							>
								<CheckIcon class="text-background size-4" />
							</div>
							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="text-muted-foreground size-4" />
							{/if}
							<span>{option.label}</span>
							{#if facets?.get(option.value) !== undefined}
								<span
									class="ms-auto flex size-4 items-center justify-center font-mono text-xs"
								>
									{facets.get(option.value)}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							onSelect={() => column?.setFilterValue(undefined)}
							class="justify-center text-center"
						>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
