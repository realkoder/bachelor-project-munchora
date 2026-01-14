import { ChefHat, Clock, Loader2, Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

// interface LoadingAiRecipeProps {
//   generationStep: string;
//   generationProgress: number;
// }

export const LoadingAiRecipe = () => {
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    (async () => {
      setGenerationStep('Analyzing your request...');

      // Simulate realistic AI generation steps
      const steps = [
        { message: 'Analyzing your request...', duration: 800 },
        { message: 'Searching recipe databases...', duration: 1200 },
        { message: 'Selecting ingredients...', duration: 1000 },
        { message: 'Calculating cooking times...', duration: 800 },
        { message: 'Generating instructions...', duration: 1500 },
        { message: 'Optimizing recipe...', duration: 700 },
        { message: 'Finalizing your recipe...', duration: 500 },
      ];
      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(steps[i].message);
        setGenerationProgress(((i + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      }
    })();
  }, []);

  return (
    <Card className="border-0 bg-secondary/50 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-secondary/50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-sky-600 animate-spin" />
              <div className="absolute inset-0 bg-gradient-to-r from-third/50 to-fourth rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Creating Your Recipe</h2>
            <p className="text-slate-600 max-w-md mx-auto">Our AI chef is analyzing your request and crafting the perfect recipe just for you...</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-third/50 to-fourth h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 font-medium">{generationStep}</p>
          </div>

          {/* Generation Steps Visualization */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div
              className={`text-center p-3 rounded-lg transition-all duration-300 ${
                generationProgress >= 25 ? 'bg-secondary text-final' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Search className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs font-medium">Analyzing</p>
            </div>
            <div
              className={`text-center p-3 rounded-lg transition-all duration-300 ${
                generationProgress >= 50 ? 'bg-third text-final' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <ChefHat className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs font-medium">Selecting</p>
            </div>
            <div
              className={`text-center p-3 rounded-lg transition-all duration-300 ${
                generationProgress >= 75 ? 'bg-fourth text-final' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs font-medium">Calculating</p>
            </div>
            <div
              className={`text-center p-3 rounded-lg transition-all duration-300 ${
                generationProgress >= 100 ? 'bg-final text-slate-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Sparkles className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs font-medium">Finalizing</p>
            </div>
          </div>

          {/* Fun Facts During Loading */}
          <div className="bg-gradient-to-r from-third/50 to-fourth p-4 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-slate-600">
              <span className="font-medium">💡 Did you know?</span> Our AI considers over 10,000 flavor combinations to create your perfect recipe!
            </p>
          </div>

          {/* Cancel Button
          <Button
            variant="outline"
            onClick={() => {
              //   setIsGenerating(false);
              setGenerationStep("");
              setGenerationProgress(0);
            }}
            className="mt-4"
          >
            Cancel Generation
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};
