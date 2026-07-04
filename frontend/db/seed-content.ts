import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { projects, articles, events, users } from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema: { users } });

  console.log('🌱 Iniciando seed de contenido...');

  const adminUser = await db.query.users.findFirst({
    where: eq(users.email, 'admin@sici.edu.pe'),
  });

  if (!adminUser) {
    console.error('❌ Usuario admin no encontrado. Ejecuta db:seed primero.');
    process.exit(1);
  }

  // Projects
  await db.insert(projects).values([
    {
      title: 'Optimización de Algoritmos de IA en Sistemas Embebidos',
      authorId: adminUser.id,
      description: 'Investigación sobre la reducción de latencia en modelos de visión por computadora para microcontroladores.',
      content: '# Optimización de Algoritmos de IA\n\nEste proyecto explora técnicas de cuantización y poda para modelos de Deep Learning...',
      category: 'IA',
      tags: ['IA', 'Sistemas Embebidos', 'Optimización'],
      image: 'https://picsum.photos/seed/ai/800/600',
      likes: 45,
      featured: true,
    },
    {
      title: 'Blockchain para la Trazabilidad Académica',
      authorId: adminUser.id,
      description: 'Implementación de una red privada de blockchain para verificar certificados universitarios.',
      content: '# Blockchain Académico\n\nLa seguridad de los títulos académicos es primordial...',
      category: 'Blockchain',
      tags: ['Blockchain', 'Seguridad', 'Web3'],
      image: 'https://picsum.photos/seed/blockchain/800/600',
      likes: 32,
      featured: true,
    },
  ]);

  console.log('✅ Projects creados');

  // Articles
  await db.insert(articles).values([
    {
      title: 'Análisis de Ciberseguridad en Redes IoT Industriales',
      abstract: 'Este artículo presenta un estudio exhaustivo sobre las vulnerabilidades en protocolos MQTT y CoAP en entornos de manufactura inteligente.',
      content: '# Análisis de Ciberseguridad en Redes IoT Industriales\n\n## Introducción\nEl crecimiento exponencial de la Internet de las Cosas...',
      researchArea: 'Ciberseguridad',
      authorIds: [adminUser.id],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      image: 'https://picsum.photos/seed/cybersecurity/800/1200',
      likes: 120,
    },
    {
      title: 'Optimización de Redes Neuronales para Edge Computing',
      abstract: 'Investigación sobre técnicas de poda y cuantización para ejecutar modelos de visión artificial en dispositivos de bajos recursos.',
      content: '# Optimización de Redes Neuronales para Edge Computing\n\n## Resumen\nLa ejecución de modelos de Deep Learning en el borde...',
      researchArea: 'Inteligencia Artificial',
      authorIds: [adminUser.id],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      image: 'https://picsum.photos/seed/ai-edge/800/1200',
      likes: 85,
    },
  ]);

  console.log('✅ Articles creados');

  // Events
  await db.insert(events).values([
    {
      title: 'CyberHack 2026: SICI Edition',
      description: '48 horas de desarrollo intensivo para crear soluciones de ciberseguridad.',
      eventDate: new Date('2026-05-15T09:00:00Z'),
      eventType: 'hackathon',
      image: 'https://picsum.photos/seed/cyberhack/800/400',
      status: 'upcoming',
    },
    {
      title: 'Webinar: El Futuro de la IA Generativa',
      description: 'Charla magistral sobre los avances de los modelos multimodales.',
      eventDate: new Date('2026-04-20T18:00:00Z'),
      eventType: 'webinar',
      image: 'https://picsum.photos/seed/aiwebinar/800/400',
      status: 'upcoming',
    },
  ]);

  console.log('✅ Events creados');
  console.log('✅ Seed de contenido completado');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
