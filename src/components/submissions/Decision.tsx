"use client";

import React, { useEffect, useState } from "react";
import { Button, Grid, Column, TextArea, InlineLoading } from "@carbon/react";
import GenericModal from "@/components/common/Modal";
import { ApplicationStatus } from "@/constants/status";
import { ArrowLeft } from "@carbon/icons-react";
import styles from "@/styles/pages/submissions.module.scss";
import { Application, Coverage } from "@/types/application";
import { coverageOptions } from "@/constants/coverageOptions";
import {
  fetchSubmissionById,
  submitSubmissionReview,
} from "@/services/submissionService";
import Toast from "@/components/common/Toast";

interface DecisionProps {
  application: Application;
  onUpdate: (application: Application) => void;
  onBack: () => void;
}

function Decision({ application, onUpdate, onBack }: DecisionProps) {
  const [toast, setToast] = useState<{
    kind: "error" | "info" | "success" | "warning";
    title: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!application.submission_reference.id) return;

      setLoading(true);
      try {
        const data = await fetchSubmissionById(
          application.submission_reference.id,
          application.carrier,
          application.submission_reference.version
        );

        const updated = {
          ...application,
          issue_date: data.issue_date || "",
        };
        onUpdate(updated);
        sessionStorage.setItem("submissionData", JSON.stringify(updated));
      } catch (error) {
        console.error("Error fetching submission:", error);
        setToast({
          kind: "error",
          title: "Failed to load submission status",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    application.submission_reference.id,
    application.carrier,
    application.submission_reference.version,
    onUpdate,
  ]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const reviewPayload = {
        submission_reference: application.submission_reference,
        assessment: ApplicationStatus.ACCEPTED,
        explanation: "",
        issue_date: new Date().toISOString(),
      };

      await submitSubmissionReview(
        application.submission_reference.id,
        reviewPayload
      );

      const updatedData = await fetchSubmissionById(
        application.submission_reference.id,
        application.carrier,
        application.submission_reference.version
      );

      const updatedApplication = {
        ...application,
        assessment: updatedData.assessment || ApplicationStatus.ACCEPTED,
        explanation: "",
        issue_date: updatedData.issue_date || reviewPayload.issue_date,
      };

      onUpdate(updatedApplication);
      sessionStorage.setItem(
        "submissionData",
        JSON.stringify(updatedApplication)
      );

      setToast({
        kind: "success",
        title: "Submission approved successfully",
      });
    } catch (error) {
      console.error("Error approving submission:", error);
      setToast({
        kind: "error",
        title: "Failed to approve submission",
      });
      setIsSubmitting(false);
      return;
    }
  };

  const handleConfirmReject = async () => {
    setIsSubmitting(true);
    try {
      const reviewPayload = {
        submission_reference: application.submission_reference,
        assessment: ApplicationStatus.REJECTED,
        explanation: declineReason.trim() || "No reason provided.",
        issue_date: new Date().toISOString(),
      };

      await submitSubmissionReview(
        application.submission_reference.id,
        reviewPayload
      );

      const updatedData = await fetchSubmissionById(
        application.submission_reference.id,
        application.carrier,
        application.submission_reference.version
      );

      const updatedApplication = {
        ...application,
        assessment: updatedData.assessment || ApplicationStatus.DECLINED,
        explanation: updatedData.explanation || reviewPayload.explanation,
        issue_date: updatedData.issue_date || reviewPayload.issue_date,
      };

      onUpdate(updatedApplication);
      sessionStorage.setItem(
        "submissionData",
        JSON.stringify(updatedApplication)
      );

      setToast({
        kind: "success",
        title: "Submission declined successfully",
      });

      setIsModalOpen(false);
      setDeclineReason("");
    } catch (error) {
      console.error("Error declining submission:", error);
      setToast({
        kind: "error",
        title: "Failed to decline submission",
      });
      setIsSubmitting(false);
      return;
    }
  };

  const getCoverageLabels = (coverages: Coverage[]) => {
    return coverages
      .map(
        (coverage) =>
          coverageOptions.find(
            (opt: { value: string }) => opt.value === coverage.type
          )?.label
      )
      .filter(Boolean)
      .join(" / ");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <InlineLoading description="Loading submission data..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          kind={toast.kind}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reject Submission"
        primaryButtonText="Confirm Reject"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleConfirmReject}
        primaryButtonDisabled={!declineReason.trim()}
        size="sm"
      >
        <p>Please provide a reason for declining this submission:</p>
        <TextArea
          labelText="Decline Reason"
          placeholder="Enter reason..."
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          rows={4}
        />
      </GenericModal>

      <div className={styles.actionButtons}>
        <Button
          kind="primary"
          onClick={handleAccept}
          size="lg"
          disabled={isSubmitting}
        >
          Accept
        </Button>
        <Button
          kind="danger"
          onClick={() => setIsModalOpen(true)}
          size="lg"
          disabled={isSubmitting}
        >
          Reject
        </Button>
      </div>

      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={12}>
          <Grid className={styles.grid}>
            <Column sm={4} md={4} lg={3}>
              <h4 className={styles.subSectionTitle}>Applicant</h4>
              <p>
                <strong>Name:</strong> {application.insured.name}
              </p>
              <p>
                <strong>Address:</strong> {application.insured.address}
              </p>
              <p>
                <strong>City:</strong> {application.insured.city}
              </p>
              <p>
                <strong>State:</strong> {application.insured.state}
              </p>
              <p>
                <strong>Zipcode:</strong> {application.insured.zipcode}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3}>
              <h4 className={styles.subSectionTitle}>Financial</h4>
              <p>
                <strong>Revenue:</strong> {application.financials.revenue}
              </p>
              <p>
                <strong>Employee Count:</strong>{" "}
                {application.financials.employee_count}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3}>
              <h4 className={styles.subSectionTitle}>Decision</h4>
              <p>
                <strong>Status:</strong> {application.assessment}
              </p>
              {application.assessment === ApplicationStatus.DECLINED && (
                <p>
                  <strong>Decline Reason:</strong> {application.explanation}
                </p>
              )}
            </Column>
            <Column sm={4} md={4} lg={3}>
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
                <strong>Broker Name:</strong> {application.broker.name}
              </p>
              <p>
                <strong>Organization:</strong> {application.broker.organization}
              </p>
              <p>
                <strong>Address:</strong> {application.broker.address}
              </p>
              <p>
                <strong>City:</strong> {application.broker.city}
              </p>
              <p>
                <strong>State:</strong> {application.broker.state}
              </p>
              <p>
                <strong>ZipCode:</strong> {application.broker.zipcode}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Insured Details</h4>
              <p>
                <strong>Name:</strong> {application.insured.name}
              </p>
              <p>
                <strong>Address:</strong> {application.insured.address}
              </p>
              <p>
                <strong>City:</strong> {application.insured.city}
              </p>
              <p>
                <strong>State:</strong> {application.insured.state}
              </p>
              <p>
                <strong>ZipCode:</strong> {application.insured.zipcode}
              </p>
              <p>
                <strong>NAICS:</strong> {application.insured.naics.join(", ")}
              </p>
            </Column>
            <Column sm={4} md={4} lg={4}>
              <h4 className={styles.subSectionTitle}>Financial Details</h4>
              <p>
                <strong>Total Employee Count:</strong>{" "}
                {application.financials.employee_count}
              </p>
              <p>
                <strong>Revenue:</strong> {application.financials.revenue}
              </p>
              <p>
                <strong>Current Assets:</strong>{" "}
                {application.financials.current_assets}
              </p>
              <p>
                <strong>Current Liabilities:</strong>{" "}
                {application.financials.current_liabilities}
              </p>
              <p>
                <strong>Total Assets:</strong>{" "}
                {application.financials.total_assets}
              </p>
              <p>
                <strong>Total Liabilities:</strong>{" "}
                {application.financials.total_liabilities}
              </p>
              <p>
                <strong>Net Income/Loss:</strong>{" "}
                {application.financials.net_income_loss}
              </p>
              <p>
                <strong>Coverage:</strong>{" "}
                {application.coverage &&
                  getCoverageLabels(application.coverage)}
              </p>
              <p>
                <strong>Retained Earnings:</strong>{" "}
                {application.financials.retained_earning || "None"}
              </p>
              <p>
                <strong>EBIT:</strong>{" "}
                {application.financials.end_ebit || "None"}
              </p>
            </Column>
            <Column sm={4} md={4} lg={3} className={styles.printColumn}>
              <Button kind="tertiary" size="md">
                Print PDF
              </Button>
            </Column>
          </Grid>
        </Column>
      </Grid>

      <div className={styles.formFooter}>
        <Button kind="secondary" renderIcon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

export default Decision;
