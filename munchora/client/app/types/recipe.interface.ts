import { type TCategory } from './groceryList.interface';

export interface IIngredient {
  id: number;
  name: string;
  category: TCategory;
  amount: number;
}

export interface IRecipe {
  id: string;
  title: string;
  author: string;
  image_url?: string;
  description: string;
  instructions: string[];
  ingredients: IIngredient[];
  is_public: boolean;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  user: {
    id: string;
    image_src: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IRecipeInput {
  title: string;
  author: string;
  image_url?: string;
  description: string;
  instructions: string;
  ingredients: IIngredient[];
  is_public: boolean;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
}

export interface IFilters {
  search?: string;
  cuisine?: string;
  difficulty?: string;
  tag?: string;
  ingredients?: string;
}
