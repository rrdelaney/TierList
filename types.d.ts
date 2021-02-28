export interface TierList {
  [tier: string]: string[];
}

export interface TierListData {
  [version: string]: TierList;
}
