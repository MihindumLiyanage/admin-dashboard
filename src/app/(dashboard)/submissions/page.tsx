"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Tile,
  Column,
  ProgressIndicator,
  ProgressStep,
  InlineLoading,
} from "@carbon/react";
import { useSearchParams } from "next/navigation";
import { Application, DEFAULT_APPLICATION } from "@/types/application";
import { fetchSubmissionById } from "@/services/submissionService";
import Decision from "@/components/submissions/Decision";
import BrokerForm from "@/components/submissions/BrokerForm";
import InsuredForm from "@/components/submissions/InsuredForm";
import FinancialForm from "@/components/submissions/FinancialForm";
import styles from "@/styles/pages/submissions.module.scss";

const sections = [
  { label: "Broker", Component: BrokerForm },
  { label: "Insured", Component: InsuredForm },
  { label: "Financial", Component: FinancialForm },
  { label: "Decision", Component: Decision },
];

export default function Submissions() {
  const [step, setStep] = useState(0);
  const [application, setApplication] =
    useState<Application>(DEFAULT_APPLICATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadSubmission = async () => {
      const submissionId = searchParams.get("submission_id");
      const stepParam = searchParams.get("step");

      if (stepParam === "financial") {
        setStep(2);
      }

      if (submissionId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchSubmissionById(submissionId);
          setApplication(data);
          sessionStorage.setItem("submissionData", JSON.stringify(data));
        } catch (e: any) {
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load submission data"
          );
          setApplication(DEFAULT_APPLICATION);
        } finally {
          setLoading(false);
        }
      } else {
        sessionStorage.removeItem("submissionData");
        sessionStorage.removeItem("APPLICATION_DATA"); // Add this line to clear APPLICATION_DATA
        const storedData = sessionStorage.getItem("APPLICATION_DATA");
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setApplication(parsedData);
          } catch (e) {
            console.error("Failed to parse sessionStorage data:", e);
          }
        }
      }
    };

    loadSubmission();
  }, [searchParams]);

  const onNext = () => {
    if (step < sections.length - 1) setStep(step + 1);
  };

  const onBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading) {
    return (
      <Grid fullWidth className={styles.container}>
        <Column lg={12} md={8} sm={4}>
          <div className={styles.loadingContainer}>
            <InlineLoading description="Loading submission data..." />
          </div>
        </Column>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid fullWidth className={styles.container}>
        <Column lg={12} md={8} sm={4}>
          <div className={styles.errorContainer}>
            <p className={styles.error} role="alert">
              Error: {error}
            </p>
          </div>
        </Column>
      </Grid>
    );
  }

  const { Component } = sections[step];

  return (
    <Grid fullWidth className={styles.container}>
      <Column lg={12} md={8} sm={4}>
        <div className={styles.header}>
          <div className={styles.progress}>
            <ProgressIndicator currentIndex={step}>
              {sections.map(({ label }, i) => (
                <ProgressStep
                  key={label}
                  label={label}
                  description={label}
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
  );
}
