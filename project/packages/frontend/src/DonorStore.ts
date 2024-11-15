import { create } from "zustand";
import { Donor } from "@bc-cancer/shared/src/types/donor";

interface DonorStore {
  eventId: number;
  donors: Donor[];
  setEventId: (eventId: number) => void;
  setDonors: (donors: Donor[]) => void;
  updateDonorStatus: (id: number, newStatus: string) => void;
}

export const useDonorStore = create<DonorStore>((set) => ({
  eventId: -1,
  donors: [],
  setEventId: (eventId) => set({ eventId }),
  setDonors: (donors) => set({ donors }),
  updateDonorStatus: (id, newStatus) =>
    set((state) => ({
      donors: state.donors.map((donor) =>
        donor.id === id ? { ...donor, status: newStatus } : donor
      ),
    })),
}));
