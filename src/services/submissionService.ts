import { get, post } from "./httpService";
import {
  Application,
  Broker,
  Insured,
  Finance,
  Claims,
  CoverageType,
} from "@/types/application";

export interface SubmissionItem {
  submission_reference: {
    id: string;
    version: string;
  };
  broker: Broker;
  insured: Insured;
  financials: Finance;
  coverage: {
    type: CoverageType;
    limit?: number;
    retention?: number;
    claims?: Claims;
  }[];
  assessment?: string;
  explanation?: string;
  carrier?: string;
  issue_date?: string;
}

export const fetchSubmissionById = async (
  submission_id: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<SubmissionItem> => {
  const url = `/submissions/${submission_id}/${version}?carrier=${carrier}`;
  return get<SubmissionItem>(url);
};

export const fetchSubmissionsByFilter = async (
  collection_name: string,
  carrier: string = "Llyod",
  version: string = "latest"
): Promise<SubmissionItem[]> => {
  const url = `/submissions/${version}?collection_name=${collection_name}&carrier=${carrier}`;
  return get<SubmissionItem[]>(url);
};

export const createSubmission = async (
  application: Application,
  mode: string = "assessment"
): Promise<SubmissionItem> => {
  const url = `/submissions/${mode === "assessment" ? "assessment" : ""}`;
  return post<SubmissionItem>(url, { application, mode });
};

export const submitSubmissionReview = async <T>(
  submission_id: string,
  quote_update: any
): Promise<T> => {
  const url = `/submissions/${submission_id}/assessment`;
  return post<T>(url, quote_update);
};
