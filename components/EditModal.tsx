import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import { editImageWithFlash } from '../services/geminiService';
import { Button, Spinner } from './ui';

interface EditModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onUpdate: (imageId: string, newBase64: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ image, onClose, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!image) return null;

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const newBase64 = await editImageWithFlash(image.base64, 'image/jpeg', prompt);
      onUpdate(image.id, newBase64);
      onClose();
    } catch (err) {
      setError('Error al editar la imagen. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={handleOverlayClick}>
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="w-full md:w-1/2 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">Editar Imagen</h2>
            <p className="text-slate-400 mb-6">Describe los cambios que quieres hacer. Por ejemplo: "añade un filtro retro" o "cambia el cielo a un atardecer".</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Haz que la imagen sea en blanco y negro..."
                className="w-full h-32 p-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-200 focus-ring transition"
                disabled={isLoading}
            />
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            <div className="flex gap-4 mt-6">
                <Button onClick={handleEdit} disabled={isLoading || !prompt.trim()}>
                    {isLoading ? <><Spinner /> Aplicando...</> : 'Aplicar Cambios'}
                </Button>
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                    Cancelar
                </Button>
            </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
            <img src={`data:image/jpeg;base64,${image.base64}`} alt="Editing preview" className="rounded-lg object-contain w-full h-full max-h-[400px]" />
        </div>
      </div>
    </div>
  );
};
