<script lang="ts">
	import { goto } from "$app/navigation";
	import * as Command from "$lib/components/ui/command/index.js";
	import { sidebarData } from "$lib/config/sidebar-data";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import LaptopIcon from "@lucide/svelte/icons/laptop";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SunIcon from "@lucide/svelte/icons/sun";
	import { resetMode, setMode } from "mode-watcher";

	let { open = $bindable(false) }: { open?: boolean } = $props();

	function runCommand(command: () => unknown) {
		open = false;
		command();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each sidebarData.navGroups as group (group.title)}
			<Command.Group heading={group.title}>
				{#each group.items as navItem (navItem.title)}
					{#if navItem.url}
						<Command.Item
							value={navItem.title}
							onSelect={() => {
								runCommand(() => goto(navItem.url!));
							}}
						>
							<div class="flex size-4 items-center justify-center">
								<ArrowRightIcon class="text-muted-foreground/80 size-2" />
							</div>
							{navItem.title}
						</Command.Item>
					{:else}
						{#each navItem.items ?? [] as subItem, j (`${navItem.title}-${subItem.url}-${j}`)}
							<Command.Item
								value={`${navItem.title}-${subItem.url}`}
								onSelect={() => {
									runCommand(() => goto(subItem.url));
								}}
							>
								<div class="flex size-4 items-center justify-center">
									<ArrowRightIcon class="text-muted-foreground/80 size-2" />
								</div>
								{navItem.title}
								<ChevronRightIcon />
								{subItem.title}
							</Command.Item>
						{/each}
					{/if}
				{/each}
			</Command.Group>
		{/each}
		<Command.Separator />
		<Command.Group heading="Theme">
			<Command.Item onSelect={() => runCommand(() => setMode("light"))}>
				<SunIcon />
				<span>Light</span>
			</Command.Item>
			<Command.Item onSelect={() => runCommand(() => setMode("dark"))}>
				<MoonIcon class="scale-90" />
				<span>Dark</span>
			</Command.Item>
			<Command.Item onSelect={() => runCommand(() => resetMode())}>
				<LaptopIcon />
				<span>System</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
