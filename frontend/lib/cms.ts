const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.soceisi.com';

export const COMMUNITY_AREAS = ['EPC', 'SOCIAL', 'SPORTS', 'HACKING', 'AWS'] as const;
export type CommunityArea = (typeof COMMUNITY_AREAS)[number];

export interface CommunityPost {
  id: number;
  titulo: string;
  area: CommunityArea;
  publishedAt: string | null;
  contenido: { body: string }[];
  images: string[];
}

function resolveMediaUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// Strapi devuelve `images` como una lista de componentes "slider", cada uno con su propio
// `files[]` — se aplana a una sola lista de URLs porque el frontend solo necesita mostrarlas
// todas juntas en un slider, sin distinguir de qué componente vino cada imagen.
function flattenImages(rawImages: unknown): string[] {
  if (!Array.isArray(rawImages)) return [];
  return rawImages.flatMap((slider: any) =>
    (slider?.files || []).map((file: any) => resolveMediaUrl(file.url))
  );
}

// No lanza si Strapi todavía no tiene el permiso público habilitado o no responde — la página
// cae al estado vacío (ComingSoon) en vez de romper con un 500.
export async function getCommunityPosts(area: CommunityArea): Promise<CommunityPost[]> {
  try {
    const query = `filters[area][$eq]=${area}&populate[contenido]=*&populate[images][populate]=files&sort=publishedAt:desc`;
    const res = await fetch(`${STRAPI_URL}/api/posts-epcs?${query}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const data = json?.data;
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      area: item.area,
      publishedAt: item.publishedAt,
      contenido: (item.contenido || []).map((block: any) => ({ body: block.body })),
      images: flattenImages(item.images),
    }));
  } catch {
    return [];
  }
}
