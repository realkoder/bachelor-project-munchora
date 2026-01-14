import type { Route } from './+types/home';
import { BookOpen, Plus, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { RecipesGrid } from '~/components/recipes/recipes-grid';
import { Greeting } from '~/components/greeting/greeting';
import useGroceryLists from '~/hooks/useGrocerylist';
import { recipesAtom } from '~/atoms/recipesAtom';
import { useState } from 'react';
import useFetchRecipes from '~/hooks/fetching/useFetchRecipes';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Home' }, { name: 'description', content: 'Welcome to Munchora!' }];
}

export default function Home() {
  const curUser = useAtomValue(curUserAtom);
  const recipes = useAtomValue(recipesAtom);
  const { groceryLists } = useGroceryLists();
  const [curPage, setCurPage] = useState(1);
  useFetchRecipes(curPage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Clean Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">
              <Greeting /> {curUser?.user?.fullname}
            </p>
            <h1 className="text-2xl font-light text-slate-800 mb-1">What would you like to cook today?</h1>
          </div>
          <div className="flex items-center space-x-3">
            <NavLink to="/recipes">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Recipe
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Clean Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <NavLink to={'/recipes'}>
          <Card className="border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recipes</p>
                  <p className="text-2xl font-light text-slate-800">{recipes?.length || 0}</p>
                </div>
                <div className="bg-secondary/80 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-fourth" />
                </div>
              </div>
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={'/grocery-lists'}>
          <Card className="border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lists</p>
                  <p className="text-2xl font-light text-slate-800">{groceryLists?.length ?? 0}</p>
                </div>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={'/recipes'}>
          <Card className="border backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Streak</p>
                  <p className="text-2xl font-light text-slate-800">12</p>
                </div>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </NavLink>
      </div>

      {/* Recent Recipes - Main Focus */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-light text-slate-800">Your Recent Recipes</h2>
          <NavLink to={'/recipes'}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              View all
            </Button>
          </NavLink>
        </div>

        {recipes && <RecipesGrid recipes={recipes} />}

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recipes?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).map((recipe) => (
            <Card
              key={recipe.id}
              className="group border-0 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => {
                navigate(`/recipe/${recipe.id}`);
              }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg overflow-hidden">
                <img
                  src={recipe.image_url || "/placeholder.png"}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-800 text-sm leading-tight">
                    {recipe.title}
                  </h3>
                  <Heart className="h-4 w-4 text-slate-300 hover:text-rose-400 cursor-pointer transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-600 border-0"
                    >
                      {recipe.cuisine}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{recipe.cook_time}</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                      Created | updated:{" "}
                      {new Date(recipe.updated_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
              </CardContent>
            </Card>
          ))}
        </div>*/}
      </div>

      {/* Quick Actions - Subtle */}
      <div className="grid md:grid-cols-2 gap-4">
        <NavLink to="/recipes">
          <Card className="border bg-secondary/50 hover:bg-secondary/30 transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-final p-3 rounded-xl group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Generate New Recipe</h3>
                  <p className="text-sm text-slate-600">Create AI-powered recipes from any cuisine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to="/grocery-lists">
          <Card className="border bg-secondary/50 hover:bg-secondary/30 transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-fourth p-3 rounded-xl group-hover:scale-105 transition-transform">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Manage Shopping Lists</h3>
                  <p className="text-sm text-slate-600">Organize shopping and share with family</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </NavLink>
      </div>
    </div>
  );
}
