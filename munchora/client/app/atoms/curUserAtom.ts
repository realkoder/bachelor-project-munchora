import { atom } from "jotai";
import type { IUser } from "~/types/user.interface";

interface ISignedInUser {
    user: IUser | null;
    status: "NOT_SIGNED_IN" | "SIGNED_IN"
}

export const curUserAtom = atom<ISignedInUser | null>();