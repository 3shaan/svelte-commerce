<script lang="ts">
	import { Button, type ButtonProps } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import SearchIcon from "@lucide/svelte/icons/search";

	let {
		class: className = "",
		placeholder = "Search",
		...restProps
	}: ButtonProps & { placeholder?: string } = $props();
</script>

<Button
	{...restProps}
	variant="outline"
	class={cn(
		"bg-muted/25 text-muted-foreground hover:bg-accent group relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64",
		className
	)}
	aria-keyshortcuts="Meta+K Control+K"
>
	<SearchIcon
		aria-hidden="true"
		class="inset-s-1.5 absolute top-1/2 -translate-y-1/2"
		size={16}
	/>
	<span class="ms-4">{placeholder}</span>
	<kbd
		class="bg-muted pointer-events-none absolute inset-e-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none group-hover:bg-accent sm:flex"
	>
		<span class="text-xs">⌘</span>K
	</kbd>
</Button>
