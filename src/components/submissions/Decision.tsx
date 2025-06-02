"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Grid, Column } from "@carbon/react";
import { ApplicationStatus } from "@/constants/status";
import styles from "@/styles/pages/submissions.module.scss";
import { Application } from "@/types/application";
import { coverageOptions } from "@/constants/coverageOptions";
import { submitSubmissionReview } from "@/services/submissionService";

interface DecisionProps {
  application: Application;
  onUpdate: (application: Application) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface RiskResponse {
  assessment: ApplicationStatus | null;
  explanation: string;
}

function Decision({
  application,
  onUpdate,
  onNext,
  onBack,
  isLastStep,
}: DecisionProps) {
  const [open, setOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [riskResponse, setRiskResponse] = useState<RiskResponse>({
    assessment: application.submission_reference.assessment || null,
    explanation: application.submission_reference.explanation || "",
  });

  useEffect(() => {
    setRiskResponse({
      assessment: application.submission_reference.assessment || null,
      explanation: application.submission_reference.explanation || "",
    });
  }, [application]);

  const handleAccept = async () => {
    try {
      const response = await submitSubmissionReview(
        application.submission_reference.id,
        {
          submission_reference: {
            id: application.submission_reference.id,
            version: application.submission_reference.version,
          },
          assessment: ApplicationStatus.ACCEPTED,
          explanation: "",
          issue_date: new Date().toISOString(),
        }
      );

      setRiskResponse({
        assessment: ApplicationStatus.ACCEPTED,
        explanation: "",
      });

      onUpdate({
        ...application,
        submission_reference: {
          ...application.submission_reference,
          assessment: ApplicationStatus.ACCEPTED,
          explanation: "",
        },
      });

      sessionStorage.removeItem("submissionData");
      if (isLastStep) {
        onNext();
      }
    } catch (error: any) {
      console.error("Error submitting user review:", error);
    }
  };

  const handleReject = () => {
    setOpen(true);
  };

  const handleDeclineReasonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeclineReason(event.target.value);
  };

  const handleCompleteRejection = async () => {
    try {
      const response = await submitSubmissionReview(
        application.submission_reference.id,
        {
          submission_reference: {
            id: application.submission_reference.id,
            version: application.submission_reference.version,
          },
          assessment: ApplicationStatus.REJECTED,
          explanation: declineReason,
          issue_date: new Date().toISOString(),
        }
      );

      setRiskResponse({
        assessment: ApplicationStatus.REJECTED,
        explanation: declineReason,
      });

      onUpdate({
        ...application,
        submission_reference: {
          ...application.submission_reference,
          assessment: ApplicationStatus.REJECTED,
          explanation: declineReason,
        },
      });

      sessionStorage.removeItem("submissionData");
      setOpen(false);
      if (isLastStep) {
        onNext();
      }
    } catch (error: any) {
      console.error("Error submitting user review:", error);
    }
  };

  const getCoverageLabels = (coverageValues: string[]) => {
    return coverageValues
      .map(
        (value) =>
          coverageOptions.find((opt: { value: string }) => opt.value === value)
            ?.label
      )
      .filter(Boolean)
      .join(" / ");
  };

  const coverageArray = application.coverage as Array<{ type: string }>;

  return (
    <div className={styles.container}>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        modalHeading="Reason for Decline"
        primaryButtonText="Complete"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleCompleteRejection}
        size="sm"
        danger
      >
        <p>Please provide a reason for declining this application:</p>
        <TextInput
          id="user-decline-reason"
          labelText="Decline Reason"
          placeholder="Enter reason..."
          value={declineReason}
          onChange={handleDeclineReasonChange}
          required
        />
      </Modal>

      <div className={styles.actionButtons}>
        <Button kind="primary" onClick={handleAccept} size="lg">
          Accept
        </Button>
        <Button kind="danger" onClick={handleReject} size="lg">
          Reject
        </Button>
        <Button
          disabled={riskResponse?.assessment !== ApplicationStatus.REJECTED}
          onClick={() => onBack()}
          kind="tertiary"
          size="lg"
        >
          Edit
        </Button>
      </div>

      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={12}>
          <Grid className={styles.grid}>
            <Column sm={4} md={4} lg={3}>
              <h4 className={styles.subSectionTitle}>Applicant</h4>
              <p>
                <strong>Name:</strong> {application.insured?.name || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {application.insured?.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {application.insured?.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {application.insured?.state || "N/A"}
              </p>
              <p>
                <strong>Zipcode:</strong>{" "}
                {application.insured?.zipcode || "N/A"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Financial</h4>
              <p>
                <strong>Revenue:</strong>{" "}
                {application.financials?.revenue || "N/A"}
              </p>
              <p>
                <strong>Employee Count:</strong>{" "}
                {application.financials?.employee_count || "N/A"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3}>
              <h4 className={styles.subSectionTitle}>Decision</h4>
              <p>
                <strong>Status:</strong> {riskResponse?.assessment || "Pending"}
              </p>
              {riskResponse.assessment === ApplicationStatus.REJECTED && (
                <p>
                  <strong>Decline Reason:</strong>{" "}
                  {riskResponse?.explanation || "N/A"}
                </p>
              )}
            </Column>
            <Column sm={4} md={4} lg={2}>
              <h4 className={styles.subSectionTitle}>Premium</h4>
              <p className={styles.premiumAmount}>$500</p>
            </Column>
          </Grid>
        </Column>
      </Grid>

      <h2 className={styles.sectionHeading}>Underwriting Information</h2>
      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={12}>
          <Grid className={styles.grid}>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Broker Details</h4>
              <p>
                <strong>Broker Name:</strong>{" "}
                {application.broker?.name || "N/A"}
              </p>
              <p>
                <strong>Organization:</strong>{" "}
                {application.broker?.organization || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {application.broker?.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {application.broker?.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {application.broker?.state || "N/A"}
              </p>
              <p>
                <strong>ZipCode:</strong> {application.broker?.zipcode || "N/A"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Insured Details</h4>
              <p>
                <strong>Name:</strong> {application.insured?.name || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {application.insured?.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {application.insured?.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {application.insured?.state || "N/A"}
              </p>
              <p>
                <strong>ZipCode:</strong>{" "}
                {application.insured?.zipcode || "N/A"}
              </p>
              <p>
                <strong>NAICS:</strong>{" "}
                {application.insured?.naics?.join(", ") || "N/A"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Financial Details</h4>
              <p>
                <strong>Total Employee Count:</strong>
                {application.financials?.employee_count || "N/A"}
              </p>
              <p>
                <strong>Revenue:</strong>{" "}
                {application.financials?.revenue || "N/A"}
              </p>
              <p>
                <strong>Current Assets:</strong>{" "}
                {application.financials?.current_assets || "N/A"}
              </p>
              <p>
                <strong>Current Liabilities:</strong>{" "}
                {application.financials?.current_liabilities || "N/A"}
              </p>
              <p>
                <strong>Total Assets:</strong>{" "}
                {application.financials?.total_assets || "N/A"}
              </p>
              <p>
                <strong>Total Liabilities:</strong>{" "}
                {application.financials?.total_liabilities || "N/A"}
              </p>
              <p>
                <strong>Net Income/Loss:</strong>{" "}
                {application.financials?.net_income_loss || "N/A"}
              </p>
              <p>
                <strong>Coverage:</strong>{" "}
                {coverageArray &&
                  getCoverageLabels(coverageArray.map((c) => c.type) || [])}
              </p>
              <p>
                <strong>Retained Earnings:</strong>{" "}
                {application.financials?.retained_earning || "None"}
              </p>
              <p>
                <strong>EBIT:</strong>{" "}
                {application.financials?.end_ebit || "None"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3} className={styles.printColumn}>
              <Button disabled kind="tertiary" size="md">
                Print PDF
              </Button>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </div>
  );
}

export default Decision;
