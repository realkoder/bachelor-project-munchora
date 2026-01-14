import {useAtom} from 'jotai';
import {toast} from 'sonner';
import {curRecipeAtom} from '~/atoms/curRecipeAtom';
import {recipesAtom} from '~/atoms/recipesAtom';
import {useFetch} from '~/lib/api-client';
import type {IRecipe} from '~/types/recipe.interface';

const useRecipes = () => {
    const {fetchData: fetchRecipe} = useFetch<IRecipe>();
    const [recipes, setRecipes] = useAtom(recipesAtom);
    const [curRecipe, setCurRecipe] = useAtom(curRecipeAtom);

    const createRecipe = async (aiPrompt: string) => {
        try {
            const aiRecipe = await fetchRecipe('/llm/generate-recipe', {method: 'POST', data: {prompt: aiPrompt}});
            if (!aiRecipe) {
                toast.error('Something went wrong try again');
                return;
            }

            setCurRecipe(aiRecipe);
            setRecipes((cur) => {
                if (!cur) return [aiRecipe];
                return [...cur, aiRecipe];
            });
        } catch {
            toast.error('Something went wrong try again');
        }
    };

    const updateRecipePrompting = async (aiPrompt: string) => {
        if (!curRecipe) {
            toast.error('Something went wrong - could not update your recipe. Try reloading');
            return;
        }

        const updatedAiRecipe = await fetchRecipe(`/llm/update-recipe/${curRecipe?.id}`, {
            method: 'PUT',
            data: {prompt: aiPrompt}
        });
        if (!updatedAiRecipe) {
            toast.error('Could not update your recipe - try again');
            return;
        }
        setCurRecipe(updatedAiRecipe);
        setRecipes((cur) => {
            if (!cur) return [updatedAiRecipe];
            const updatedRecipes = cur.map((iterRecipe) => {
                if (iterRecipe.id === updatedAiRecipe.id) {
                    return updatedAiRecipe;
                }
                return iterRecipe;
            });
            return updatedRecipes;
        });
    };

    const changeCurRecipe = (recipe: IRecipe | null) => {
        if (recipe) {
            setCurRecipe({...recipe});
        } else {
            setCurRecipe(null);
        }
    };

    const updateRecipe = async (recipe: IRecipe) => {
        try {
            const updatedRecipe = await fetchRecipe(`/recipes/${recipe.id}`, {method: 'PUT', data: recipe});
            if (updatedRecipe) {
                setCurRecipe(updatedRecipe);
                setRecipes((cur) => {
                    if (!cur) return null;
                    return cur.map((iterRecipe) => {
                        if (iterRecipe.id === updatedRecipe.id) {
                            return updatedRecipe;
                        } else {
                            return iterRecipe;
                        }
                    });
                });
                toast.info('Your recipe has been updated!');
            }
        } catch (e) {
            toast.info('Something went wrong deleting the given recipe.');
        }
    };

    const deleteRecipe = async (recipeId: string) => {
        try {
            await fetchRecipe(`/recipes/${recipeId}`, {method: 'DELETE'});
            setCurRecipe(null);
            if (recipes) {
                setRecipes((cur) => {
                    if (!cur) return;
                    return cur?.filter((recipe) => recipe.id !== recipeId);
                });
            }
        } catch (e) {
            toast.info('Something went wrong deleting the given recipe.');
        }
    };

    return {changeCurRecipe, createRecipe, deleteRecipe, updateRecipe, updateRecipePrompting};
};

export default useRecipes;
