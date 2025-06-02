"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Tile,
  Column,
  ProgressIndicator,
  ProgressStep,
} from "@carbon/react";
import Toast from "@/components/common/Toast";
import {
  Application,
  Coverage,
  CoverageType,
  DEFAULT_APPLICATION,
} from "@/types/application";
import {
  fetchSubmissionById,
  SubmissionItem,
} from "@/services/submissionService";
import Decision from "@/components/submissions/Decision";
import BrokerForm from "@/components/submissions/BrokerForm";
import InsuredForm from "@/components/submissions/InsuredForm";
import FinancialForm from "@/components/submissions/FinancialForm";
import styles from "@/styles/pages/submissions.module.scss";
import { ApplicationStatus } from "@/constants/status";

export default function Submissions() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [application, setApplication] =
    useState<Application>(DEFAULT_APPLICATION);
  const [toast, setToast] = useState<{
    kind: "error" | "info" | "success" | "warning";
    title: string;
  } | null>(null);

  const sections = [
    { label: "Broker", Component: BrokerForm },
    { label: "Insured", Component: InsuredForm },
    { label: "Financial", Component: FinancialForm },
    { label: "Decision", Component: Decision },
  ];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const submissionId = query.get("submission_id");
    const stepParam = query.get("step");

    if (submissionId) {
      const loadSubmission = async () => {
        try {
          let data: SubmissionItem;
          const savedData = sessionStorage.getItem("submissionData");
          if (savedData) {
            data = JSON.parse(savedData) as SubmissionItem;
          } else {
            data = await fetchSubmissionById(submissionId);
            sessionStorage.setItem("submissionData", JSON.stringify(data));
          }

          const updatedApplication: Application = {
            ...DEFAULT_APPLICATION,
            submission_reference: {
              id: data.submission_reference.id,
              version: data.submission_reference.version,
              assessment: data.assessment as ApplicationStatus,
              explanation: data.explanation || "",
            },
            broker: {
              ...DEFAULT_APPLICATION.broker,
              name: data.broker?.name || "",
              organization: data.broker?.organization || "",
              address: data.broker?.address || "",
              city: data.broker?.city || "",
              state: data.broker?.state || "",
              zipcode: data.broker?.zipcode || "",
            },
            insured: {
              ...DEFAULT_APPLICATION.insured,
              name: data.insured.name || "",
              address: data.insured.address || "",
              city: data.insured.city || "",
              state: data.insured.state || "",
              zipcode: data.insured.zipcode || "",
              naics: data.insured.naics || [""],
            },
            financials: {
              ...DEFAULT_APPLICATION.financials,
              employee_count: data.financials?.employee_count ?? undefined,
              revenue: data.financials?.revenue ?? undefined,
              current_assets: data.financials?.current_assets ?? undefined,
              current_liabilities:
                data.financials?.current_liabilities ?? undefined,
              total_assets: data.financials?.total_assets ?? undefined,
              total_liabilities:
                data.financials?.total_liabilities ?? undefined,
              net_income_loss: data.financials?.net_income_loss ?? undefined,
              retained_earning: data.financials?.retained_earning ?? null,
              end_ebit: data.financials?.end_ebit ?? null,
            },
            coverage: data.coverage.map(
              (c): Coverage => ({
                type: c.type as CoverageType,
                limit: c.limit || 50000,
                retention: c.retention || 0,
                claims: c.claims || { count: 0, payout: 0, remarks: "" },
              })
            ),
            carrier: data.carrier || "Llyod",
          };

          setApplication(updatedApplication);

          if (stepParam === "financial") {
            setStep(2);
          } else {
            setStep(3);
          }
        } catch (error: any) {
          console.error("Failed to load submission data:", error);
          setToast({
            kind: "error",
            title: error.message || "Failed to load submission data",
          });
        }
      };

      loadSubmission();
    } else {
      setApplication(DEFAULT_APPLICATION);
      sessionStorage.removeItem("submissionData");
      setStep(0);
    }
  }, [router]);

  const onNext = async () => {
    if (step < sections.length - 1) {
      setStep(step + 1);
    }
  };

  const onBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const { Component } = sections[step];

  return (
    <>
      {toast && (
        <Toast
          kind={toast.kind}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}
      <Grid fullWidth className={styles.container}>
        <Column lg={12} md={8} sm={4}>
          <div className={styles.header}>
            <div className={styles.progress}>
              <ProgressIndicator currentIndex={step}>
                {sections.map((s, i) => (
                  <ProgressStep
                    key={s.label}
                    label={s.label}
                    description={s.label}
                    current={step === i}
                    complete={i < step}
                  />
                ))}
              </ProgressIndicator>
            </div>
            <div className={styles.pageTitle}>
              <h3>{sections[step].label} Page</h3>
            </div>
          </div>
        </Column>
        <Column lg={12} md={8} sm={4}>
          <Tile className={styles.tile}>
            <Component
              application={application}
              onUpdate={setApplication}
              onNext={onNext}
              onBack={onBack}
              isFirstStep={step === 0}
              isLastStep={step === sections.length - 1}
            />
          </Tile>
        </Column>
      </Grid>
    </>
  );
}
