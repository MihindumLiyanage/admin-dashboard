"use client";

import { memo, useState, useEffect, useCallback } from "react";
import {
  Search,
  Select,
  TableToolbar,
  InlineLoading,
  Button,
} from "@carbon/react";
import { useRouter } from "next/navigation";
import {
  fetchSubmissionsByFilter,
  fetchSubmissionById,
} from "@/services/submissionService";
import { ApplicationStatus } from "@/constants/status";
import styles from "@/styles/pages/activity.module.scss";
import SharedTable from "@/components/shared/SharedTable";

interface SubmissionItem {
  submission_reference: {
    id: string;
    version: string;
  };
  insured: {
    name: string;
  };
  coverage: { type: string }[];
  assessment?: string;
}

interface RowData {
  id: string;
  name: string;
  version: string;
  coverage: string;
  assessment: string;
}

const Activity = () => {
  const [allRows, setAllRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const submissions = await fetchSubmissionsByFilter<SubmissionItem[]>(
        "submissions",
        "latest"
      );
      const quotes = await fetchSubmissionsByFilter<SubmissionItem[]>(
        "quotes",
        "latest"
      );

      const mergedSubmissions = submissions.map((submission) => {
        const matchingQuote = quotes.find(
          (quote) =>
            quote.submission_reference.id === submission.submission_reference.id
        );
        if (matchingQuote) {
          return {
            ...submission,
            assessment: matchingQuote.assessment,
          };
        }
        return submission;
      });

      const transformedRows: RowData[] = mergedSubmissions.map(
        (item: SubmissionItem) => ({
          id: item.submission_reference.id,
          name: item.insured.name,
          version: item.submission_reference.version,
          coverage: item.coverage.map((coverage) => coverage.type).join(" / "),
          assessment: item.assessment || "APPROVED",
        })
      );

      setAllRows(transformedRows);
      setFilteredRows(transformedRows);
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
        !decisionFilter || row.assessment === decisionFilter;
      return matchesName && matchesDecision;
    });
    setFilteredRows(filtered);
  }, [allRows, searchValue, decisionFilter]);

  useEffect(() => {
    if (!loading) applyFilters();
  }, [searchValue, decisionFilter, applyFilters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleDecisionFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDecisionFilter(event.target.value);
  };

  const handleEdit = async (id: string) => {
    try {
      const data = await fetchSubmissionById(id);
      sessionStorage.setItem("quoteData", JSON.stringify(data));
      router.push(`/submissions?submission_id=${encodeURIComponent(id)}`);
    } catch (error) {
      console.error("Failed to fetch submission for edit:", error);
    }
  };

  const columns = [
    { id: "id", header: "User ID", sortable: true },
    { id: "name", header: "Insured Name", sortable: true },
    { id: "version", header: "Version", sortable: true },
    { id: "coverage", header: "Coverage Type", sortable: true },
    { id: "assessment", header: "Decision", sortable: true },
    {
      id: "actions",
      header: "Actions",
      render: (row: RowData) => {
        const isLocked = [
          ApplicationStatus.ACCEPTED,
          ApplicationStatus.REJECTED,
        ].includes(row.assessment as ApplicationStatus);

        return (
          <Button
            size="sm"
            kind={isLocked ? "ghost" : "primary"}
            disabled={isLocked}
            onClick={() => handleEdit(row.id)}
            className={isLocked ? styles.disabledEdit : ""}
            title={
              isLocked
                ? "Editing is not allowed for this status"
                : "Edit submission"
            }
          >
            {isLocked ? "Locked" : "Edit"}
          </Button>
        );
      },
    },
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
              <option value="">DEFAULT</option>
              {Object.values(ApplicationStatus)
                .slice(0, 4)
                .map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
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
