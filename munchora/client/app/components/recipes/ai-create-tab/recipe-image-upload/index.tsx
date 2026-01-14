import { useAtomValue } from 'jotai';
import { Camera, ImageIcon, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { curRecipeAtom } from '~/atoms/curRecipeAtom';
import { Button } from '~/components/ui/button';
import useRecipes from '~/hooks/useRecipes';
import { useFetch } from '~/lib/api-client';
import { processImageUpload } from '~/utils/imageUpload';

export const RecipeImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { changeCurRecipe } = useRecipes();
  const curRecipe = useAtomValue(curRecipeAtom);
  const { fetchData } = useFetch<{ image_url: string }>();
  const { fetchData: fetchDelImage } = useFetch<{ message: string }>();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !curRecipe) return;

    // Validate file size (max 15MB for original since HEIC files can be larger)
    if (file.size > 15 * 1024 * 1024) {
      toast.warning('Image size should be less than 15MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = await processImageUpload(file);

      const response = await fetchData(`/recipes/${curRecipe?.id}/upload-image`, {
        method: 'POST',
        data: formData,
      });

      if (response.image_url) {
        changeCurRecipe({ ...curRecipe, image_url: response.image_url });
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
    setIsUploadingImage(false);
  };

  const handleAiImageGen = async () => {
    if (!curRecipe) return;
    setIsUploadingImage(true);

    try {
      const response = await fetchData(`/llm/generate-recipe-image/${curRecipe?.id}`, {
        method: 'POST',
      });

      if (response.image_url) {
        changeCurRecipe({ ...curRecipe, image_url: response.image_url });
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image with AI:', error);
      toast.error('Failed to generate image with AI. Please try again.');
    }
    setIsUploadingImage(false);
  };

  const handleDeleteImage = async () => {
    if (!curRecipe) return;
    const res = await fetchDelImage(`/recipes/${curRecipe?.id}/delete-image`, { method: 'DELETE' });
    if (res.message === 'OK') {
      setUploadedImage(null);
      changeCurRecipe({ ...curRecipe, image_url: undefined });
    }
  };

  return (
    <>
      {/* Recipe Image Upload Section */}
      <div className="mb-8">
        <div className="relative group">
          {uploadedImage || curRecipe?.image_url ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={uploadedImage || curRecipe?.image_url || '/placeholder.png'}
                alt={curRecipe?.title ?? 'Unknown recipe title'}
                className="w-full max-h-96 min-h-96 object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Button disabled={isUploadingImage} onClick={handleAiImageGen} className="my-2">
                  <ImagePlus />
                  Let AI update image
                </Button>
                <input id="file-input" type="file" accept="image/*,.heic,.heif" onChange={handleImageUpload} className="hidden" disabled={isUploadingImage} />
                <Button
                  onClick={() => {
                    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  disabled={isUploadingImage}
                >
                  <span className="text-sm font-medium">Upload Image</span>
                </Button>
                <Button className="mt-4" size={'lg'} variant={'destructive'} onClick={handleDeleteImage}>
                  <Trash2 />
                </Button>
              </div>
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-fourth" />
                    <span className="text-sm font-medium">Processing and uploading image...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="m-10 p-4 rounded-2xl border-2 border-dashed hover:border-final transition-colors">
              <Button disabled={isUploadingImage} onClick={handleAiImageGen} className="my-2">
                <ImagePlus />
                Let AI create image
              </Button>
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-4 text-slate-500 hover:text-fourth transition-colors">
                <input type="file" accept="image/*,.heic,.heif" onChange={handleImageUpload} className="hidden" disabled={isUploadingImage} />
                <div className="bg-slate-100 p-4 rounded-full">
                  {isUploadingImage ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImageIcon className="h-8 w-8" />}
                </div>
                <div className="text-center">
                  <p className="font-medium">{isUploadingImage ? 'Processing...' : 'Take Photo or Upload'}</p>
                  <p className="text-sm text-slate-400">Camera, gallery, or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, HEIC • Max 15MB</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
