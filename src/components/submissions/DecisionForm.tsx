"use client";

import React, { useState, useEffect } from "react";
import { Button, Tile, Modal, TextInput, Grid, Column } from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/icons-react";

import { ApplicationStatus } from "@/types/status";
import classes from "@/styles/pages/submissions.module.scss";

interface DecisionFormProps {
  application: any;
  onUpdate: (application: any) => void;
  onNext: () => void;
  onBack: () => void;
}

function DecisionForm({
  application,
  onBack,
  onNext,
  onUpdate,
}: DecisionFormProps) {
  const [open, setOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [riskResponse, setRiskResponse] = useState<{
    assessment: ApplicationStatus | null;
    explanation: string;
  }>({
    assessment: null,
    explanation: "",
  });

  useEffect(() => {
    if (application.decision) {
      setRiskResponse({
        assessment: application.decision.assessment || null,
        explanation: application.decision.explanation || "",
      });
    }
  }, [application.decision]);

  const handleAccept = () => {
    const updatedDecision = {
      ...riskResponse,
      assessment: ApplicationStatus.ACCEPTED,
    };
    setRiskResponse(updatedDecision);
    onUpdate({
      ...application,
      decision: updatedDecision,
    });
  };

  const handleReject = () => {
    setOpen(true);
  };

  const handleDeclineReasonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeclineReason(event.target.value);
  };

  const handleCompleteRejection = () => {
    const updatedDecision = {
      assessment: ApplicationStatus.REJECTED,
      explanation: declineReason,
    };
    setRiskResponse(updatedDecision);
    onUpdate({
      ...application,
      decision: updatedDecision,
    });
    setOpen(false);
  };

  const getCoverageLabels = (coverageValues: string[]) => {
    const coverageMap: { [key: string]: string } = {
      "D&O": "D&O",
      EPL: "EPL",
      FID: "FID",
    };
    return coverageValues.map((value) => coverageMap[value]).join(" / ");
  };

  return (
    <div className={classes.container}>
      <div className={classes.actionButtons}>
        <Button
          kind="primary"
          onClick={handleAccept}
          size="lg"
          style={{ marginRight: "1rem" }}
        >
          Accept
        </Button>
        <Button
          kind="danger--tertiary"
          onClick={handleReject}
          size="lg"
          style={{ borderColor: "#da1e28", color: "#da1e28" }}
        >
          Reject
        </Button>
      </div>

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

      <Tile
        className={classes.tile}
        aria-label="Applicant, Financial, Decision and Premium Information"
      >
        <Grid>
          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.sectionTitle}>Applicant</h3>
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

          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.sectionTitle}>Financial</h3>
            <p>
              <strong>Revenue:</strong> {application.financials?.revenue}
            </p>
            <p>
              <strong>Employee Count:</strong>{" "}
              {application.financials?.employee_count}
            </p>
          </Column>

          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.sectionTitle}>Decision</h3>
            <p>
              <strong>Status:</strong> {riskResponse?.assessment}
            </p>
            {riskResponse?.assessment === ApplicationStatus.REJECTED && (
              <p>
                <strong>Decline Reason:</strong> {riskResponse?.explanation}
              </p>
            )}
          </Column>

          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.sectionTitle}>Premium</h3>
            <p className={classes.premiumAmount}>$500</p>
          </Column>
        </Grid>
      </Tile>

      <div className={classes.navigationButtons}>
        <Button
          kind="secondary"
          disabled={riskResponse?.assessment !== ApplicationStatus.REJECTED}
          onClick={onBack}
          renderIcon={ArrowLeft}
        >
          Back
        </Button>

        <Button
          kind="primary"
          disabled={riskResponse?.assessment !== ApplicationStatus.REJECTED}
          onClick={onNext}
          renderIcon={ArrowRight}
        >
          Submit
        </Button>
      </div>

      <Tile className={classes.tile} aria-label="Underwriting Information">
        <h2 className={classes.sectionHeading}>Underwriting Information</h2>
        <Grid>
          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.subSectionTitle}>Broker Details</h3>
            <p>
              <strong>Broker Name:</strong> {application.broker?.name}
            </p>
            <p>
              <strong>Organization:</strong> {application.broker?.organization}
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

          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.subSectionTitle}>Applicant Details</h3>
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

          <Column sm={4} md={4} lg={3}>
            <h3 className={classes.subSectionTitle}>Financial Details</h3>
            <p>
              <strong>Total Employee Count:</strong>{" "}
              {application.financials?.employee_count}
            </p>
            <p>
              <strong>Most Recent Year End Revenue:</strong>{" "}
              {application.financials?.revenue}
            </p>
            <p>
              <strong>Most Recent Year End Current Assets:</strong>{" "}
              {application.financials?.current_assets}
            </p>
            <p>
              <strong>Most Recent Year End Current Liabilities:</strong>{" "}
              {application.financials?.current_liabilities}
            </p>
            <p>
              <strong>Most Recent Year End Total Assets:</strong>{" "}
              {application.financials?.total_assets}
            </p>
            <p>
              <strong>Most Recent Year End Total Liabilities:</strong>{" "}
              {application.financials?.total_liabilities}
            </p>
            <p>
              <strong>Most Recent Year Net Income/Loss:</strong>{" "}
              {application.financials?.net_income_loss}
            </p>
            <p>
              <strong>Coverage:</strong>{" "}
              {getCoverageLabels(
                application.coverage?.map((c: { type: any }) => c.type) || []
              )}
            </p>
            <p>
              <strong>Most Recent Year End Retained Earnings:</strong>{" "}
              {application.financials?.retained_earnings || "None"}
            </p>
            <p>
              <strong>Most Recent Year End EBIT:</strong>{" "}
              {application.financials?.end_ebit || "None"}
            </p>
          </Column>

          <Column sm={4} md={4} lg={3} className={classes.printColumn}>
            <Button disabled kind="tertiary" size="md">
              Print PDF
            </Button>
          </Column>
        </Grid>
      </Tile>
    </div>
  );
}

export default DecisionForm;
