import { atom } from 'jotai';
import type { IGroceryList } from '~/types/groceryList.interface';

export const curGroceryListAtom = atom<IGroceryList>();
