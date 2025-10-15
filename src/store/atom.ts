import { atom } from "jotai";
import { User } from "@/types/userTs";

export const isProfileEditDialogOpenAtom = atom(false);
export const userDataAtom = atom<User | null>(null);
