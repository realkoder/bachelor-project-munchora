import {useAtomValue, useSetAtom} from 'jotai';
import type {IRecipe} from "~/types/recipe.interface";
import {recipesAtom} from "~/atoms/recipesAtom";
import {curRecipeAtom} from "~/atoms/curRecipeAtom";

const useRecipeEvents = () => {
  const setRecipes = useSetAtom(recipesAtom);
  const setCurRecipe = useSetAtom(curRecipeAtom);

  const handleRecipeCreated = (newRecipe: IRecipe) => {
    setRecipes((cur) => {
      if (!cur) return undefined;
      return [...cur, newRecipe];
    });
    setCurRecipe(newRecipe);
  };

  return {
    handleRecipeCreated
  };
};

export default useRecipeEvents;
