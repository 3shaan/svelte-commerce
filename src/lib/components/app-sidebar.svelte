<script lang="ts">
	import NavGroup from "./nav-group.svelte";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { sidebarData } from "$lib/config/sidebar-data";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<div>Eshan</div>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each sidebarData.navGroups as group (group.title)}
			<NavGroup title={group.title} items={group.items} />
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={sidebarData.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
