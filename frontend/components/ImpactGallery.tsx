import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export default function ImpactGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <ImageOff className="w-10 h-10 mx-auto mb-3" />
        <p className="text-sm">Aún no hay fotos de actividades pasadas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img) => (
        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
          <Image src={img.imageUrl} alt={img.caption || 'Actividad SICI'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
          {img.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {img.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
