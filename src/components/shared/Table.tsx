import React, { useState, useMemo, useEffect } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination,
} from "@carbon/react";

interface TableColumn {
  id: string;
  header: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn[];
  rows: T[];
  title?: string;
  description?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  resetPageSignal?: number;
}

const SharedTable = <T,>({
  columns,
  rows = [],
  title,
  description,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  resetPageSignal,
}: TableProps<T>) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [resetPageSignal, rows]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [rows, sortKey, sortAsc]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  const carbonRows = useMemo(() => {
    return paginatedRows.map((row: any, index: number) => ({
      id: row.id || `row-${index}`,
      ...row,
    }));
  }, [paginatedRows]);

  const carbonHeaders = useMemo(() => {
    return columns.map((col) => ({
      key: col.id,
      header: col.header,
    }));
  }, [columns]);

  return (
    <DataTable rows={carbonRows} headers={carbonHeaders} isSortable>
      {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
        <TableContainer title={title} description={description}>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => {
                  const headerProps = getHeaderProps({
                    header,
                    onClick: () => {
                      setPage(1);
                      if (sortKey === header.key) {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortKey(header.key);
                        setSortAsc(true);
                      }
                    },
                  });
                  const { key, ...restProps } = headerProps;
                  return (
                    <TableHeader
                      key={key}
                      {...restProps}
                      style={{ cursor: "pointer" }}
                    >
                      {header.header}
                    </TableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    style={{ textAlign: "center" }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const rowProps = getRowProps({ row });
                  const { key, ...restProps } = rowProps;
                  const originalRowData = carbonRows.find(
                    (r) => r.id === row.id
                  );

                  return (
                    <TableRow key={key} {...restProps}>
                      {row.cells.map((cell: any, index: number) => {
                        const col = columns.find(
                          (c) => c.id === cell.info.header
                        );

                        return (
                          <TableCell key={index}>
                            {col?.render && originalRowData
                              ? col.render(originalRowData)
                              : cell.value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            page={page}
            pageSize={pageSize}
            pageSizes={pageSizeOptions}
            totalItems={sortedRows.length}
            onChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </TableContainer>
      )}
    </DataTable>
  );
};

export default SharedTable;
