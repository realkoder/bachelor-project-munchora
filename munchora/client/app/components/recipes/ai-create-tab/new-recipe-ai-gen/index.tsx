import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import useRecipes from '~/hooks/useRecipes';
import { LoadingAiRecipe } from './loadingAiRecipe';

interface NewRecipeAIGenProps {
  aiPrompt: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  setIsGenerating: (cur: boolean) => void;
}

export const NewRecipeAIGen = ({ aiPrompt, setAiPrompt, isGenerating, setIsGenerating }: NewRecipeAIGenProps) => {
  const { createRecipe } = useRecipes();

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    await createRecipe(aiPrompt);

    setIsGenerating(false);
  };

  // const handleEditRecipe = (field: string, value: any) => {
  //   if (!curRecipe) return;

  //   setCurRecipe({
  //     ...curRecipe,
  //     [field]: value,
  //   });
  // };

  return isGenerating ? (
    <LoadingAiRecipe />
  ) : (
    <Card className="border bg-secondary/50 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-secondary/50 to-third w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-fourth" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Create with AI</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Describe what you want to cook and let our AI create a personalized recipe for you. You can then edit and refine it to perfection.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Describe your ideal recipe</label>
            <Textarea
              placeholder="E.g., 'A healthy Mediterranean pasta with lots of vegetables and feta cheese' or 'Spicy Korean-style chicken wings for a party'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              className="bg-white/70 backdrop-blur-sm border-slate-200"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-sky-50 p-4 rounded-lg">
              <h4 className="font-medium text-sky-800 mb-2">💡 Be Specific</h4>
              <p className="text-sky-700">Include cuisine type, main ingredients, and cooking style</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-800 mb-2">🥗 Dietary Needs</h4>
              <p className="text-emerald-700">Mention any allergies or dietary restrictions</p>
            </div>
            <div className="bg-violet-50 p-4 rounded-lg">
              <h4 className="font-medium text-violet-800 mb-2">⏱️ Time & Skill</h4>
              <p className="text-violet-700">Specify cooking time and difficulty level</p>
            </div>
          </div>

          <Button
            onClick={handleAIGenerate}
            disabled={!aiPrompt.trim() || isGenerating}
            className="w-full py-6 text-lg"
            cy-data="generate-recipe"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating your recipe...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Recipe
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
