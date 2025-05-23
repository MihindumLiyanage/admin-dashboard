"use client";

import React, { useState } from "react";
import { Button, Tile, Modal, TextInput } from "@carbon/react";

import { ApplicationStatus } from "@/types/status";
import classes from "@/styles/pages/submissions.module.scss";

function DecisionForm({ riskResponse, application }) {
  const [open, setOpen] = useState(false);

  const getCoverageLabels = (coverageValues) => {
    const coverageMap = {
      "D&O": "D&O",
      EPL: "EPL",
      FID: "FID",
    };

    return coverageValues.map((value) => coverageMap[value]).join(" / ");
  };

  return (
    <div>
      <div className={classes.RevnavigationBtns}>
        <Button>Accept</Button>

        <Button onClick={() => setOpen(true)}>Reject</Button>
      </div>

      {open && (
        <Modal
          open={open}
          onRequestClose={() => setOpen(false)}
          modalHeading="Reason for Decline"
          primaryButtonText="Complete"
          secondaryButtonText="Cancel"
          style={{ marginBottom: "1rem" }}
          onRequestSubmit={() => {
            setOpen(false);
          }}
        >
          Please give the reason for decline.
          <TextInput
            id="user-decline-reason"
            type="text"
            labelText="Reason for Decline"
          />
        </Modal>
      )}

      <div>
        <Tile id="tile-1" className={classes.tile}>
          <div className={classes.tileGrid4}>
            <div className={classes.column}>
              <h3>Applicant</h3>

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
            </div>

            <div className={classes.column}>
              <h3>Financial</h3>

              <p>
                <strong>Revenue:</strong> {application.financials.revenue}
              </p>

              <p>
                <strong>Employee Count:</strong>{" "}
                {application.financials.employee_count}
              </p>
            </div>

            <div className={classes.column}>
              <h3>Decision</h3>

              <p>
                <strong>Status:</strong> {riskResponse?.assessment}
              </p>

              {riskResponse?.assessment === ApplicationStatus.REJECTED && (
                <p>
                  <strong>Decline Reason:</strong> {riskResponse?.explanation}
                </p>
              )}
            </div>

            <div className={classes.column}>
              <h3>Premium</h3>

              <p>\\$500</p>
            </div>
          </div>
        </Tile>
      </div>

      <div className={classes.RevnavigationBtns}>
        <Button
          disabled={riskResponse?.assessment !== ApplicationStatus.REJECTED}
        >
          Edit
        </Button>
      </div>

      <div>
        <Tile id="tile-2" className={classes.tile}>
          <h2>Underwriting Information:</h2>

          <br />

          <div className={classes.tileGrid3}>
            <div className={classes.column}>
              <h3>Broker Details</h3>

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
            </div>

            <div className={classes.column}>
              <h3>Applicant Details</h3>

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
            </div>

            <div className={classes.column}>
              <h3>Financial Details</h3>

              <p>
                <strong>Total Employee Count:</strong>{" "}
                {application.financials.employee_count}
              </p>

              <p>
                <strong>Most Recent Year End Revenue:</strong>{" "}
                {application.financials.revenue}
              </p>

              <p>
                <strong>Most Recent Year End Current Assets:</strong>{" "}
                {application.financials.current_assets}
              </p>

              <p>
                <strong>Most Recent Year End Current Liabilities:</strong>{" "}
                {application.financials.current_liabilities}
              </p>

              <p>
                <strong>Most Recent Year End Total Assets:</strong>{" "}
                {application.financials.total_assets}
              </p>

              <p>
                <strong>Most Recent Year End Total Liabilities:</strong>{" "}
                {application.financials.total_liabilities}
              </p>

              <p>
                <strong>Most Recent Year Net Income/Loss:</strong>{" "}
                {application.financials.net_income_loss}
              </p>

              <p>
                <strong>Coverage:</strong>{" "}
                {getCoverageLabels(
                  application.coverage.map((coverage) => coverage.type)
                )}
              </p>

              <p>
                <strong>Most Recent Year End Retained Earnings:</strong>{" "}
                {application.financials.retained_earning || "None"}
              </p>

              <p>
                <strong>Most Recent Year End EBIT:</strong>{" "}
                {application.financials.end_ebit || "None"}
              </p>
            </div>

            <div className={classes.navigationBtns}>
              <Button disabled>Print PDF</Button>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
}

export default DecisionForm;
