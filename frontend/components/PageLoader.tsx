import Image from 'next/image';

export default function PageLoader() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 bg-background">
      <div className="w-10 h-10 relative animate-pulse">
        <Image
          src="/logo-sociedad-definitive-edition.png"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-pulse [animation-delay:-0.4s]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-pulse [animation-delay:-0.2s]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-pulse" />
      </div>
    </div>
  );
}
