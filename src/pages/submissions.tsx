"use client";

Submissions.title = "Submissions";
import { useState } from "react";
import {
  Grid,
  Button,
  ProgressIndicator,
  ProgressStep,
  Tile,
  Column,
} from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/icons-react";

import BrokerForm from "@/components/submissions/BrokerForm";
import InsuredForm from "@/components/submissions/InsuredForm";
import FinancialForm from "@/components/submissions/FinancialForm";
import DecisionForm from "@/components/submissions/DecisionForm";
import { DEFAULT_APPLICATION } from "@/data/defaultApplication";
import styles from "@/styles/pages/submissions.module.scss";

export default function Submissions() {
  const [step, setStep] = useState(0);
  const [application, setApplication] = useState(DEFAULT_APPLICATION);

  const sections = [
    { label: "Broker", Component: BrokerForm },
    { label: "Insured", Component: InsuredForm },
    { label: "Financial", Component: FinancialForm },
    { label: "Decision", Component: DecisionForm },
  ];

  const handleNext = () => {
    if (step < sections.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const renderForm = () => {
    const { Component } = sections[step] || {};
    return (
      <Tile className={styles.tile}>
        <Component
          application={application}
          onUpdate={setApplication}
          onNext={handleNext}
        />
        <div className={styles.formFooter}>
          {step > 0 && (
            <Button
              kind="secondary"
              renderIcon={ArrowLeft}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
          {step < sections.length - 1 && (
            <Button
              kind="primary"
              renderIcon={ArrowRight}
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </Tile>
    );
  };

  return (
    <Grid fullWidth className={styles.container}>
      <Column lg={12} md={8} sm={4}>
        <div className={styles.header}>
          <div className={styles.progress}>
            <ProgressIndicator currentIndex={step}>
              {sections.map((s, i) => (
                <ProgressStep
                  key={s.label}
                  label={s.label}
                  description={`${s.label} details`}
                  current={i === step}
                  complete={i < step}
                />
              ))}
            </ProgressIndicator>
          </div>
          <div className={styles.pageTitle}>
            <h3>{sections[step]?.label} Details</h3>
          </div>
        </div>
      </Column>

      <Column lg={12} md={8} sm={4}>
        {renderForm()}
      </Column>
    </Grid>
  );
}
