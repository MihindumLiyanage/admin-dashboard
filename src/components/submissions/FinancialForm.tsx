"use client";

import React from "react";
import { NumberInput, MultiSelect, Button } from "@carbon/react";

import classes from "@/styles/pages/submissions.module.scss";

const coverage_options = [
  { value: "D&O", label: "D&O" },
  { value: "EPL", label: "EPL" },
  { value: "FID", label: "FID" },
];

function FinacialForm({ application }) {
  return (
    <>
      <div className={classes.RevnavigationBtns}>
        <Button>Save</Button>
      </div>

      <NumberInput
        id="total_employees-input"
        label="Total Employee Count"
        placeholder="Enter the total employee count"
        min={0}
        value={application.financials.employee_count || ""}
      />

      <NumberInput
        id="revenue-input"
        label="Most Recent Year End Revenue"
        placeholder="Enter most recent year end revenue"
        value={application.financials.revenue || ""}
      />

      <NumberInput
        id="current_assets-input"
        label="Most Recent Year End Current Assets"
        placeholder="Enter most recent year end current assets"
        value={application.financials.current_assets || ""}
      />

      <NumberInput
        id="current_liabilities-input"
        label="Most Recent Year End Current Liabilities"
        placeholder="Enter most recent year end current liabilities"
        value={application.financials.current_liabilities || ""}
      />

      <NumberInput
        id="total_assets-input"
        label="Most Recent Year End Total Assets"
        placeholder="Enter most recent year end total assets"
        value={application.financials.total_assets || ""}
      />

      <NumberInput
        id="total_liabilities-input"
        label="Most Recent Year End Total Liabilities"
        placeholder="Enter most recent year end total liabilities"
        value={application.financials.total_liabilities || ""}
      />

      <NumberInput
        id="net_income_loss-input"
        label="Most Recent Year Net Income/Loss"
        placeholder="Enter most recent year net income/loss"
        value={application.financials.net_income_loss || ""}
      />

      <MultiSelect
        id="coverage-input"
        titleText="Coverage(s)"
        label="Coverage Options"
        items={coverage_options}
        itemToString={(item) => (item ? item.label : "")}
        initialSelectedItems={application.coverage.map((coverage) =>
          coverage_options.find((option) => option.value === coverage.type)
        )}
        selectionFeedback="top-after-reopen"
      />

      <NumberInput
        id="retained_earning-input"
        label="Most Recent Year End Retained Earnings"
        placeholder="(Optional)"
        value={application.financials.retained_earning ?? ""}
      />

      <NumberInput
        id="end_ebit-input"
        label="Most Recent Year End EBIT"
        placeholder="(Optional)"
        value={application.financials.end_ebit ?? ""}
      />
    </>
  );
}

export default FinacialForm;
