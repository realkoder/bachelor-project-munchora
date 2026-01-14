// SSR-safe HEIC conversion utilities

type Heic2anyFunction = (options: {
    blob: Blob | File;
    toType: string;
    quality?: number;
}) => Promise<Blob>;

declare global {
    interface Window {
        heic2any?: Heic2anyFunction;
    }
}

export const loadHeic2any = (): Promise<Heic2anyFunction> => {
    return new Promise((resolve, reject) => {
        // SSR check
        if (typeof window === 'undefined') {
            reject(new Error('heic2any not available in server environment'));
            return;
        }

        if (window.heic2any) {
            resolve(window.heic2any);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js';
        script.onload = () => {
            if (window.heic2any) {
                resolve(window.heic2any);
            } else {
                reject(new Error('heic2any function not found after loading'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load HEIC converter'));
        document.head.appendChild(script);
    });
};

export const convertHeicToJpg = async (file: File): Promise<File> => {
    try {
        const heic2any = await loadHeic2any();
        const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.85
        });

        return new File([convertedBlob], 'converted-image.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('HEIC conversion failed:', error);
        throw new Error('Failed to convert HEIC image');
    }
};

// Convert image to JPG with compression
export const convertToJpg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        // SSR check
        if (typeof window === 'undefined') {
            reject(new Error('Image conversion not available in server environment'));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions (max 1200px width/height to reduce file size)
            const maxSize = 1200;
            let { width, height } = img;

            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const jpgFile = new File([blob], 'recipe-image.jpg', {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(jpgFile);
                    } else {
                        reject(new Error('Failed to convert image'));
                    }
                },
                'image/jpeg',
                0.85 // 85% quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};