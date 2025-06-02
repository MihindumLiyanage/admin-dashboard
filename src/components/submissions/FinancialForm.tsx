"use client";

import React, { useEffect, useState } from "react";
import { Button, NumberInput, Grid, Column } from "@carbon/react";
import { ArrowLeft } from "@carbon/icons-react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "@/components/common/Toast";
import styles from "@/styles/pages/submissions.module.scss";
import { coverageOptions } from "@/constants/coverageOptions";
import { Application, CoverageType } from "@/types/application";
import { generateUpdatedApplication } from "@/utils/helpers";
import { createSubmission } from "@/services/submissionService";
import { ApplicationStatus } from "@/constants/status";

interface FinancialFormProps {
  application: Application;
  onUpdate: (application: Application) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

const schema = yup.object().shape({
  employee_count: yup
    .number()
    .typeError("Employee count is required")
    .required("Employee count is required")
    .min(0, "Must be zero or more"),
  revenue: yup
    .number()
    .typeError("Revenue is required")
    .required("Revenue is required"),
  current_assets: yup
    .number()
    .typeError("Current assets are required")
    .required("Current assets are required"),
  current_liabilities: yup
    .number()
    .typeError("Current liabilities are required")
    .required("Current liabilities are required"),
  total_assets: yup
    .number()
    .typeError("Total assets are required")
    .required("Total assets are required"),
  total_liabilities: yup
    .number()
    .typeError("Total liabilities are required")
    .required("Total liabilities are required"),
  net_income_loss: yup
    .number()
    .typeError("Net income/loss is required")
    .required("Net income/loss is required"),
  coverage: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one coverage"),
  retained_earning: yup
    .number()
    .typeError("Retained earning must be a number")
    .nullable()
    .notRequired(),
  end_ebit: yup
    .number()
    .typeError("EBIT must be a number")
    .nullable()
    .notRequired(),
});

type SchemaFields = keyof typeof schema.fields;

function FinancialForm({
  application,
  onUpdate,
  onNext,
  onBack,
  isLastStep,
}: FinancialFormProps) {
  const [toast, setToast] = useState<{
    kind: "error" | "info" | "success" | "warning";
    title: string;
  } | null>(null);

  const defaultFormValues = {
    employee_count: application.financials.employee_count ?? 0,
    revenue: application.financials.revenue ?? 0,
    current_assets: application.financials.current_assets ?? 0,
    current_liabilities: application.financials.current_liabilities ?? 0,
    total_assets: application.financials.total_assets ?? 0,
    total_liabilities: application.financials.total_liabilities ?? 0,
    net_income_loss: application.financials.net_income_loss ?? 0,
    coverage: application.coverage?.map((c: { type: string }) => c.type) || [],
    retained_earning: application.financials.retained_earning ?? null,
    end_ebit: application.financials.end_ebit ?? null,
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, touchedFields, isSubmitted, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!getValues("coverage")?.length) {
      setValue("coverage", [coverageOptions[0].value]);
    }
  }, [setValue, getValues]);

  const onSubmit = async (_data: any, event: any) => {
    const action = event?.nativeEvent?.submitter?.name;
    const values = getValues();

    const updatedFinancials = {
      ...application.financials,
      employee_count: values.employee_count ?? undefined,
      revenue: values.revenue ?? undefined,
      current_assets: values.current_assets ?? undefined,
      current_liabilities: values.current_liabilities ?? undefined,
      total_assets: values.total_assets ?? undefined,
      total_liabilities: values.total_liabilities ?? undefined,
      net_income_loss: values.net_income_loss ?? undefined,
      retained_earning: values.retained_earning ?? null,
      end_ebit: values.end_ebit ?? null,
    };

    const updatedCoverage = coverageOptions
      .filter((option) => values.coverage?.includes(option.value))
      .map((item) => ({
        type: item.value as CoverageType,
        limit: 50000,
        retention: 0,
        claims: { count: 0, payout: 0, remarks: "string" },
      }));

    const applicationToProcess = generateUpdatedApplication(
      {
        ...application,
        financials: updatedFinancials,
        coverage: updatedCoverage,
      },
      true
    );

    try {
      if (action === "submit") {
        const response = await createSubmission(applicationToProcess);
        sessionStorage.setItem(
          "submissionData",
          JSON.stringify({
            ...response,
            financials: updatedFinancials,
            coverage: updatedCoverage,
            assessment: response.assessment || ApplicationStatus.CREATED,
            explanation: response.explanation || "",
          })
        );
        onUpdate({
          ...applicationToProcess,
          submission_reference: {
            ...applicationToProcess.submission_reference,
            assessment: response.assessment || ApplicationStatus.CREATED,
            explanation: response.explanation || "",
          },
        });
        setToast({
          kind: "success",
          title: "Risk data submitted",
        });
        onNext();
      } else {
        onUpdate(applicationToProcess);
        setToast({
          kind: "success",
          title: "Changes saved",
        });
      }
    } catch (error: any) {
      console.error("Failed to submit risk data:", {
        message: error.message,
        status: error.status,
        response: error.response,
      });
      setToast({
        kind: "error",
        title: error.message || "Submission failed",
      });
    }
  };

  const renderNumberInput = (
    name: Exclude<SchemaFields, "coverage">,
    label: string,
    placeholder = ""
  ) => (
    <Controller
      key={name}
      name={name}
      control={control}
      render={({ field }) => (
        <NumberInput
          id={`${name}-input`}
          label={label}
          placeholder={placeholder}
          invalid={isSubmitted || touchedFields[name] ? !!errors[name] : false}
          invalidText={errors[name]?.message as string}
          value={field.value ?? ""}
          onChange={(_e, { value }) => {
            const val = value === "" ? null : Number(value);
            field.onChange(val);
          }}
        />
      )}
    />
  );

  const handleCoverageChange = (value: string) => {
    const currentCoverage = getValues("coverage") || [];
    if (currentCoverage.includes(value)) {
      setValue(
        "coverage",
        currentCoverage.filter((v: string) => v !== value)
      );
    } else {
      setValue("coverage", [...currentCoverage, value]);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Financial information form"
    >
      <div className={styles.topSaveButton}>
        <Button
          kind="tertiary"
          name="save"
          type="submit"
          size="sm"
          disabled={!isDirty}
        >
          Save
        </Button>
      </div>

      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "employee_count",
            "Total Employee Count",
            "Enter the total employee count"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput("revenue", "Most Recent Year End Revenue")}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "current_assets",
            "Most Recent Year End Current Assets"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "current_liabilities",
            "Most Recent Year End Current Liabilities"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "total_assets",
            "Most Recent Year End Total Assets"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "total_liabilities",
            "Most Recent Year End Total Liabilities"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "net_income_loss",
            "Most Recent Year Net Income/Loss"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          <label className={styles.label}>Coverage Options</label>
          <Controller
            name="coverage"
            control={control}
            render={({ field }) => {
              const selectedValues = field.value || [];
              return (
                <div
                  className={styles.radioGroup}
                  role="group"
                  aria-label="Coverage options"
                >
                  {coverageOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`${styles.radioLabel} ${
                        selectedValues.includes(option.value)
                          ? ""
                          : styles.faded
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedValues.includes(option.value)}
                        onChange={() => handleCoverageChange(option.value)}
                        aria-checked={selectedValues.includes(option.value)}
                        aria-labelledby={`coverage-label-${option.value}`}
                      />
                      <span id={`coverage-label-${option.value}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              );
            }}
          />
          {errors.coverage && (isSubmitted || touchedFields.coverage) && (
            <p className={styles.error}>{errors.coverage.message as string}</p>
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput(
            "retained_earning",
            "Most Recent Year End Retained Earnings"
          )}
        </Column>
        <Column sm={4} md={8} lg={6} className={styles.formColumn}>
          {renderNumberInput("end_ebit", "Most Recent Year End EBIT")}
        </Column>
      </Grid>

      <div className={styles.formFooter}>
        <Button kind="secondary" renderIcon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <Button
          kind="primary"
          name="submit"
          type="submit"
          disabled={isLastStep}
        >
          Submit
        </Button>
      </div>

      {toast && (
        <Toast
          kind={toast.kind}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}

export default FinancialForm;
