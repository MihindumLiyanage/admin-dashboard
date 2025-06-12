"use client";

import { memo, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Search,
  Select,
  TableToolbar,
  InlineLoading,
  Button,
} from "@carbon/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchSubmissionsByFilter,
  fetchSubmissionById,
} from "@/services/submissionService";
import { Application } from "@/types/application";
import styles from "@/styles/pages/activity.module.scss";
import SharedTable from "@/components/shared/Table";
import { ApplicationStatus } from "@/constants/status";

interface RowData {
  id: string;
  name: string;
  version: string;
  coverage: string;
  assessment: string;
  brokerName: string;
}

const useDebounce = (callback: (value: string) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedFunction = useCallback(
    (value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(value), delay);
    },
    [callback, delay]
  );
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );
  return debouncedFunction;
};

const Activity = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedSetSearch = useDebounce(setSearchValue, 300);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setEditErrors({});

    try {
      const submissions = await fetchSubmissionsByFilter("submissions");
      const quotes = await fetchSubmissionsByFilter("quotes");

      const merged = submissions.map((sub: Application) => {
        const quote = quotes.find(
          (q: Application) =>
            q.submission_reference.id === sub.submission_reference.id
        );
        return quote
          ? {
              ...sub,
              assessment: quote.assessment,
            }
          : sub;
      });

      const transformed: RowData[] = merged.map((item: Application) => ({
        id: item.submission_reference.id,
        name: item.insured.name,
        version: item.submission_reference.version,
        coverage: item.coverage.map((c) => c.type).join(" / "),
        brokerName: item.broker.name,
        assessment: item.assessment || "CREATED",
      }));

      setRows(transformed);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load data"
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh === "true") {
      loadData();
      router.replace("/activity");
    } else {
      loadData();
    }
  }, [loadData, searchParams, router]);

  const filteredRows = useMemo(() => {
    if (loading) return [];
    const filtered = rows.filter((row) => {
      const nameMatch = row.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const decisionMatch =
        !decisionFilter || row.assessment === decisionFilter;
      return nameMatch && decisionMatch;
    });
    return filtered;
  }, [rows, searchValue, decisionFilter, loading]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const handleDecisionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDecisionFilter(e.target.value);
    },
    []
  );

  const handleEdit = useCallback(
    async (id: string) => {
      const row = rows.find((r) => r.id === id);
      if (!row) return;
      if (
        [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(
          row.assessment as ApplicationStatus
        )
      ) {
        console.warn("Editing is not allowed for this status.");
        return;
      }

      setEditLoadingId(id);
      setEditErrors((prev) => ({ ...prev, [id]: "" }));

      try {
        const data = await fetchSubmissionById(id);
        sessionStorage.setItem("submissionData", JSON.stringify(data));
        router.push(
          `/submissions?submission_id=${encodeURIComponent(id)}&step=financial`
        );
      } catch (e: any) {
        setEditErrors((prev) => ({
          ...prev,
          [id]:
            e?.response?.data?.message ||
            e?.message ||
            "Failed to load submission data",
        }));
      } finally {
        setEditLoadingId(null);
      }
    },
    [rows, router]
  );

  const renderActions = useCallback(
    (row: RowData) => {
      const disabled = [
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
      ].includes(row.assessment as ApplicationStatus);
      return (
        <div>
          <Button
            size="sm"
            kind="primary"
            onClick={() => handleEdit(row.id)}
            disabled={disabled || editLoadingId === row.id}
          >
            {editLoadingId === row.id ? "Loading..." : "Edit"}
          </Button>
          {editErrors[row.id] && (
            <p className={styles.rowError} role="alert">
              {editErrors[row.id]}
            </p>
          )}
        </div>
      );
    },
    [editErrors, handleEdit, editLoadingId]
  );

  const columns = useMemo(
    () => [
      { id: "id", header: "User ID", sortable: true },
      { id: "name", header: "Insured Name", sortable: true },
      { id: "version", header: "Version", sortable: true },
      { id: "coverage", header: "Coverage Type", sortable: true },
      { id: "brokerName", header: "Broker Name", sortable: true },
      { id: "assessment", header: "Decision", sortable: true },
      { id: "actions", header: "Actions", render: renderActions },
    ],
    [renderActions]
  );

  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.loadingContainer}>
          <InlineLoading description="Loading submissions data..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <TableToolbar>
        <div className={styles.toolbarRow}>
          <div className={styles.tileGrid2}>
            <label className={styles.filterLabel}>
              Insured Name:
              <Search
                className={styles.searchInput}
                labelText="Search by insured name"
                placeholder="Enter insured name..."
                onChange={handleSearchChange}
                aria-label="Search submissions by insured name"
              />
            </label>
            <label className={styles.filterLabel}>
              Decision:
              <Select
                id="decision-select"
                className={styles.searchInput}
                labelText=""
                onChange={handleDecisionChange}
                value={decisionFilter}
                aria-label="Filter by decision status"
              >
                <option value="">All</option>
                {Object.values(ApplicationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          {!loading && (
            <Button
              className={styles.fetchButton}
              onClick={loadData}
              aria-label="Refresh submissions data"
            >
              Refresh
            </Button>
          )}
        </div>
      </TableToolbar>

      <SharedTable
        rows={filteredRows}
        columns={columns}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 50]}
        title="Activity Submissions"
        description={`${filteredRows.length} submission${
          filteredRows.length !== 1 ? "s" : ""
        } found`}
      />
    </div>
  );
};

export default memo(Activity);
