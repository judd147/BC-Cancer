export interface Donor {
  id: number;
  pmm: string;
  smm: string;
  vmm: string;
  exclude: boolean;
  deceased: boolean;
  firstName: string;
  nickName?: string;
  lastName: string;
  organizationName?: string;
  totalDonations: number;
  totalPledge: number;
  largestGift: number;
  largestGiftAppeal?: string;
  firstGiftDate?: Date;
  lastGiftDate?: Date;
  lastGiftAmount: number;
  lastGiftRequest?: Date;
  lastGiftAppeal?: string;
}

// Query parameters for getting donors
export interface GetDonorsParams {
  firstName?: string;
  lastName?: string;
  exclude?: boolean;
  deceased?: boolean;
  minTotalDonations?: number;
  maxTotalDonations?: number;
  firstGiftDateFrom?: Date;
  firstGiftDateTo?: Date;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
