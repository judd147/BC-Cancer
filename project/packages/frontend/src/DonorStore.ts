import { create } from "zustand";
import { Donor } from "@bc-cancer/shared/src/types/donor";

interface DonorStore {
  donors: Donor[];
  setDonors: (donors: Donor[]) => void;
  updateDonorStatus: (id: number, newStatus: string) => void;
}

export const useDonorStore = create<DonorStore>((set) => ({
  donors: [],
  setDonors: (donors) => set({ donors }),
  updateDonorStatus: (id, newStatus) =>
    set((state) => ({
      donors: state.donors.map((donor) =>
        donor.id === id ? { ...donor, status: newStatus } : donor
      ),
    })),
}));
