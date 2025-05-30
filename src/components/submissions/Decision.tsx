"use client";

import React, { useState } from "react";
import { Button, Tile, Modal, TextInput, Grid, Column } from "@carbon/react";
import { ApplicationStatus } from "@/constants/status";
import styles from "@/styles/pages/submissions.module.scss";
import { Application } from "@/types/application";
import { coverageOptions } from "@/constants/coverageOptions";
import { submitSubmissionReview } from "@/services/submissionService";

interface DecisionProps {
  application: Application;
  onUpdate: (application: Application) => void;
}

interface RiskResponse {
  assessment: ApplicationStatus | null;
  explanation: string;
}

function Decision({ application, onUpdate }: DecisionProps) {
  const [open, setOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const [riskResponse, setRiskResponse] = useState<RiskResponse>({
    assessment: application?.submission_reference?.assessment || null,
    explanation: application?.submission_reference?.explanation || "",
  });

  const handleAccept = async () => {
    try {
      await submitSubmissionReview(application.submission_reference.id, {
        assessment: ApplicationStatus.ACCEPTED,
        explanation: "",
      });

      setRiskResponse({
        assessment: ApplicationStatus.ACCEPTED,
        explanation: "",
      });

      onUpdate({
        ...application,
        submission_reference: {
          ...application.submission_reference,
          assessment: ApplicationStatus.ACCEPTED,
        },
      });
    } catch (error) {
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
      await submitSubmissionReview(application.submission_reference.id, {
        assessment: ApplicationStatus.REJECTED,
        explanation: declineReason,
      });

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
      setOpen(false);
    } catch (error) {
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
    <>
      <div className={styles.actionButtons}>
        <Button kind="primary" onClick={handleAccept} size="lg">
          Accept
        </Button>
        <Button kind="danger" onClick={handleReject} size="lg">
          Reject
        </Button>
      </div>

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

        <Tile className={styles.tile}>
          <Grid className={styles.grid}>
            <Column sm={4} md={4} lg={3}>
              <h3 className={styles.sectionTitle}>Applicant</h3>
              <p>
                <strong>Name:</strong> {application.insured?.name}
              </p>
              <p>
                <strong>Address:</strong> {application.insured?.address}
              </p>
              <p>
                <strong>City:</strong> {application.insured?.city}
              </p>
              <p>
                <strong>State:</strong> {application.insured?.state}
              </p>
              <p>
                <strong>Zipcode:</strong> {application.insured?.zipcode}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h3 className={styles.sectionTitle}>Financial</h3>
              <p>
                <strong>Revenue:</strong> {application.financials?.revenue}
              </p>
              <p>
                <strong>Employee Count:</strong>{" "}
                {application.financials?.employee_count}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3}>
              <h3 className={styles.sectionTitle}>Decision</h3>
              <p>
                <strong>Status:</strong> {riskResponse?.assessment}
              </p>
              {riskResponse.assessment === ApplicationStatus.REJECTED && (
                <p>
                  <strong>Decline Reason:</strong> {riskResponse?.explanation}
                </p>
              )}
            </Column>
            <Column sm={4} md={4} lg={2}>
              <h3 className={styles.sectionTitle}>Premium</h3>
              <p className={styles.premiumAmount}>\\$500</p>
            </Column>
          </Grid>
        </Tile>

        <h2 className={styles.sectionHeading}>Underwriting Information</h2>
        <Tile className={styles.tile}>
          <Grid className={styles.grid}>
            <Column sm={4} md={4} lg={4}>
              <h3 className={styles.sectionTitle}>Broker Details</h3>
              <p>
                <strong>Broker Name:</strong> {application.broker?.name}
              </p>
              <p>
                <strong>Organization:</strong>{" "}
                {application.broker?.organization}
              </p>
              <p>
                <strong>Address:</strong> {application.broker?.address}
              </p>
              <p>
                <strong>City:</strong> {application.broker?.city}
              </p>
              <p>
                <strong>State:</strong> {application.broker?.state}
              </p>
              <p>
                <strong>ZipCode:</strong> {application.broker?.zipcode}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h3 className={styles.sectionTitle}>Insured Details</h3>
              <p>
                <strong>Name:</strong> {application.insured?.name}
              </p>
              <p>
                <strong>Address:</strong> {application.insured?.address}
              </p>
              <p>
                <strong>City:</strong> {application.insured?.city}
              </p>
              <p>
                <strong>State:</strong> {application.insured?.state}
              </p>
              <p>
                <strong>ZipCode:</strong> {application.insured?.zipcode}
              </p>
              <p>
                <strong>NAICS:</strong> {application.insured?.naics}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h3 className={styles.sectionTitle}>Financial Details</h3>
              <p>
                <strong>Total Employee Count:</strong>
                {application.financials?.employee_count}
              </p>
              <p>
                <strong>Revenue:</strong> {application.financials?.revenue}
              </p>
              <p>
                <strong>Current Assets:</strong>{" "}
                {application.financials?.current_assets}
              </p>
              <p>
                <strong>Current Liabilities:</strong>{" "}
                {application.financials?.current_liabilities}
              </p>
              <p>
                <strong>Total Assets:</strong>{" "}
                {application.financials?.total_assets}
              </p>
              <p>
                <strong>Total Liabilities:</strong>{" "}
                {application.financials?.total_liabilities}
              </p>
              <p>
                <strong>Net Income/Loss:</strong>{" "}
                {application.financials?.net_income_loss}
              </p>
              <p>
                <strong>Coverage:</strong>{" "}
                {coverageArray &&
                  getCoverageLabels(coverageArray.map((c) => c.type) || [])}
              </p>
              <p>
                <strong> Retained Earnings:</strong>{" "}
                {application.financials?.retained_earning || "None"}
              </p>
              <p>
                <strong> EBIT:</strong>{" "}
                {application.financials?.end_ebit || "None"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3} className={styles.printColumn}>
              <Button disabled kind="tertiary" size="md">
                Print PDF
              </Button>
            </Column>
          </Grid>
        </Tile>
      </div>
    </>
  );
}

export default Decision;
