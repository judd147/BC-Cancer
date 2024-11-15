export const donorStatuses = ["preview", "invited", "excluded"] as const;
export type DonorStatus = (typeof donorStatuses)[number];

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
  contactPhoneType: string;
  phoneRestrictions?: string;
  emailRestrictions?: string;
  communicationRestrictions?: string;
  subscriptionEventsInPerson: boolean;
  subscriptionEventsMagazine: boolean;
  communicationPreference?: string;
  status?: DonorStatus;
}

// Query parameters for getting donors
export interface GetDonorsParams {
  firstName?: string;
  lastName?: string;
  exclude?: boolean;
  deceased?: boolean;
  city?: string;
  minTotalDonations?: number;
  maxTotalDonations?: number;
  firstGiftDateFrom?: Date;
  firstGiftDateTo?: Date;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

/**
 * Extends the Donor type to include the status within an event.
 */
export type DonorWithStatus = Donor & {
  /** Current status of the donor within the event */
  status: DonorStatus;
};
