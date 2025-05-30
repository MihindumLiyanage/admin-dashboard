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
    employee_count: 0,
    revenue: 0,
    current_assets: 0,
    current_liabilities: 0,
    total_assets: 0,
    total_liabilities: 0,
    net_income_loss: 0,
    retained_earning: 0,
    end_ebit: 0,
  },
  coverage: [],
};
