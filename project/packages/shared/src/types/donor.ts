export const donorStatuses = ["preview", "invited", "excluded"] as const;
export type DonorStatus = (typeof donorStatuses)[number];

/**
 * Represents a donor with their donation history.
 * The response from "GET /donors" endpoint.
 */
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
  firstGiftDate?: Date | string;
  lastGiftDate?: Date | string;
  lastGiftAmount: number;
  lastGiftRequest?: Date | string;
  lastGiftAppeal?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  interests: string[];
  contactPhoneType: string;
  phoneRestrictions?: string;
  emailRestrictions?: string;
  communicationRestrictions?: string;
  subscriptionEventsInPerson: boolean;
  subscriptionEventsMagazine: boolean;
  communicationPreference?: string;
}

// Query parameters for getting donors
export interface GetDonorsParams {
  firstName?: string;
  lastName?: string;
  exclude?: boolean;
  deceased?: boolean;
  city?: string;
  interests?: string[];
  minTotalDonations?: number;
  maxTotalDonations?: number;
  firstGiftDateFrom?: Date;
  firstGiftDateTo?: Date;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
