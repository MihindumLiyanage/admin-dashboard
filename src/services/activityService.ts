import mockData from "@/mock/mockData.json";

export interface RowData {
  id: string;
  name: string;
  version: string;
  coverage: string;
  decision: string;
  [key: string]: any;
}

let activityData: RowData[] = [...(mockData.activity as RowData[])];

export const activityService = {
  async latestSubmissions(): Promise<RowData[]> {
    return [...activityData];
  },
};
