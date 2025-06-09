export interface Reference {
  id: string;
  version: string;
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
  employee_count: number;
  revenue: number;
  current_assets: number;
  current_liabilities: number;
  total_assets: number;
  total_liabilities: number;
  net_income_loss: number;
  retained_earning?: number | null;
  end_ebit?: number | null;
}

export interface Claims {
  count: number;
  payout: number;
  remarks: string;
}

export interface Coverage {
  type: CoverageType;
  limit: number;
  retention: number;
  claims: Claims;
}

export interface Application {
  submission_reference: Reference;
  broker: Broker;
  carrier: string;
  insured: Insured;
  financials: Finance;
  coverage: Coverage[];
  assessment?: string;
  explanation?: string;
  issue_date?: string;
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
    naics: [],
  },
  financials: {
    employee_count: 0,
    revenue: 0,
    current_assets: 0,
    current_liabilities: 0,
    total_assets: 0,
    total_liabilities: 0,
    net_income_loss: 0,
    retained_earning: null,
    end_ebit: null,
  },
  coverage: [],
};
