"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Column,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextArea,
} from "@carbon/react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSubmissionById(
          application.submission_reference.id,
          application.carrier,
          application.submission_reference.version
        );

        const updated = {
          ...application,
          assessment: data.assessment || undefined,
          explanation: data.explanation || "",
        };
        onUpdate(updated);
        sessionStorage.setItem("submissionData", JSON.stringify(updated));
      } catch (error) {
        console.error("Error fetching submission:", error);
        setToast({
          kind: "error",
          title: "Failed to load submission status",
        });
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
    try {
      const reviewPayload = {
        submission_reference: application.submission_reference,
        assessment: ApplicationStatus.ACCEPTED,
        explanation: "Application accepted based on review.",
        issue_date: new Date().toISOString(),
      };

      const response = await submitSubmissionReview(
        application.submission_reference.id,
        reviewPayload
      );

      const updatedApplication = {
        ...application,
        assessment: response.assessment,
        explanation: response.explanation,
        issue_date: response.issue_date,
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
    }
  };

  const handleConfirmReject = async () => {
    try {
      const reviewPayload = {
        submission_reference: application.submission_reference,
        assessment: ApplicationStatus.DECLINED,
        explanation: declineReason.trim() || "No reason provided.",
        issue_date: new Date().toISOString(),
      };

      const response = await submitSubmissionReview(
        application.submission_reference.id,
        reviewPayload
      );

      const updatedApplication = {
        ...application,
        assessment: response.assessment,
        explanation: response.explanation,
        issue_date: response.issue_date,
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

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          kind={toast.kind}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}

      <ComposedModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="sm"
      >
        <ModalHeader title="Reject Submission" />
        <ModalBody>
          <p>Please provide a reason for declining this submission:</p>
          <TextArea
            labelText="Decline Reason"
            placeholder="Enter reason..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            rows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            kind="danger"
            onClick={handleConfirmReject}
            disabled={!declineReason.trim()}
          >
            Confirm Reject
          </Button>
        </ModalFooter>
      </ComposedModal>

      <div className={styles.actionButtons}>
        <Button
          kind="primary"
          onClick={handleAccept}
          size="lg"
          disabled={application.assessment === ApplicationStatus.ACCEPTED}
        >
          Accept
        </Button>
        <Button
          kind="danger"
          onClick={() => setIsModalOpen(true)}
          size="lg"
          disabled={application.assessment === ApplicationStatus.REJECTED}
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
            <Column sm={4} md={4} lg={4}>
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
              {(application.assessment === ApplicationStatus.REJECTED ||
                application.assessment === ApplicationStatus.APPROVED) && (
                <p>
                  <strong>
                    {application.assessment === ApplicationStatus.REJECTED
                      ? "Decline"
                      : "Approval"}{" "}
                    Reason:
                  </strong>{" "}
                  {application.explanation || "No reason provided"}
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
                <strong>NAICS:</strong> {application.insured.naics}
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
