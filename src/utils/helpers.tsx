// Generate UUID
export const generateUniqueId = () =>
  `LYD${Math.floor(Math.random() * 900000) + 100000}${Date.now()}`;

export const generateUpdatedApplication = (application: any) => {
  console.log("submission_reference", application.submission_reference);
  // Check if submission_reference exists and has valid id and version
  if (
    application.submission_reference &&
    application.submission_reference.id &&
    application.submission_reference.version
  ) {
    // Increment the version by 1 (e.g., 1.0 to 2.0)
    const currentVersion = parseFloat(application.submission_reference.version);
    const updatedVersion = (currentVersion + 1).toFixed(1);
    return {
      ...application,
      submission_reference: {
        id: application.submission_reference.id, // Keep the same ID
        version: updatedVersion, // Update the version
      },
    };
  } else {
    // If submission_reference is missing or invalid, generate a new one
    return {
      ...application,
      submission_reference: {
        id: generateUniqueId(),
        version: "1.0",
      },
    };
  }
};

// Function to submit risk data
export const submitRiskData = async (
  application: object,
  mode: string = "assessment"
) => {
  try {
    const response = await fetch("/api/submissions/post/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ application, mode }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Risk data submitted successfully", data);
      return data;
    } else {
      console.error("Failed to submit risk data:", response.status);
    }
  } catch (error) {
    console.error("Error submitting risk data:", error);
  }
};
// User Review Update
export const submitUserReview = async (
  submission_id: string,
  quote_update: object
) => {
  try {
    const response = await fetch(
      `/api/submissions/put?submission_id=${submission_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ quote_update }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("Risk data submitted successfully", data);
      return data;
    } else {
      console.error("Failed to submit risk data:", response.status);
    }
  } catch (error) {
    console.error("Error submitting risk data:", error);
  }
};
