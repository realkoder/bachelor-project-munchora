import { atom } from "jotai";
import type { IRecipe } from "~/types/recipe.interface";

export const curRecipeAtom = atom<IRecipe | null>();