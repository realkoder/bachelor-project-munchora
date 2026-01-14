import { Clock, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import type { IRecipe } from '~/types/recipe.interface';
import { DeleteUpdateRecipeBtns } from '../delete-update-buttons';
import { useEffect } from 'react';

interface RecipesGridProps {
  recipes: IRecipe[];
}

export const RecipesGrid = ({ recipes }: RecipesGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map((recipe) => (
          <Card key={recipe.id} className="group border bg-secondary/50  hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/recipe/${recipe.id}`)}>
              <img
                data-cy="recipe-card-link"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                src={recipe.image_url || '/placeholder.png'}
                alt={recipe.title}
              />
            </div>
            <CardContent>
              <div className="flex items-start justify-between mb-2 cursor-pointer" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-fourth transition-colors">{recipe.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{recipe.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Heart className="h-4 w-4 text-slate-400 hover:text-rose-500 transition-colors" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 mb-2 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.cook_time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings}</span>
                </div>
                {/* <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{recipe.rating}</span>
                    </div> */}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={recipe?.user?.image_src || '/placeholder.png'} />
                    <AvatarFallback className="text-xs">{recipe.author}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-slate-500">{recipe.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-secondary text-slate-500 border-0 text-xs">
                    {recipe.cuisine}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 text-xs">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Created:{' '}
                {new Date(recipe.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              <hr className="m-4 border-t border-slate-200" />
              <DeleteUpdateRecipeBtns recipe={recipe} />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
