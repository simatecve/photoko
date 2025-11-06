export type BusinessType = 'restaurante' | 'gimnasio' | 'consultorio' | 'tienda' | 'agencia' | 'cafetería' | 'spa' | 'consultoría' | 'inmobiliaria' | 'hotel' | 'salón de belleza' | 'escuela' | 'bufete legal';

export type ImageCategory = 'hero' | 'servicios' | 'testimonios' | 'blog' | 'call-to-action' | 'general';

export interface GeneratedImage {
  id: string;
  base64: string;
  name: string;
  category: ImageCategory;
  business: BusinessType | 'general';
  selected: boolean;
  prompt: string;
}

export interface GenerationConfig {
  businessType: BusinessType;
  description: string;
}

export type View = 'set-generator' | 'single-generator' | 'gallery';

export type AspectRatio = "16:9" | "1:1" | "9:16" | "4:3" | "3:4";
