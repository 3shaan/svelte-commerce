<script lang="ts">
  import { getCoreRowModel, type ColumnDef } from "@tanstack/table-core";
  import type { PageProps } from "./$types";
  import { createSvelteTable } from "$lib/components/ui/data-table";
  import * as Table from "$lib/components/ui/table/index.js";
  import FlexRender from "$lib/components/ui/data-table/flex-render.svelte";

  let { data }: PageProps = $props();

  const column: ColumnDef<(typeof data.categories)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
  ];

  const table = createSvelteTable({
    data: data.categories,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head class="[&:has([role=checkbox])]:ps-3">
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell class="[&:has([role=checkbox])]:ps-3">
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell
            colspan={table.getAllColumns().length}
            class="h-24 text-center"
          >
            No results.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
