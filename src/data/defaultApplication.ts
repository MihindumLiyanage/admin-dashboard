import { Application } from "@/types/application";

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
  carrier: "Lloyd",
  insured: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    naics: [],
  },
  financials: {
    employee_count: undefined,
    revenue: undefined,
    current_assets: undefined,
    current_liabilities: undefined,
    total_assets: undefined,
    total_liabilities: undefined,
    net_income_loss: undefined,
    retained_earnings: undefined,
    end_ebit: undefined,
  },
  coverage: [],
};
