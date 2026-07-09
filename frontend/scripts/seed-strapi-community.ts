import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Ingesta masiva de posts de comunidad en el Strapi externo (cms.soceisi.com), para las 5
// páginas /comunidad/{area} (ver frontend/lib/cms.ts para el lado de lectura). Autentica como
// admin (no hay API token generado, solo credenciales de super admin) contra /admin/login, y
// usa la API del Content Manager (la misma que usa el panel admin de Strapi por dentro) para
// crear + publicar cada entrada — draftAndPublish está activo en el content-type, así que una
// entrada recién creada NO aparece en la API pública hasta publicarla explícitamente.
//
// Credenciales fuera del código a propósito: STRAPI_ADMIN_EMAIL / STRAPI_ADMIN_PASSWORD se
// leen de variables de entorno, nunca se hardcodean ni se commitean.

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.soceisi.com';
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

const AREAS = ['EPC', 'AWS', 'HACKING', 'SOCIAL', 'SPORTS'] as const;
type Area = (typeof AREAS)[number];

const AREA_LABELS: Record<Area, string> = {
  EPC: 'Programación Competitiva',
  AWS: 'AWS Student Group',
  HACKING: 'Ciberseguridad',
  SOCIAL: 'Voluntariado',
  SPORTS: 'ISI Sports',
};

// Cuántos posts generar por área. 25 por el pedido original — se puede bajar acá para una
// corrida de prueba chica antes de la ingesta completa (ver comentario en runSeed()).
const POSTS_PER_AREA = 25;

async function adminLogin(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Faltan STRAPI_ADMIN_EMAIL / STRAPI_ADMIN_PASSWORD en el entorno.');
  }
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login admin falló (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  const token = json?.data?.token;
  if (!token) throw new Error('Login admin no devolvió token.');
  return token;
}

