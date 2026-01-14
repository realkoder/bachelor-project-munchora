import { atom } from "jotai";
import type { IUser } from "~/types/user.interface";

export const usersAtom = atom<IUser[]>();