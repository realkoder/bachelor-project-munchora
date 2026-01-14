import { Button } from '~/components/ui/button';
import type { Route } from './+types/recipe';
import { Bookmark, ChefHat, Clock, Heart, Share2, ShoppingCart, Users, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { useFetch } from '~/lib/api-client';
import type { IIngredient, IRecipe } from '~/types/recipe.interface';
import { DeleteUpdateRecipeBtns } from '~/components/recipes/delete-update-buttons';
import { useEffect, useState } from 'react';
import IngredientSelectorModal from '~/components/recipes/ingredient-selector-modal';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { useParams } from 'react-router';

export function meta({ data }: Route.MetaArgs) {
  const recipe = data;
  if (!recipe) {
    return [
      { title: 'Recipe | Munchora' },
      {
        name: 'Recipe | Munchora',
        content: 'Discover delicious recipes on Munchora!',
      },
    ];
  }
  return [
    { title: `${recipe.title} | Munchora` },
    {
      name: 'description',
      content: recipe.description?.slice(0, 160) || 'Delicious recipe on Munchora.',
    },
    { property: 'og:title', content: `${recipe.title} | Munchora` },
    {
      property: 'og:description',
      content: recipe.description?.slice(0, 160) || 'Delicious recipe on Munchora.',
    },
    {
      property: 'og:image',
      content: recipe.image_url || 'https://munchora.pro/placeholder.png',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://munchora.pro/recipe/${recipe.id}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${recipe.title} | Munchora` },
    {
      name: 'twitter:description',
      content: recipe.description?.slice(0, 160) || 'Delicious recipe on Munchora.',
    },
    {
      name: 'twitter:image',
      content: recipe.image_url || 'https://munchora.pro/placeholder.png',
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const recipeId = params.recipeId;

  return (async () => {
    try {
      const { fetchData } = useFetch<IRecipe>();
      const recipe = await fetchData(`/recipes/${recipeId}`);
      return recipe;
    } catch (e) {
      return null;
    }
  })();
}

export default function Recipe({ loaderData }: Route.ComponentProps) {
  const params = useParams();
  const recipeId = params.recipeId;
  const [recipe, setRecipe] = useState(loaderData);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient>();
  const curUser = useAtomValue(curUserAtom);
  const { fetchData } = useFetch<IRecipe>();

  useEffect(() => {
    if (!recipe && recipeId && curUser?.status === 'SIGNED_IN') {
      (async () => {
        const recipe = await fetchData(`/recipes/${recipeId}`);
        console.log('Recipe couldnt be rendered SSR did it CSR!', recipe);
        setRecipe(recipe);
      })();
    }
  }, [curUser?.status]);

  const handleIngredientClick = (ingredient: IIngredient) => {
    setSelectedIngredient(ingredient);
    setShowIngredientModal(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="border overflow-hidden rounded-lg shadow-sm">
          <div className="relative">
            {recipe?.image_url && <img src={recipe?.image_url} alt={recipe?.title} className="w-full h-80 object-contain bg-secondary/50" />}
            <div className={`${recipe?.image_url ? 'absolute top-4 right-4' : 'bg-secondary/50 justify-end p-2'} flex gap-2`}>
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-secondary/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 data-cy="recipe-title" className="text-3xl font-bold text-gray-900 mb-2">{recipe?.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{recipe?.description}</p>
              </div>
            </div>

            {/* Author and Rating */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={recipe?.user?.image_src || '/placeholder.png'} alt={recipe?.author} />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{recipe?.author}</p>
                  <p className="text-sm text-gray-500">Recipe Author</p>
                </div>
              </div>

              <div className="mt-1 text-xs text-slate-400">
                Created:{' '}
                {new Date(recipe?.created_at ?? new Date()).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(recipe.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{recipe.rating}</span>
                <span className="text-gray-500">
                  ({recipe.reviewCount} reviews)
                </span>
              </div> */}
            </div>

            {/* Recipe Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-third/30">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-500">Prep Time</p>
                  <p className="font-semibold">{recipe?.cook_time} min</p>
                </CardContent>
              </Card>
              <Card className="bg-third/30">
                <CardContent className="p-4 text-center">
                  <ChefHat className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-gray-500">Cook Time</p>
                  <p className="font-semibold">{recipe?.cook_time} min</p>
                </CardContent>
              </Card>
              <Card className="bg-third/30">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-third" />
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-semibold">{recipe?.servings}</p>
                </CardContent>
              </Card>
              <Card className="bg-third/30">
                <CardContent className="p-4 text-center">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <Badge variant="outline" className="mb-2">
                    {recipe?.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{recipe?.cuisine}</Badge>
              {recipe?.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}

          <Card className="lg:col-span-1 bg-secondary/50">
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recipe?.ingredients.map((ingredient, index) => (
                  <div
                      key={index}
                      onClick={() => handleIngredientClick(ingredient)}
                      className="flex items-center p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer transition-all duration-200 group"
                  >
                    <div className="w-2 h-2 bg-final rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-slate-700 transition-colors">{ingredient.name} x{ingredient.amount}</span>
                    <ShoppingCart
                        className="h-6 w-6 text-slate-400 group-hover:text-final ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200"/>
                  </div>
              ))}
            </CardContent>
          </Card>

          {/* Instructions */}

          <Card className="lg:col-span-2 bg-secondary/50">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {recipe?.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-third text-white rounded-full flex items-center justify-center font-semibold text-sm">{index + 1}</div>
                  </div>
                  <div className="flex-1">
                    {/* <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {instruction.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {instruction.time}
                        </Badge>
                      </div> */}
                    <p className="text-gray-600 leading-relaxed">{instruction}</p>
                    <hr className="my-4 border-t border-slate-200" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <hr className="m-4 border-t border-border" />
        {recipe && <DeleteUpdateRecipeBtns recipe={recipe} />}
      </div>

      <IngredientSelectorModal isOpen={showIngredientModal} onClose={() => setShowIngredientModal(false)} ingredient={selectedIngredient} />
    </div>
  );
}
