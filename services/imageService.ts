import type { GeneratedImage } from '../types';

declare const JSZip: any;

export const resizeImage = (base64Str: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${base64Str}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const aspectRatio = img.width / img.height;
            
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
        };
        img.onerror = (err) => reject(err);
    });
};

export const createZip = async (images: GeneratedImage[]): Promise<void> => {
    if (!images || images.length === 0) return;
    const zip = new JSZip();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const folderName = `photoKo_${images[0]?.business}_${date}`;
    const folder = zip.folder(folderName);

    if (!folder) return;

    await Promise.all(images.map(async (image) => {
        const resizedBase64 = await resizeImage(image.base64, 1920, 1080);
        folder.file(`${image.name}.jpg`, resizedBase64, { base64: true });
    }));

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
