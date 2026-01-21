import {atom} from "jotai";
import type {IShoppingList} from "~/types/shoppingList.interface";

export const shoppingListsAtom = atom<IShoppingList[]>();