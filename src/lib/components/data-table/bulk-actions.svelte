<script lang="ts" generics="TData">
	import type { Snippet } from "svelte";
	import XIcon from "@lucide/svelte/icons/x";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { cn } from "$lib/utils.js";
	import { useDataTable } from "./context.svelte.js";

	let {
		entityName,
		children,
	}: {
		entityName: string;
		children: Snippet;
	} = $props();

	const { table } = useDataTable<TData>();

	const selectedCount = $derived(table.getFilteredSelectedRowModel().rows.length);
	let announcement = $state("");
	let toolbarEl = $state.raw<HTMLDivElement | null>(null);

	// Live-region announcements intentionally use an effect (timeout + clear), matching the React port.
	$effect(() => {
		if (selectedCount <= 0) return;
		const message = `${selectedCount} ${entityName}${selectedCount > 1 ? "s" : ""} selected. Bulk actions toolbar is available.`;
		queueMicrotask(() => {
			announcement = message;
		});
		const timer = setTimeout(() => {
			announcement = "";
		}, 3000);
		return () => clearTimeout(timer);
	});

	function handleClearSelection() {
		table.resetRowSelection();
	}

	function handleKeyDown(event: KeyboardEvent) {
		const buttons = toolbarEl?.querySelectorAll("button");
		if (!buttons) return;

		const currentIndex = Array.from(buttons).findIndex(
			(button) => button === document.activeElement
		);

		switch (event.key) {
			case "ArrowRight": {
				event.preventDefault();
				buttons[(currentIndex + 1) % buttons.length]?.focus();
				break;
			}
			case "ArrowLeft": {
				event.preventDefault();
				buttons[currentIndex === 0 ? buttons.length - 1 : currentIndex - 1]?.focus();
				break;
			}
			case "Home":
				event.preventDefault();
				buttons[0]?.focus();
				break;
			case "End":
				event.preventDefault();
				buttons[buttons.length - 1]?.focus();
				break;
			case "Escape": {
				const target = event.target as HTMLElement;
				const activeElement = document.activeElement as HTMLElement;
				const isFromDropdown =
					target?.closest('[data-slot="dropdown-menu-trigger"]') ||
					activeElement?.closest('[data-slot="dropdown-menu-trigger"]') ||
					activeElement?.closest('[data-slot="dropdown-menu-content"]') ||
					target?.closest('[data-slot="dropdown-menu-content"]');
				if (isFromDropdown) return;
				event.preventDefault();
				handleClearSelection();
				break;
			}
		}
	}
</script>

{#if selectedCount > 0}
	<div aria-live="polite" aria-atomic="true" class="sr-only" role="status">
		{announcement}
	</div>

	<div
		bind:this={toolbarEl}
		role="toolbar"
		aria-label={`Bulk actions for ${selectedCount} selected ${entityName}${selectedCount > 1 ? "s" : ""}`}
		aria-describedby="bulk-actions-description"
		tabindex="-1"
		onkeydown={handleKeyDown}
		class={cn(
			"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl",
			"transition-all delay-100 duration-300 ease-out hover:scale-105",
			"focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none"
		)}
	>
		<div
			class={cn(
				"rounded-xl border p-2 shadow-xl",
				"bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur-lg",
				"flex items-center gap-x-2"
			)}
		>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								onclick={handleClearSelection}
								class="size-6 rounded-full"
								aria-label="Clear selection"
								title="Clear selection (Escape)"
							>
								<XIcon />
								<span class="sr-only">Clear selection</span>
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Clear selection (Escape)</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Separator class="h-5" orientation="vertical" aria-hidden="true" />

			<div class="flex items-center gap-x-1 text-sm" id="bulk-actions-description">
				<Badge
					variant="default"
					class="min-w-8 rounded-lg"
					aria-label={`${selectedCount} selected`}
				>
					{selectedCount}
				</Badge>
				<span class="hidden sm:inline">
					{entityName}{selectedCount > 1 ? "s" : ""}
				</span>
				selected
			</div>

			<Separator class="h-5" orientation="vertical" aria-hidden="true" />

			{@render children()}
		</div>
	</div>
{/if}
