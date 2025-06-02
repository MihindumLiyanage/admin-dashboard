import { ApplicationStatus } from "@/constants/status";

export interface Application {
  submission_reference: SubmissionReference;
  broker: Broker;
  carrier: string;
  insured: Insured;
  financials: Finance;
  coverage: Coverage[];
}

export interface SubmissionReference {
  id: string;
  version: string;
  assessment?: ApplicationStatus;
  explanation?: string;
}

export interface Broker {
  name: string;
  organization: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface Insured {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  naics: string[];
}

export interface Finance {
  employee_count?: number;
  revenue?: number;
  current_assets?: number;
  current_liabilities?: number;
  total_assets?: number;
  total_liabilities?: number;
  net_income_loss?: number;
  retained_earning?: number | null;
  end_ebit?: number | null;
}

export interface Coverage {
  type: CoverageType;
  limit: number;
  retention: number;
  claims: Claims;
}

export interface Claims {
  count: number;
  payout: number;
  remarks: string;
}

export enum CoverageType {
  D_AND_O = "D&O",
  EPL = "EPL",
  FID = "FID",
}

export const DEFAULT_APPLICATION: Application = {
  submission_reference: {
    id: "",
    version: "",
  },
  broker: {
    name: "",
    organization: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  },
  carrier: "Llyod",
  insured: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    naics: [""],
  },
  financials: {
    employee_count: undefined,
    revenue: undefined,
    current_assets: undefined,
    current_liabilities: undefined,
    total_assets: undefined,
    total_liabilities: undefined,
    net_income_loss: undefined,
    retained_earning: null,
    end_ebit: null,
  },
  coverage: [],
};
