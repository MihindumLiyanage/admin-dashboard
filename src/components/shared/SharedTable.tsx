import React, { useState, useMemo } from "react";
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

interface TableProps {
  columns: TableColumn[];
  rows: any[];
  title?: string;
  description?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

const SharedTable: React.FC<TableProps> = ({
  columns,
  rows = [],
  title,
  description,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30],
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
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

  const carbonRows = paginatedRows.map((row) => ({
    id: row.id,
    ...row,
  }));

  const carbonHeaders = columns.map((col) => ({
    key: col.id,
    header: col.header,
  }));

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
                  return (
                    <TableRow key={key} {...restProps}>
                      {row.cells.map((cell, index) => {
                        const col = columns.find(
                          (c) => c.id === cell.info.header
                        );
                        return (
                          <TableCell key={index}>
                            {col?.render ? col.render(row) : cell.value}
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
