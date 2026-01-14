import { atom } from "jotai";
import type { IGroceryList } from "~/types/groceryList.interface";

export const groceryListsAtom = atom<IGroceryList[]>();