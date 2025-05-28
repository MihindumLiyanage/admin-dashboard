"use client";

import { useState } from "react";
import {
  Grid,
  Tile,
  Column,
  ProgressIndicator,
  ProgressStep,
} from "@carbon/react";

import BrokerForm from "@/components/submissions/BrokerForm";
import InsuredForm from "@/components/submissions/InsuredForm";
import FinancialForm from "@/components/submissions/FinancialForm";
import Decision from "@/components/submissions/Decision";
import { DEFAULT_APPLICATION } from "@/data/defaultApplication";
import styles from "@/styles/pages/submissions.module.scss";

export default function Submissions() {
  const [step, setStep] = useState(0);
  const [application, setApplication] = useState(DEFAULT_APPLICATION);

  const sections = [
    { label: "Broker", Component: BrokerForm },
    { label: "Insured", Component: InsuredForm },
    { label: "Financial", Component: FinancialForm },
    { label: "Decision", Component: Decision },
  ];

  const onNext = () => {
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
                  current={i === step}
                  complete={i < step}
                />
              ))}
            </ProgressIndicator>
          </div>
          <div className={styles.pageTitle}>
            <h3>{sections[step]?.label} Page</h3>
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
