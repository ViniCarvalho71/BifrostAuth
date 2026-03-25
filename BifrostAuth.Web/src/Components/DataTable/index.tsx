import type { ReactNode } from "react";
import { EmptyState, Table, TableContainer, TableHead, Td, Th, Tr } from "./style";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
};

function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "Nenhum registro encontrado."
}: DataTableProps<T>) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.key} $align={column.align} $width={column.width}>
                {column.header}
              </Th>
            ))}
          </Tr>
        </TableHead>

        <tbody>
          {data.length === 0 && (
            <Tr>
              <EmptyState colSpan={columns.length}>{emptyMessage}</EmptyState>
            </Tr>
          )}

          {data.map((row) => (
            <Tr key={rowKey(row)}>
              {columns.map((column) => (
                <Td key={column.key} $align={column.align}>
                  {column.render(row)}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
