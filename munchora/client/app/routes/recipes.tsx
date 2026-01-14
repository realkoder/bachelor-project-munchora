import { useEffect, useState } from 'react';
import type { Route } from './+types/recipes';
import { Globe, Search, Wand2, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Input } from '~/components/ui/input';
import { AICreateTab } from '~/components/recipes/ai-create-tab';
import { RecipesGrid } from '~/components/recipes/recipes-grid';
import { useAtomValue } from 'jotai';
import { curRecipeAtom } from '~/atoms/curRecipeAtom';
import { recipesAtom } from '~/atoms/recipesAtom';
import useFetchRecipes from '~/hooks/fetching/useFetchRecipes';
import { PaginationNavigation } from '~/components/pagination-navigation';
import { useDebounce } from '~/hooks/fetching/useDebounceSearch';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Recipes' }, { name: 'description', content: 'Welcome to Munchora!' }];
}

const cuisineFilters = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'keto',
  'paleo',
  'high-protein',
  'quick',
  'easy',
  'budget',
  'healthy',
  'family-friendly',
  'spicy',
  'sweet',
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'dessert',
  'soup',
  'salad',
  'side-dish',
  'grilling',
  'baking',
  'spring',
  'summer',
  'fall',
  'winter',
  'italian',
  'mexican',
  'chinese',
  'japanese',
  'indian',
  'mediterranean',
  'thai',
  'korean',
  'american',
];

const difficultyFilters = ['Easy', 'Medium', 'Hard'];
const dietFilters = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'];

export default function Recipes() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const curRecipe = useAtomValue(curRecipeAtom);
  const recipes = useAtomValue(recipesAtom);
  const [curPage, setCurPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 800);
  const selectedCuisine = cuisineFilters.find((f) => selectedFilters.includes(f));
  const selectedDifficulty = difficultyFilters.find((f) => selectedFilters.includes(f));
  const selectedTag = dietFilters.find((f) => selectedFilters.includes(f));

  const { pagination, isLoading } = useFetchRecipes(curPage, {
    search: debouncedSearch,
    cuisine: selectedCuisine,
    difficulty: selectedDifficulty,
    tag: selectedTag,
  });

  useEffect(() => {
    if (pagination) {
      if (curPage > pagination.total_pages) {
        setCurPage(1);
      }
      if (curPage < 1) {
        setCurPage(1);
      }
    }
  }, [pagination, curPage]);

  useEffect(() => {
    if (curRecipe && activeTab !== 'create') setActiveTab('create');
  }, [curRecipe]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-800 mb-2">Recipe Studio</h1>
        <p className="text-slate-500">Discover amazing recipes or create your own with AI</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/30 backdrop-blur-sm">
          <TabsTrigger value="discover" className="cursor-pointer flex items-center space-x-2 border ">
            <Globe className="h-4 w-4" />
            <span>Discover</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="cursor-pointer flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>AI Create</span>
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search recipes, cuisines, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="backdrop-blur-sm border"
              />
            </div>
            <Button
              variant="outline"
              className="backdrop-blur-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters([]);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex overflow-x-auto gap-2 py-2">
            {[...cuisineFilters, ...difficultyFilters, ...dietFilters].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilters.includes(filter) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
                }}
                className={selectedFilters.includes(filter) ? 'bg-third hover:bg-third/80' : 'backdrop-blur-sm border hover:bg-third/80'}
              >
                {filter}
              </Button>
            ))}
          </div>

          {recipes && <RecipesGrid recipes={recipes} />}
          <PaginationNavigation pagination={pagination} onPageChange={setCurPage} />
        </TabsContent>

        {/* AI Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <AICreateTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
