import {atom} from 'jotai';
import type { IShoppingList } from '~/types/shoppingList.interface';

export const curShoppingListAtom = atom<IShoppingList>();
