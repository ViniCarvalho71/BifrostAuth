import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EmptyState,
  PaginationButton,
  PaginationButtonsCenter,
  PaginationControls,
  PaginationInfo,
  PaginationMetaRight,
  PaginationSection,
  PaginationSelect,
  SearchInput,
  Table,
  TableContainer,
  TableHead,
  TableToolbar,
  Td,
  Th,
  Tr
} from "./style";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data?: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
  searchPlaceholder?: string;
  searchableFields?: Array<keyof T & string>;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  refreshTrigger?: number;
  oDataFetcher?: (query?: string) => Promise<{
    status: number;
    data: T[];
    totalCount?: number;
    errorMessage?: string | null;
  }>;
  onFetchError?: (message: string) => void;
};

function escapeODataSearch(value: string): string {
  return value.trim().toLowerCase().replace(/'/g, "''");
}

function buildODataQuery<T>(
  search: string,
  page: number,
  pageSize: number,
  searchableFields: Array<keyof T & string>
): string {
  const params = new URLSearchParams();
  params.set("$top", String(pageSize));
  params.set("$skip", String((page - 1) * pageSize));
  params.set("$count", "true");

  const searchTerm = search.trim();
  if (searchTerm && searchableFields.length > 0) {
    const escapedTerm = escapeODataSearch(searchTerm);
    const filter = searchableFields
      .map((field) => `contains(tolower(${String(field)}), '${escapedTerm}')`)
      .join(" or ");

    if (filter) {
      params.set("$filter", filter);
    }
  }

  return params.toString();
}

function DataTable<T>({
  columns,
  data = [],
  rowKey,
  emptyMessage = "Nenhum registro encontrado.",
  searchPlaceholder = "Pesquisar...",
  searchableFields = [],
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  refreshTrigger,
  oDataFetcher,
  onFetchError
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [remoteRows, setRemoteRows] = useState<T[]>([]);
  const [remoteTotalCount, setRemoteTotalCount] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (!oDataFetcher) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      try {
        const query = buildODataQuery<T>(search, page, pageSize, searchableFields);
        const resultado = await oDataFetcher(query);

        if (!isMounted) {
          return;
        }

        if (resultado.status < 200 || resultado.status >= 300) {
          setRemoteRows([]);
          setRemoteTotalCount(0);
          if (resultado.errorMessage && onFetchError) {
            onFetchError(resultado.errorMessage);
          }
          return;
        }

        setRemoteRows(resultado.data);
        setRemoteTotalCount(resultado.totalCount ?? resultado.data.length);
      } catch {
        if (!isMounted) {
          return;
        }

        setRemoteRows([]);
        setRemoteTotalCount(0);
        if (onFetchError) {
          onFetchError("Nao foi possível carregar os dados da tabela.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [oDataFetcher, onFetchError, page, pageSize, refreshTrigger, search, searchableFields]);

  const localFilteredRows = useMemo(() => {
    if (oDataFetcher) {
      return [] as T[];
    }

    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch || searchableFields.length === 0) {
      return data;
    }

    return data.filter((row) =>
      searchableFields.some((field) => {
        const rawValue = (row as Record<string, unknown>)[field];
        if (rawValue === undefined || rawValue === null) {
          return false;
        }

        return String(rawValue).toLowerCase().includes(normalizedSearch);
      })
    );
  }, [data, oDataFetcher, search, searchableFields]);

  const visibleRows = useMemo(() => {
    if (oDataFetcher) {
      return remoteRows;
    }

    const start = (page - 1) * pageSize;
    return localFilteredRows.slice(start, start + pageSize);
  }, [localFilteredRows, oDataFetcher, page, pageSize, remoteRows]);

  const totalCount = oDataFetcher ? remoteTotalCount : localFilteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const displayEmptyMessage = isLoading ? "Carregando..." : emptyMessage;

  return (
    <>
      <TableToolbar>
        <SearchInput
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Pesquisar tabela"
        />
      </TableToolbar>

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
            {visibleRows.length === 0 && (
              <Tr>
                <EmptyState colSpan={columns.length}>{displayEmptyMessage}</EmptyState>
              </Tr>
            )}

            {visibleRows.map((row) => (
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

      <PaginationSection>
        <PaginationButtonsCenter>
          <PaginationControls>
            <PaginationButton
              type="button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={page <= 1 || isLoading}
            >
              Anterior
            </PaginationButton>
            <PaginationButton
              type="button"
              onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Próxima
            </PaginationButton>
          </PaginationControls>
        </PaginationButtonsCenter>

        <PaginationMetaRight>
          <PaginationControls>
          <PaginationInfo>
            Página {Math.min(page, totalPages)} de {totalPages}
          </PaginationInfo>
          <PaginationSelect
            value={String(pageSize)}
            onChange={(event) => setPageSize(Number(event.target.value))}
            aria-label="Itens por página"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={String(option)}>
                {option}
              </option>
            ))}
          </PaginationSelect>
          </PaginationControls>
        </PaginationMetaRight>
      </PaginationSection>
    </>
  );
}

export default DataTable;
