import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditModal } from './components/EditModal';
import { Button, Icon, Spinner } from './components/ui';
import { BUSINESS_TYPES, IMAGE_CATEGORIES, TOTAL_IMAGES_IN_SET, ASPECT_RATIOS } from './constants';
import { generateImageWithFlash, generateImageWithImagen } from './services/geminiService';
import { createZip } from './services/imageService';
import type { BusinessType, GenerationConfig, GeneratedImage, View, ImageCategory, AspectRatio } from './types';

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- SetGeneratorView Component ---
const SetGeneratorView: React.FC<{ onGenerationComplete: (images: GeneratedImage[]) => void }> = ({ onGenerationComplete }) => {
    const [config, setConfig] = useState<GenerationConfig>({ businessType: 'restaurante', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setProgress(0);
        const newImages: GeneratedImage[] = [];

        try {
            for (let i = 0; i < TOTAL_IMAGES_IN_SET; i++) {
                const category = IMAGE_CATEGORIES[i % IMAGE_CATEGORIES.length];
                const prompt = `
                  Professional, realistic photograph for a '${config.businessType}' business website.
                  The image must be suitable for a '${category}' section.
                  Style: ${config.description || 'Modern, clean, and professional with natural lighting.'}
                  CRITICAL: The image MUST be photorealistic, horizontal with a 16:9 aspect ratio.
                  CRITICAL: Absolutely NO text, logos, watermarks, illustrations, or CGI renders. Only a real photo.
                `.trim();

                const base64 = await generateImageWithFlash(prompt);
                newImages.push({
                    id: crypto.randomUUID(),
                    base64,
                    name: `${config.businessType}_${category}_${String(i + 1).padStart(2, '0')}`,
                    category,
                    business: config.businessType,
                    selected: false,
                    prompt
                });

                setProgress(i + 1);
                await wait(500); // Wait to respect rate limits
            }
            onGenerationComplete(newImages);
        } catch (err) {
            console.error(err);
            setError('Fallo la generación de una imagen. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Generador de Sets de Imágenes</h1>
            <p className="text-slate-400 mb-8">Crea un set completo de 16 imágenes coherentes para tu proyecto web.</p>

            <div className="space-y-6 bg-[#0F172A] p-8 rounded-2xl border border-white/10">
                <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-slate-300 mb-2">Tipo de negocio</label>
                    <select
                        id="businessType"
                        value={config.businessType}
                        onChange={(e) => setConfig({ ...config, businessType: e.target.value as BusinessType })}
                        className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-200 focus-ring capitalize"
                    >
                        {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Descripción adicional (opcional)</label>
                    <textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => setConfig({ ...config, description: e.target.value })}
                        placeholder="Ej: Estilo minimalista, tonos cálidos, ambiente de lujo..."
                        className="w-full h-24 p-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-200 focus-ring"
                    />
                </div>
                 {isLoading ? (
                    <div className="space-y-3 pt-4">
                        <p className="text-center text-cyan-400 font-medium">Generando {progress}/{TOTAL_IMAGES_IN_SET} — No cierres esta ventana.</p>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(progress / TOTAL_IMAGES_IN_SET) * 100}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full !py-4 text-lg">
                        <Icon name="wand-magic-sparkles" /> Generar {TOTAL_IMAGES_IN_SET} Imágenes
                    </Button>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
            </div>
        </div>
    );
};


// --- SingleGeneratorView Component ---
const SingleGeneratorView: React.FC<{ onImageGenerated: (image: GeneratedImage) => void }> = ({ onImageGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const base64 = await generateImageWithImagen(prompt, aspectRatio);
            onImageGenerated({
                id: crypto.randomUUID(),
                base64,
                name: `single_${prompt.slice(0, 15).replace(/\s/g, '_')}`,
                category: 'general',
                business: 'general',
                selected: true,
                prompt
            });
        } catch (err) {
            setError('Error al generar la imagen. Por favor, inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Generador Individual (Alta Calidad)</h1>
            <p className="text-slate-400 mb-8">Usa Imagen 4 para crear una imagen única y de alta fidelidad a partir de un prompt.</p>
            <div className="space-y-6 bg-[#0F172A] p-8 rounded-2xl border border-white/10">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Un astronauta montando a caballo en Marte, foto realista..."
                        className="w-full h-32 p-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-200 focus-ring"
                    />
                </div>
                <div>
                    <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-2">Relación de aspecto</label>
                    <div className="grid grid-cols-5 gap-2">
                        {ASPECT_RATIOS.map(ratio => (
                            <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`py-2 rounded-lg border-2 transition ${aspectRatio === ratio ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800/50 border-white/10 hover:border-white/20'}`}>
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full !py-4 text-lg">
                    {isLoading ? <><Spinner /> Generando...</> : <><Icon name="image" /> Generar Imagen</>}
                </Button>
                 {error && <p className="text-red-400 text-center">{error}</p>}
            </div>
        </div>
    );
};

// --- GalleryView Component ---
const GalleryView: React.FC<{
    images: GeneratedImage[];
    setImages: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
    onEdit: (image: GeneratedImage) => void;
}> = ({ images, setImages, onEdit }) => {
    const selectedCount = useMemo(() => images.filter(img => img.selected).length, [images]);

    const toggleSelect = (id: string) => {
        setImages(imgs => imgs.map(img => img.id === id ? { ...img, selected: !img.selected } : img));
    };

    const toggleSelectAll = (select: boolean) => {
        setImages(imgs => imgs.map(img => ({ ...img, selected: select })));
    };

    const handleDownload = () => {
        const selectedImages = images.filter(img => img.selected);
        if(selectedImages.length > 0) {
            createZip(selectedImages);
        }
    };

    if (images.length === 0) {
        return (
            <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                <Icon name="images" className="text-7xl text-slate-700 mb-4" />
                <h2 className="text-2xl font-bold text-white">Tu galería está vacía</h2>
                <p className="text-slate-400 mt-2">Usa uno de los generadores para empezar a crear imágenes.</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <header className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Galería de Imágenes</h1>
                    <p className="text-slate-400">{selectedCount} de {images.length} seleccionadas</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => toggleSelectAll(true)}><Icon name="check-double"/> Sel. Todas</Button>
                    <Button variant="secondary" onClick={() => toggleSelectAll(false)}><Icon name="xmark"/> Desel. Todas</Button>
                    <Button onClick={handleDownload} disabled={selectedCount === 0}>
                        <Icon name="file-zipper"/> Descargar ({selectedCount})
                    </Button>
                </div>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {images.map(image => (
                    <div key={image.id} className="relative group rounded-2xl overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">
                        <img src={`data:image/jpeg;base64,${image.base64}`} alt={image.name} className="w-full h-48 object-cover bg-slate-800" loading="lazy" />
                        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${image.selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <input
                                type="checkbox"
                                checked={image.selected}
                                onChange={() => toggleSelect(image.id)}
                                className="absolute top-3 left-3 h-6 w-6 rounded-md bg-white/20 border-none text-cyan-500 focus:ring-0 cursor-pointer"
                            />
                             <Button variant="secondary" onClick={() => onEdit(image)} className="absolute bottom-3 right-3 !px-3 !py-1.5 !text-sm">
                                <Icon name="pen-to-square"/> Editar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [currentView, setCurrentView] = useState<View>('set-generator');
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);

    const handleGenerationComplete = useCallback((newImages: GeneratedImage[]) => {
        setImages(newImages);
        setCurrentView('gallery');
    }, []);
    
    const handleSingleImageGenerated = useCallback((newImage: GeneratedImage) => {
        setImages(prev => [newImage, ...prev]);
        setCurrentView('gallery');
    }, []);

    const handleUpdateImage = useCallback((imageId: string, newBase64: string) => {
        setImages(prevImages =>
            prevImages.map(img =>
                img.id === imageId ? { ...img, base64: newBase64 } : img
            )
        );
    }, []);

    const renderView = () => {
        switch (currentView) {
            case 'set-generator':
                return <SetGeneratorView onGenerationComplete={handleGenerationComplete} />;
            case 'single-generator':
                return <SingleGeneratorView onImageGenerated={handleSingleImageGenerated} />;
            case 'gallery':
                return <GalleryView images={images} setImages={setImages} onEdit={setEditingImage} />;
            default:
                return <SetGeneratorView onGenerationComplete={handleGenerationComplete} />;
        }
    };
    
    return (
        <div className="flex min-h-screen">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} imageCount={images.length} />
            <main className="flex-1 lg:ml-72">
                {renderView()}
            </main>
            {editingImage && (
                <EditModal 
                    image={editingImage}
                    onClose={() => setEditingImage(null)}
                    onUpdate={handleUpdateImage}
                />
            )}
        </div>
    );
}
