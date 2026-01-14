import { toast } from 'sonner';
import { convertHeicToJpg, convertToJpg } from './convertIngToJpg';

export const processImageUpload = async (file: File) => {
  try {
    let processedFile = file;
    const isHeic =
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

    if (isHeic) {
      toast.info('Converting HEIC image...');
      processedFile = await convertHeicToJpg(file);
    } else if (!file.type.startsWith('image/')) {
      toast.warning('Please select an image file');
      return;
    } else if (file.type !== 'image/jpeg') {
      toast.info('Converting image to JPG...');
      processedFile = await convertToJpg(file);
    }

    const formData = new FormData();
    formData.append('image', processedFile);
    return formData;
  } catch (error) {
    console.error('Error uploading image:', error);

    if (error instanceof Error) {
      if (error.message.includes('Failed to convert HEIC')) {
        toast.error('Failed to convert HEIC image. Please try again or use a different format.');
      } else if (error.message.includes('Failed to load image')) {
        toast.error('Unsupported image format. Please try JPG, PNG, WebP, or HEIC.');
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } else {
      toast.error('Failed to upload image. Please try again.');
    }
  }
};
