<script lang="ts">
  import type { ColumnDef } from "@tanstack/table-core";
  import type { PageProps } from "./$types";
  import {
    DataTable,
    DataTablePagination,
    DataTableProvider,
    DataTableToolbar,
  } from "$lib/components/data-table";
  import Main from "$lib/components/main.svelte";

  let { data }: PageProps = $props();

  const columns: ColumnDef<(typeof data.categories)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
  ];
</script>

<Main>
  <DataTableProvider
    data={data.categories}
    {columns}
    columnFilterConfig={[]}
    search={{}}
  >
    <div class="flex flex-col gap-4">
      <DataTableToolbar
        searchPlaceholder="Filter categories..."
        searchKey="name"
      />
      <DataTable />
      <DataTablePagination />
    </div>
  </DataTableProvider>
</Main>
