import { get, post, put } from "./httpService";
import { Application, Reference } from "@/types/application";
import { ApplicationStatus } from "@/constants/status";

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
): Promise<Application[]> => {
  const url = `/submissions/${version}?collection_name=${collection_name}&carrier=${carrier}`;
  const response = await get(url);
  return response.data; 
};

export const fetchSubmissionById = async (
  submission_id: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<Application> => {
  const url = `/submissions/${submission_id}/${version}?carrier=${carrier}`;
  const response = await get(url);
  return response.data; 
};

export const createSubmission = async (
  application: Application
): Promise<any> => {
  const url = `/submissions/assessment`;
  const response = await post(url, application);
  return response.data;
};

export const addSubmissions = async (
  application: Application
): Promise<any> => {
  const url = `/submissions`;
  const response = await post(url, application);
  return response.data;
};

export const submitSubmissionReview = async (
  submission_id: string,
  quote_update: SubmissionReviewResponse
): Promise<any> => {
  const url = `/submissions/${submission_id}/assessment`;
  const response = await put(url, quote_update);
  return response.data;
};
