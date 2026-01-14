import { UserCog } from 'lucide-react';
import { Button } from '~/components/ui/button';
import useRecipes from '~/hooks/useRecipes';
import type { IRecipe } from '~/types/recipe.interface';
import { DeleteRecipeDialog } from '../ai-create-tab/delete-recipe-dialog';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { ADMIN_USER_ID } from '~/constants/admin-constants';

interface DeleteUpdateRecipeBtnsProps {
  recipe: IRecipe;
}

export const DeleteUpdateRecipeBtns = ({ recipe }: DeleteUpdateRecipeBtnsProps) => {
  const { changeCurRecipe } = useRecipes();
  const navigate = useNavigate();
  const curUser = useAtomValue(curUserAtom);

  return (
    <>
      {(recipe.user.id === curUser?.user?.id || curUser?.user?.id === ADMIN_USER_ID) && (
        <div className=" flex justify-center space-x-2">
          <Button
            onClick={() => {
              changeCurRecipe({ ...recipe });
              if (location.pathname !== '/recipes') {
                navigate('/recipes');
              }
            }}
          >
            <UserCog className="h-4 w-4" />
            Update
          </Button>
          <DeleteRecipeDialog recipeId={recipe.id} />
        </div>
      )}
    </>
  );
};
