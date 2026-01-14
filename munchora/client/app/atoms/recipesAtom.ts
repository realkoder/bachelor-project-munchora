import { atom } from "jotai";
import type { IRecipe } from "~/types/recipe.interface";

export const recipesAtom = atom<IRecipe[] | null>();