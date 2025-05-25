export interface Address {
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface Broker extends Address {
  name: string;
  organization: string;
}

export interface Insured extends Address {
  name: string;
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
  retained_earnings?: number;
  end_ebit?: number;
}

export interface Reference {
  id: string;
  version: string;
}

export interface Claims {
  count: number;
  payout: number;
  remarks: string;
}

export type CoverageType = "D&O" | "EPL" | "FID";

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
}
