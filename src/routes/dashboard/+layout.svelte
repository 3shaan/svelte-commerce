<script lang="ts">
	import type { LayoutProps } from "./$types";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import CommandMenu from "$lib/components/command-menu.svelte";
	import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
	import Search from "$lib/components/search.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import Separator from "$lib/components/ui/separator/separator.svelte";

	let { children }: LayoutProps = $props();

	let commandOpen = $state(false);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex w-full items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator
					orientation="vertical"
					class="me-2 data-[orientation=vertical]:h-4"
				/>
				<Search onclick={() => (commandOpen = true)} />
				<div class="ms-auto">
					<DarkModeToggle />
				</div>
			</div>
		</header>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
<CommandMenu bind:open={commandOpen} />
