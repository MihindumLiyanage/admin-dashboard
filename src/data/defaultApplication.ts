import { Application } from "@/types/application";

export const DEFAULT_APPLICATION: Application = {
  broker: {
    name: "",
    organization: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  },
  insured: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    naics: [""],
  },
  financials: {
    employee_count: "",
    revenue: "",
    current_assets: "",
    current_liabilities: "",
    total_assets: "",
    total_liabilities: "",
    net_income_loss: "",
  },
  coverage: [],
  submission_reference: {
    id: "",
    version: "",
  },
};
