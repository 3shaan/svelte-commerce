<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLElement> & {
    fixed?: boolean;
    fluid?: boolean;
    children: Snippet;
  };

  let {
    fixed = false,
    fluid = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<main
  data-layout={fixed ? "fixed" : "auto"}
  class={cn(
    "px-4 py-6",
    fixed && "flex grow flex-col overflow-hidden",
    !fluid && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
    className,
  )}
  {...rest}
>
  {@render children()}
</main>
