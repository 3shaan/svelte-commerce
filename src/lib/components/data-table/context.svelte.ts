import { createContext } from "svelte";
import type { Table } from "@tanstack/table-core";

export type DataTableContextValue<TData> = {
	table: Table<TData>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const [getDataTableContext, setDataTableContext] =
	createContext<DataTableContextValue<any>>();

export function useDataTable<TData>() {
	return getDataTableContext() as DataTableContextValue<TData>;
}
