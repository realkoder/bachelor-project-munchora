export const CATEGORIES = [
  'bakery 🥖',
  'beverages 🧋',
  'breakfast 🥣',
  'canned goods 🥫',
  'cleaning 🧼',
  'condiments 🧂',
  'dairy 🥚',
  'fish 🐟',
  'frozen foods ❄️',
  'fruits 🍎',
  'grains 🌾',
  'meat 🍗',
  'no category 📦',
  'pasta & rice 🍝',
  'personal care 🧴',
  'snacks 🍫',
  'spices & herbs 🌶️',
  'vegetables 🥦',
  'sauces & oils 🫙',
] as const;

export type TCategory = (typeof CATEGORIES)[number];

export interface IShoppingListItem {
  id: number;
  name: string;
  category?: TCategory;
  added_by?: string;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IShoppingList {
  id: number;
  name: string;
  items: IShoppingListItem[];
  owner_id: number;
  shared_users: {
    id: number;
    first_name: string;
    image_src?: string;
  }[];
  created_at: Date;
  updated_at: Date;
}

// CREATE OBJECTS

export interface IShoppingListItemInput {
  name: number;
  category?: TCategory;
  added_by?: string;
  is_completed: boolean;
}

export interface IShoppingListInput {
  name: string;
}
