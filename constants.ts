import { BusinessType, ImageCategory, AspectRatio } from './types';

export const BUSINESS_TYPES: BusinessType[] = [
  'restaurante', 'gimnasio', 'consultorio', 'tienda', 'agencia', 'cafetería',
  'spa', 'consultoría', 'inmobiliaria', 'hotel', 'salón de belleza', 'escuela', 'bufete legal'
];

export const IMAGE_CATEGORIES: ImageCategory[] = [
  'hero', 'servicios', 'testimonios', 'blog', 'call-to-action'
];

export const ASPECT_RATIOS: AspectRatio[] = ["16:9", "1:1", "9:16", "4:3", "3:4"];

export const TOTAL_IMAGES_IN_SET = 16;
