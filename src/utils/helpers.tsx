export const generateUniqueId = () =>
  `LYD${Math.floor(Math.random() * 900000) + 100000}${Date.now()}`;

export const generateUpdatedApplication = (
  application: any,
  incrementVersion: boolean = false
) => {
  console.log("submission_reference", application.submission_reference);
  if (
    application.submission_reference &&
    application.submission_reference.id &&
    application.submission_reference.version
  ) {
    const currentVersion = parseFloat(application.submission_reference.version);
    const updatedVersion = incrementVersion
      ? (currentVersion + 1).toFixed(1)
      : application.submission_reference.version;
    return {
      ...application,
      submission_reference: {
        id: application.submission_reference.id,
        version: updatedVersion,
      },
    };
  } else {
    return {
      ...application,
      submission_reference: {
        id: generateUniqueId(),
        version: "1.0",
      },
    };
  }
};
