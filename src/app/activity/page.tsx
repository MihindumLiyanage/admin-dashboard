"use client";

import { memo, useState, useEffect, useCallback } from "react";
import styles from "@/styles/pages/activity.module.scss";
import { ApplicationStatus } from "@/types/status";
import { Search, Select, TableToolbar, InlineLoading } from "@carbon/react";
import SharedTable from "@/components/shared/SharedTable";
import { activityService, RowData } from "@/services/activityService";

const Activity = () => {
  const [allRows, setAllRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.latestSubmissions();
      setAllRows(data);
      setFilteredRows(data);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applyFilters = useCallback(() => {
    const filtered = allRows.filter((row) => {
      const matchesName = (row.name ?? "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesDecision =
        !decisionFilter || row.decision === decisionFilter;
      return matchesName && matchesDecision;
    });
    setFilteredRows(filtered);
  }, [allRows, searchValue, decisionFilter]);

  useEffect(() => {
    applyFilters();
  }, [searchValue, decisionFilter, applyFilters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleDecisionFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDecisionFilter(event.target.value);
  };

  const columns = [
    { id: "id", header: "User ID", sortable: true },
    { id: "name", header: "Insured Name", sortable: true },
    { id: "version", header: "Version", sortable: true },
    { id: "coverage", header: "Coverage Type", sortable: true },
    { id: "decision", header: "Decision", sortable: true },
  ];

  return (
    <div className={styles.root}>
      <TableToolbar>
        <div className={styles.tileGrid2}>
          <label className={styles.filterLabel}>
            Insured Name:
            <Search
              className={styles.searchInput}
              labelText="Search"
              onChange={handleSearch}
              value={searchValue}
            />
          </label>
          <label className={styles.filterLabel}>
            Decision:
            <Select
              id="decision-select"
              className={styles.searchInput}
              noLabel
              onChange={handleDecisionFilter}
              value={decisionFilter}
            >
              <option value="">All</option>
              <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
              <option value={ApplicationStatus.REJECTED}>Rejected</option>
            </Select>
          </label>
        </div>
      </TableToolbar>

      {loading ? (
        <InlineLoading description="Loading data..." />
      ) : error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : (
        <SharedTable
          rows={filteredRows}
          columns={columns}
          initialPageSize={10}
          pageSizeOptions={[10, 20, 50]}
          title="Activity Submissions"
          description="List of user submissions"
        />
      )}
    </div>
  );
};

export default memo(Activity);
