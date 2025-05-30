import { get, post } from "./httpService";
import { Application } from "@/types/application";

export const fetchSubmissionById = async <T = any>(
  submission_id: string,
  version: string = "latest"
): Promise<T> => {
  const url = `/submissions/${submission_id}/${version}`;
  return get<T>(url);
};

export const fetchSubmissionsByFilter = async <T = any>(
  collection_name: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<T> => {
  const url = `/submissions/${version}?collection_name=${collection_name}&carrier=${carrier}`;
  return get<T>(url);
};

export const createSubmission = async <T = any>(
  application: Application,
  mode: string = "assessment"
): Promise<T> => {
  const url = `/submissions/${mode === "assessment" ? "assessment" : ""}`;
  return post<T>(url, application);
};

export const submitSubmissionReview = async <T>(
  submission_id: string,
  quote_update: any
) => {
  const url = `/submissions/${submission_id}/assessment`;
  return post<T>(url, quote_update);
};
