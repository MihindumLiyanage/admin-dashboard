export interface Broker {
  name: string;
  organization: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export type CoverageType = "D&O" | "EPL" | "FID";

export interface Coverage {
  type: CoverageType;
  limit: number;
  retention: number;
  claims: { count: number; payout: number; remarks: string };
}

export interface Financials {
  employee_count: string;
  revenue: string;
  current_assets: string;
  current_liabilities: string;
  total_assets: string;
  total_liabilities: string;
  net_income_loss: string;
  retained_earning?: string;
  end_ebit?: string;
}

export interface Insured {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  naics: string[];
}

export interface SubmissionReference {
  id: string;
  version: string;
}

export interface Application {
  broker: Broker;
  insured: Insured;
  financials: Financials;
  coverage: Coverage[];
  submission_reference: SubmissionReference;
}
