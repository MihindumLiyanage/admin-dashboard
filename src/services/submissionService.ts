import { ApplicationStatus } from "@/constants/status";
import { get, post, put } from "./httpService";
import { Application, Reference } from "@/types/application";

export interface SubmissionReviewResponse {
  submission_reference: Reference;
  assessment: ApplicationStatus;
  explanation: string;
  issue_date: string;
}

export const fetchSubmissionsByFilter = async (
  collection_name: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<any> => {
  const url = `/submissions/${version}?collection_name=${collection_name}&carrier=${carrier}`;
  return get(url);
};

export const fetchSubmissionById = async (
  submission_id: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<any> => {
  const url = `/submissions/${submission_id}/${version}?carrier=${carrier}`;
  return get(url);
};

export const createSubmission = async (
  application: Application
): Promise<any> => {
  const url = `/submissions/assessment`;
  return post(url, application);
};

export const addSubmissions = async (
  application: Application
): Promise<any> => {
  const url = `/submissions`;
  return post(url, application);
};

export const submitSubmissionReview = async (
  submission_id: string,
  quote_update: SubmissionReviewResponse
): Promise<any> => {
  const url = `/submissions/${submission_id}/assessment`;
  return put(url, quote_update);
};
