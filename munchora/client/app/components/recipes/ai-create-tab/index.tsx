import { Plus, Save, Share2, Sparkles, Trash2, Wand2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { NewRecipeAIGen } from './new-recipe-ai-gen';
import { DeleteRecipeDialog } from './delete-recipe-dialog';
import useRecipes from '~/hooks/useRecipes';
import { RecipeImageUpload } from './recipe-image-upload';
import { LoadingAiRecipe } from './new-recipe-ai-gen/loadingAiRecipe';
import { useAtomValue } from 'jotai';
import { curRecipeAtom } from '~/atoms/curRecipeAtom';
import { toast } from 'sonner';

export const AICreateTab = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const curRecipe = useAtomValue(curRecipeAtom);
  const { changeCurRecipe, updateRecipe, updateRecipePrompting } = useRecipes();
  const [isRecipeChanged, setIsRecipeChanged] = useState(false);

  const handleEditRecipe = (field: string, value: any) => {
    if (!curRecipe) return;

    if (field === 'is_public' && value === true && !curRecipe.image_url) {
      toast.error('You have to add an image before you can share this recipe 📸');
      return;
    }

    if (!isRecipeChanged) setIsRecipeChanged(true);

    changeCurRecipe({
      ...curRecipe,
      [field]: value,
    });
  };

  const handleUpdateRecipeByAi = async () => {
    if (!curRecipe) return;
    setIsGenerating(true);

    await updateRecipePrompting(aiPrompt);
    setAiPrompt('');
    setIsGenerating(false);
  };

  const triggerUpdateRecipeByAi = async (prompt: string) => {
    setIsGenerating(true);
    await updateRecipePrompting(prompt);
    setIsGenerating(false);
  };

  return (
    <>
      {!curRecipe ? (
        <NewRecipeAIGen aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
      ) : isGenerating ? (
        <LoadingAiRecipe />
      ) : (
        /* Generated Recipe Editor */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipe Preview */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-secondary/50 backdrop-blur-sm shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 m-2">
                    <div className="bg-gradient-to-br from-third/50 to-fourth p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-final" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Your AI Recipe</h2>
                      <p className="text-sm text-slate-500">Click any section to edit directly</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRecipe('is_public', !curRecipe.is_public)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {curRecipe.is_public ? 'Make private' : 'Share'}
                    </Button>
                    <Button
                      disabled={!isRecipeChanged || isSaving}
                      size="sm"
                      onClick={async () => {
                        setIsSaving(true);
                        await updateRecipe({ ...curRecipe });
                        setIsRecipeChanged(false);
                        setIsSaving(false);
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Recipe
                    </Button>
                  </div>
                </div>

                <RecipeImageUpload />

                {/* Editable Title */}
                <div className="mb-6">
                  <Textarea
                    value={curRecipe.title}
                    onChange={(e) => handleEditRecipe('title', e.target.value)}
                    className="lg:text-3xl font-bold border-0 bg-transparent p-2 hover:bg-slate-50 focus:bg-white focus:border focus:border-third rounded-lg transition-all"
                    placeholder="Recipe title..."
                  />
                </div>

                {/* Editable Description */}
                <div className="mb-6">
                  <Textarea
                    value={curRecipe.description}
                    onChange={(e) => handleEditRecipe('description', e.target.value)}
                    className="text-slate-600 border-0 bg-transparent p-2 hover:bg-slate-50 focus:bg-white focus:border focus:border-third rounded-lg transition-all resize-none"
                    placeholder="Recipe description..."
                    rows={2}
                  />
                </div>

                {/* Editable Recipe Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cook Time</label>
                    <Input
                      type="number"
                      value={curRecipe.cook_time}
                      onChange={(e) => handleEditRecipe('cook_time', Number.parseInt(e.target.value) || 30)}
                      className="text-sm border-slate-200 hover:border-third focus:border-third"
                      placeholder="30 min"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Servings</label>
                    <Input
                      type="number"
                      value={curRecipe.servings}
                      onChange={(e) => handleEditRecipe('servings', Number.parseInt(e.target.value) || 1)}
                      className="text-sm border-slate-200 hover:border-third focus:border-third"
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Difficulty</label>
                    <select
                      value={curRecipe.difficulty}
                      onChange={(e) => handleEditRecipe('difficulty', e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 hover:border-third focus:border-third focus:outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cuisine</label>
                    <Input
                      value={curRecipe.cuisine}
                      onChange={(e) => handleEditRecipe('cuisine', e.target.value)}
                      className="text-sm border-slate-200 hover:border-third focus:border-third"
                      placeholder="Italian"
                    />
                  </div>
                </div>

                {/* Editable Ingredients */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Ingredients</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newIngredients = [...curRecipe.ingredients, ''];
                        handleEditRecipe('ingredients', newIngredients);
                      }}
                      className="text-fourth hover:text-final hover:bg-third"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Ingredient
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {curRecipe.ingredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="flex items-center space-x-3 group">
                        <div className="w-2 h-2 bg-third rounded-full flex-shrink-0"></div>
                        <Input
                          value={ingredient.name}
                          onChange={(e) => {
                            const newIngredients = [...curRecipe.ingredients];
                            newIngredients[index].name = e.target.value;
                            handleEditRecipe('ingredients', newIngredients);
                          }}
                          className="flex-1 border-0 bg-transparent hover:bg-slate-50 focus:bg-white focus:border focus:border-third rounded-lg transition-all"
                          placeholder="Enter ingredient..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newIngredients = curRecipe.ingredients.filter((_, i) => i !== index);
                            handleEditRecipe('ingredients', newIngredients);
                          }}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editable Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Instructions</h3>
                    <Button
                      variant="ghost"
                      className="text-fourth hover:text-final hover:bg-third"
                      size="sm"
                      onClick={() => {
                        const newInstructions = [...curRecipe.instructions, ''];
                        handleEditRecipe('instructions', newInstructions);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {curRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex space-x-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-third text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 flex items-start space-x-2">
                          <Textarea
                            value={instruction}
                            onChange={(e) => {
                              const newInstructions = [...curRecipe.instructions];
                              newInstructions[index] = e.target.value;
                              handleEditRecipe('instructions', newInstructions);
                            }}
                            className="flex-1 border-0 bg-transparent hover:bg-slate-50 focus:bg-white focus:border focus:border-third rounded-lg transition-all resize-none"
                            placeholder="Enter instruction step..."
                            rows={2}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1  mt-1"
                            onClick={() => {
                              const filteredInstructions = curRecipe.instructions.filter((_, i) => i !== index);
                              handleEditRecipe('instructions', filteredInstructions);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipe Tags */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Tags</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newTags = [...curRecipe.tags, ''];
                        handleEditRecipe('tags', newTags);
                      }}
                      className="text-fourth hover:text-final hover:bg-third"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {curRecipe.tags.map((tag, index) => (
                      <div key={index} className="flex items-center space-x-1 group">
                        <Input
                          value={tag}
                          onChange={(e) => {
                            const newTags = [...curRecipe.tags];
                            newTags[index] = e.target.value;
                            handleEditRecipe('tags', newTags);
                          }}
                          className="text-sm border-0 bg-third/50 text-final hover:bg-third focus:bg-white focus:border focus:border-third rounded-full px-3 py-1"
                          placeholder="tag"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newTags = curRecipe.tags.filter((_, i) => i !== index);
                            handleEditRecipe('tags', newTags);
                          }}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <hr className="m-4 border-t border-slate-200" />
                  <DeleteRecipeDialog recipeId={curRecipe.id} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Panel */}
          <div className="lg:col-span-1">
            <Card className="border bg-secondary/50 backdrop-blur-sm shadow-sm sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 text-fourth" />
                  Refine with AI
                </h3>

                <div className="space-y-4">
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask AI to modify the recipe... e.g., 'Make it spicier' or 'Add more vegetables'"
                    rows={3}
                    className="bg-white border-slate-200"
                  />
                  <Button className="w-full" disabled={isGenerating} onClick={() => handleUpdateRecipeByAi()}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Refine Recipe
                  </Button>
                </div>

                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => triggerUpdateRecipeByAi('Make the recipe healthier.')}>
                      Make Healthier
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => triggerUpdateRecipeByAi('Add more spices.')}>
                      Add Spice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => triggerUpdateRecipeByAi('Edit the recipe to make it faster and quicker so prep_time and cook_time will be reduced.')}
                    >
                      Reduce Time
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => triggerUpdateRecipeByAi('Add more proteins.')}>
                      More Protein
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="text-xs text-slate-500 bg-third/30 p-3 rounded-lg">
                    <p className="font-medium mb-1">📸 Photo Tips:</p>
                    <ul className="space-y-1">
                      <li>• Use natural lighting</li>
                      <li>• Show the finished dish</li>
                      <li>• Keep it appetizing</li>
                      <li>• Max 5MB file size</li>
                    </ul>
                  </div>
                  <div className="text-xs text-slate-500 bg-third/30 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Editing Tips:</p>
                    <ul className="space-y-1">
                      <li>• Click any field to edit directly</li>
                      <li>• Use + buttons to add items</li>
                      <li>• Hover to see delete options</li>
                      <li>• Changes save automatically</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      changeCurRecipe(null);
                      setAiPrompt('');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
