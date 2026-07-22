<script lang="ts">
  import type { LayoutProps } from "./$types";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  let { data, children }: LayoutProps = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ms-1" />
        <Separator
          orientation="vertical"
          class="me-2 data-[orientation=vertical]:h-4"
        />
      </div>
    </header>
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