// Sube una imagen (bajándola primero de picsum.photos, Strapi necesita el archivo real, no
// solo una URL externa) y devuelve el id de media para referenciar en el slider del post.
async function uploadImage(token: string, seed: string, filename: string): Promise<number> {
  const imgRes = await fetch(`https://picsum.photos/seed/${seed}/900/600`);
  if (!imgRes.ok) throw new Error(`No se pudo bajar la imagen placeholder ${seed}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  const form = new FormData();
  form.append('files', new Blob([buffer], { type: 'image/jpeg' }), filename);

  // Sin /api: la ruta pública /api/upload exige permiso de rol/API token, la que usa el
  // propio panel admin (autenticada con el JWT de admin) es /upload a secas — confirmado
  // con una corrida de prueba real contra cms.soceisi.com antes de la ingesta completa.
  const res = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload de imagen falló (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json[0].id;
}

async function createAndPublishPost(
  token: string,
  data: { titulo: string; area: Area; body: string; imageIds: number[] },
): Promise<void> {
  const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::posts-epc.posts-epc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      titulo: data.titulo,
      area: data.area,
      contenido: [{ __component: 'shared.rich-text', body: data.body }],
      images: data.imageIds.length ? [{ __component: 'shared.slider', files: data.imageIds }] : [],
    }),
  });
  if (!createRes.ok) {
    throw new Error(`Crear post falló (${createRes.status}): ${await createRes.text()}`);
  }
  const created = await createRes.json();
  // Strapi v5: el identificador estable para acciones (ej. publish) es documentId, no el id
  // numérico — confirmado porque publish con el id numérico devolvía 404 Document not found.
  const documentId = created?.data?.documentId;
  if (!documentId) throw new Error(`Respuesta de creación sin documentId: ${JSON.stringify(created)}`);

  const publishRes = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::posts-epc.posts-epc/${documentId}/actions/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
  );
  if (!publishRes.ok) {
    throw new Error(`Publicar post ${documentId} falló (${publishRes.status}): ${await publishRes.text()}`);
  }
}

const AREA_TOPICS: Record<Area, string[]> = {
  EPC: [
    'Resumen del último Codeforces Round: problemas y estrategias',
    'Cómo entrenar para la ICPC: plan de 8 semanas',
    'Estructuras de datos que todo competidor debería dominar',
    'Recapitulación del entrenamiento semanal de programación competitiva',
    'Tips para la fase de clasificación regional ICPC',
  ],
  AWS: [
    'Introducción a AWS Lambda para principiantes',
    'Cómo obtener la certificación AWS Cloud Practitioner',
    'Resumen del último AWS Community Day',
    'Arquitecturas serverless: primeros pasos en el cloud',
    'Taller práctico: desplegando tu primera app en AWS',
  ],
  HACKING: [
    'Resumen del CTF interno de la sociedad',
    'Introducción al pentesting web con OWASP ZAP',
    'Cómo empezar en Bug Bounty: primeros pasos',
    'Análisis de una vulnerabilidad reciente y su mitigación',
    'Taller de hardening de servidores Linux',
  ],
  SOCIAL: [
    'Jornada de voluntariado: alfabetización digital en la comunidad',
    'Campaña de donación de equipos tecnológicos reacondicionados',
    'Taller de introducción a la programación para colegios',
    'Resumen de la jornada de responsabilidad social SICI',
    'Voluntariado técnico: apoyo digital a emprendimientos locales',
  ],
  SPORTS: [
    'Resumen del torneo interno de fútbol SICI',
    'Jornada deportiva de integración entre carreras',
    'Torneo de e-sports de la sociedad: crónica del evento',
    'Entrenamiento físico y bienestar para desarrolladores',
    'Resumen del torneo de básquet inter-facultades',
  ],
};

function buildPosts(area: Area) {
  const topics = AREA_TOPICS[area];
  return Array.from({ length: POSTS_PER_AREA }, (_, i) => {
    const topic = topics[i % topics.length];
    const titulo = i < topics.length ? topic : `${topic} — edición ${Math.floor(i / topics.length) + 1}`;
    const body = `## ${titulo}\n\nActividad organizada por el área de **${AREA_LABELS[area]}** de SICI (Sociedad de Investigación, Ciencia e Innovación), UNIVALLE La Paz.\n\nEsta publicación forma parte del contenido de la comunidad ${AREA_LABELS[area]}, compartiendo experiencias, aprendizajes y próximos pasos del área con el resto de la sociedad.\n\n### Detalles\n\n- Organizado por miembros activos del área.\n- Abierto a toda la comunidad de Ingeniería de Sistemas Informáticos.\n- Más actividades próximamente.`;
    return { titulo, area, body, seed: `${area.toLowerCase()}-${i}` };
  });
}

async function runSeed() {
  console.log('🌱 Ingesta de comunidad Strapi — autenticando...');
  const token = await adminLogin();
  console.log('✅ Login admin OK');

  // Pool chico de imágenes reutilizadas entre posts de una misma área (en vez de subir una
  // imagen distinta por cada uno de los 125 posts) — 3 por área, 15 en total.
  const imagePool: Record<Area, number[]> = { EPC: [], AWS: [], HACKING: [], SOCIAL: [], SPORTS: [] };
  for (const area of AREAS) {
    for (let i = 0; i < 3; i++) {
      const id = await uploadImage(token, `${area.toLowerCase()}-cover-${i}`, `${area.toLowerCase()}-${i}.jpg`);
      imagePool[area].push(id);
    }
    console.log(`✅ Imágenes subidas para ${area}: ${imagePool[area].length}`);
  }

  let total = 0;
  for (const area of AREAS) {
    const posts = buildPosts(area);
    for (const [i, post] of posts.entries()) {
      const imageIds = [imagePool[area][i % imagePool[area].length]];
      await createAndPublishPost(token, { titulo: post.titulo, area: post.area, body: post.body, imageIds });
      total += 1;
      if ((i + 1) % 5 === 0) console.log(`  ${area}: ${i + 1}/${posts.length}`);
    }
    console.log(`✅ ${area}: ${posts.length} posts creados y publicados`);
  }

  console.log(`🎉 Ingesta de comunidad completada: ${total} posts en total.`);
}

runSeed().catch((error) => {
  console.error('❌ Error en la ingesta de comunidad Strapi:', error);
  process.exit(1);
});
