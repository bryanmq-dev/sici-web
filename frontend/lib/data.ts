export interface Project {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  content: string;
  tags: string[];
  date: string;
  likes: number;
  image: string;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  authors: string[];
  authorIds: string[];
  abstract: string;
  content: string;
  researchArea: string;
  date: string;
  likes: number;
  pdfUrl: string;
  image: string;
}

export interface Mentor {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  experience: string;
  type: 'docente' | 'estudiante';
  courseIds: string[];
  skills: { name: string; level: number }[];
}

export interface SyllabusModule {
  title: string;
  lessons: string[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  image: string;
  instructorName: string;
  instructorId: string;
  relevantInfo: string;
  syllabus: SyllabusModule[];
  objective?: string;
  results?: string;
  category: string;
  status: 'active' | 'finished';
  gallery?: string[];
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  authorId: string;
  date: string;
  likes: number;
  views: number;
  answers: Answer[];
  featuredAnswerId?: string;
}

export interface Answer {
  id: string;
  author: string;
  authorId: string;
  content: string;
  likes: number;
  date: string;
  images?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  date: string;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: { devPoints: number; researchPoints: number };
  status: 'available' | 'active' | 'completed';
  category: 'dev' | 'research';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  progress: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlockedAt?: string;
}

export interface MentorshipRequest {
  id: string;
  topic: string;
  description: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'accepted' | 'completed';
  mentorId?: string;
  mentorName?: string;
  date: string;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'hackathon' | 'webinar' | 'workshop' | 'defense';
  image: string;
  link?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: { devPoints: number; researchPoints: number };
  type: 'daily' | 'weekly';
  isCompleted: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  isRead: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  rank: string;
  devScore: number;
  researchScore: number;
  bio: string;
  skills: { name: string; level: number }[];
  projects: { id: string; name: string; role: string; description: string }[];
  achievements: Achievement[];
  badges: Badge[];
  activeQuests: Quest[];
  articleIds: string[];
  incubatorProjectIds: string[];
  memberships: {
    unit: string;
    role: string;
    since: string;
  }[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface TeamMember {
  userId: string;
  name: string;
  role: string;
}

export interface IncubatorProject {
  id: string;
  title: string;
  status: 'Idea' | 'Planificación' | 'Prototipado' | 'En Desarrollo' | 'MVP' | 'Lanzado';
  description: string;
  content?: string;
  author?: string;
  authorId?: string;
  categories: string[];
  client?: string;
  team: TeamMember[];
  image: string;
  technologies: string[];
}

export const mentorshipRequests: MentorshipRequest[] = [
  {
    id: 'mr1',
    topic: 'Optimización de Algoritmos en Rust',
    description: 'Necesito ayuda para mejorar el rendimiento de un motor de búsqueda que estoy desarrollando.',
    studentId: 'u1',
    studentName: 'Alejandro Chipana',
    status: 'pending',
    date: '2026-04-05T10:00:00Z',
    tags: ['Rust', 'Algoritmos', 'Backend']
  },
  {
    id: 'mr2',
    topic: 'Implementación de Smart Contracts en Ethereum',
    description: 'Buscando mentor para revisar la seguridad de un contrato de votación descentralizada.',
    studentId: 'u2',
    studentName: 'Carla Méndez',
    status: 'accepted',
    mentorId: 'm1',
    mentorName: 'Dr. Roberto Gómez',
    date: '2026-04-06T15:30:00Z',
    tags: ['Blockchain', 'Solidity', 'Ethereum']
  }
];

export const events: Event[] = [
  {
    id: 'e1',
    title: 'CyberHack 2026: SICI Edition',
    description: '48 horas de desarrollo intensivo para crear soluciones de ciberseguridad.',
    date: '2026-05-15T09:00:00Z',
    type: 'hackathon',
    image: 'https://picsum.photos/seed/cyberhack/800/400'
  },
  {
    id: 'e2',
    title: 'Webinar: El Futuro de la IA Generativa',
    description: 'Charla magistral sobre los avances de los modelos multimodales.',
    date: '2026-04-20T18:00:00Z',
    type: 'webinar',
    image: 'https://picsum.photos/seed/aiwebinar/800/400'
  }
];

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Revisor de Código',
    description: 'Comenta en 3 respuestas del foro hoy.',
    reward: { devPoints: 50, researchPoints: 10 },
    type: 'daily',
    isCompleted: false
  },
  {
    id: 'c2',
    title: 'Investigador Incansable',
    description: 'Lee y dale like a 5 artículos esta semana.',
    reward: { devPoints: 20, researchPoints: 100 },
    type: 'weekly',
    isCompleted: true
  }
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Nuevo Rango Alcanzado',
    message: '¡Felicidades! Has ascendido a Investigador Senior.',
    type: 'success',
    date: '2026-04-03T10:00:00Z',
    isRead: false
  },
  {
    id: 'n2',
    title: 'Misión Completada',
    message: 'Has terminado la misión "Optimización Backend".',
    type: 'info',
    date: '2026-04-02T15:00:00Z',
    isRead: true
  }
];

export const users: UserProfile[] = [
  {
    id: 'u1',
    name: 'Alejandro Chipana',
    avatar: 'https://picsum.photos/seed/u1/400/400',
    role: 'Lead Fullstack Developer',
    email: 'achipana@sici.edu.pe',
    rank: 'Experto',
    devScore: 2800,
    researchScore: 1200,
    bio: 'Apasionado por la inteligencia artificial aplicada al desarrollo web. Con más de 4 años de experiencia liderando equipos técnicos y desarrollando soluciones escalables con Next.js y Python.',
    skills: [
      { name: 'Next.js', level: 98 },
      { name: 'TypeScript', level: 95 },
      { name: 'Python', level: 90 },
      { name: 'TensorFlow', level: 85 }
    ],
    projects: [
      { id: 'inc1', name: 'EcoTrack IoT', role: 'Lead Developer', description: 'Sistema de monitoreo ambiental en tiempo real.' },
      { id: 'inc3', name: 'Blockchain Credentials', role: 'Consultant', description: 'Certificación digital inmutable.' }
    ],
    achievements: [
      { id: 'a1', title: 'Top Contributor 2023', icon: 'Trophy', date: '2023-12-15', description: 'Reconocimiento por mayor cantidad de aportes al repositorio central.' },
      { id: 'a2', title: 'Innovador del Año', icon: 'Zap', date: '2023-11-20', description: 'Premio a la mejor solución técnica en la Hackathon SICI.' }
    ],
    badges: [
      { id: 'b1', name: 'Early Adopter', icon: 'Zap', rarity: 'RARE', unlockedAt: '2023-01-01' },
      { id: 'b2', name: 'Code Master', icon: 'Code', rarity: 'EPIC', unlockedAt: '2023-06-15' }
    ],
    activeQuests: [
      { id: 'q1', title: 'Optimización de Backend', description: 'Refactorizar el módulo de autenticación para reducir latencia.', reward: { devPoints: 150, researchPoints: 0 }, status: 'active', category: 'dev', difficulty: 'MEDIUM', progress: 65 },
      { id: 'q2', title: 'Revisión de Pares', description: 'Analizar y comentar 2 artículos de investigación nuevos.', reward: { devPoints: 0, researchPoints: 100 }, status: 'available', category: 'research', difficulty: 'EASY', progress: 0 }
    ],
    articleIds: ['2'],
    incubatorProjectIds: ['inc1', 'inc3'],
    memberships: [
      { unit: 'Sociedad Científica UNIVALLE', role: 'Investigador Senior', since: '2022-03' },
      { unit: 'Incubadora de Desarrollo SICI', role: 'Mentor de Arquitectura', since: '2023-01' }
    ],
    socials: { 
      github: 'https://github.com/achipana', 
      linkedin: 'https://linkedin.com/in/achipana',
      website: 'https://achipana.dev'
    }
  },
  {
    id: 'u2',
    name: 'Maria Garcia',
    avatar: 'https://picsum.photos/seed/u2/400/400',
    role: 'Blockchain Architect',
    email: 'mgarcia@sici.edu.pe',
    rank: 'Investigador Senior',
    devScore: 1500,
    researchScore: 2400,
    bio: 'Especialista en arquitecturas descentralizadas y contratos inteligentes. Investigadora activa en protocolos de consenso y escalabilidad en redes Web3.',
    skills: [
      { name: 'Solidity', level: 95 },
      { name: 'Ethereum', level: 92 },
      { name: 'Web3.js', level: 88 },
      { name: 'Go', level: 80 }
    ],
    projects: [
      { id: 'inc2', name: 'EduChain', role: 'Architect', description: 'Plataforma de certificados académicos.' }
    ],
    achievements: [
      { id: 'a3', title: 'Blockchain Expert', icon: 'Shield', date: '2024-01-10', description: 'Certificación avanzada en protocolos de consenso.' }
    ],
    badges: [
      { id: 'b3', name: 'Chain Builder', icon: 'Link', rarity: 'EPIC', unlockedAt: '2023-11-10' }
    ],
    activeQuests: [],
    articleIds: ['3'],
    incubatorProjectIds: ['inc2'],
    memberships: [
      { unit: 'Sociedad Científica UNIVALLE', role: 'Miembro Activo', since: '2023-02' },
      { unit: 'Incubadora de Desarrollo SICI', role: 'Blockchain Architect', since: '2023-05' }
    ],
    socials: { 
      github: 'https://github.com/mgarcia', 
      linkedin: 'https://linkedin.com/in/mgarcia' 
    }
  },
  {
    id: 'u3',
    name: 'Carlos Ruiz',
    avatar: 'https://picsum.photos/seed/u3/400/400',
    role: 'Security Analyst',
    email: 'cruiz@sici.edu.pe',
    rank: 'Investigador',
    devScore: 900,
    researchScore: 1800,
    bio: 'Experto en seguridad ofensiva y análisis de vulnerabilidades en sistemas embebidos e infraestructura crítica.',
    skills: [
      { name: 'Pentesting', level: 90 },
      { name: 'Network Security', level: 92 },
      { name: 'Linux', level: 85 },
      { name: 'Python', level: 80 }
    ],
    projects: [
      { id: 'inc1', name: 'EcoTrack IoT', role: 'Security Lead', description: 'Aseguramiento de nodos LoRaWAN.' }
    ],
    achievements: [
      { id: 'a4', title: 'Security Guardian', icon: 'Lock', date: '2023-10-05', description: 'Detección y mitigación de 5 vulnerabilidades críticas.' }
    ],
    badges: [
      { id: 'b4', name: 'Shield Bearer', icon: 'Shield', rarity: 'RARE', unlockedAt: '2023-09-20' }
    ],
    activeQuests: [],
    articleIds: ['1'],
    incubatorProjectIds: ['inc1'],
    memberships: [
      { unit: 'Sociedad Científica UNIVALLE', role: 'Investigador', since: '2023-06' },
      { unit: 'Incubadora de Desarrollo SICI', role: 'Security Analyst', since: '2023-08' }
    ],
    socials: { 
      linkedin: 'https://linkedin.com/in/cruiz' 
    }
  },
  {
    id: 'u4',
    name: 'Elena Paz',
    avatar: 'https://picsum.photos/seed/u4/400/400',
    role: 'Senior UI/UX Designer',
    email: 'epaz@sici.edu.pe',
    rank: 'Investigador Junior',
    devScore: 1200,
    researchScore: 600,
    bio: 'Diseñadora visual enfocada en interfaces futuristas y sistemas de diseño complejos. Especialista en accesibilidad y prototipado de alta fidelidad.',
    skills: [
      { name: 'Figma', level: 95 },
      { name: 'UI Design', level: 92 },
      { name: 'React', level: 80 },
      { name: 'Tailwind CSS', level: 90 }
    ],
    projects: [
      { id: 'inc1', name: 'EcoTrack IoT', role: 'UI/UX Designer', description: 'Diseño de dashboard de monitoreo.' },
      { id: 'inc2', name: 'EduChain', role: 'Frontend Designer', description: 'Interfaz de verificación de títulos.' }
    ],
    achievements: [
      { id: 'a5', title: 'UX Excellence', icon: 'Star', date: '2023-09-12', description: 'Mejor diseño de interfaz en el concurso regional de apps.' }
    ],
    badges: [
      { id: 'b5', name: 'Pixel Perfect', icon: 'Star', rarity: 'COMMON', unlockedAt: '2023-08-15' }
    ],
    activeQuests: [],
    articleIds: ['1'],
    incubatorProjectIds: ['inc1', 'inc2'],
    memberships: [
      { unit: 'Sociedad Científica UNIVALLE', role: 'Investigador Junior', since: '2023-09' },
      { unit: 'Incubadora de Desarrollo SICI', role: 'UI/UX Designer', since: '2023-10' }
    ],
    socials: { 
      twitter: 'https://twitter.com/epaz', 
      linkedin: 'https://linkedin.com/in/epaz' 
    }
  },
  {
    id: 'd1',
    name: 'Ing. Roberto Carlos',
    avatar: 'https://picsum.photos/seed/d1/400/400',
    role: 'Presidente SICI',
    email: 'rcarlos@sici.edu.pe',
    rank: 'Experto',
    devScore: 3500,
    researchScore: 3200,
    bio: 'Ingeniero de sistemas con amplia experiencia en gestión de proyectos tecnológicos y liderazgo de equipos multidisciplinarios.',
    skills: [
      { name: 'Gestión', level: 95 },
      { name: 'Liderazgo', level: 98 },
      { name: 'Estrategia', level: 90 }
    ],
    projects: [
      { id: 'inc1', name: 'EcoTrack IoT', role: 'Project Manager', description: 'Supervisión general del proyecto.' }
    ],
    achievements: [
      { id: 'a6', title: 'Fundador SICI', icon: 'Medal', date: '2020-05-20', description: 'Liderazgo en la creación y consolidación de la sociedad.' }
    ],
    badges: [
      { id: 'b6', name: 'Legendary Founder', icon: 'Trophy', rarity: 'LEGENDARY', unlockedAt: '2020-05-20' }
    ],
    activeQuests: [],
    articleIds: [],
    incubatorProjectIds: ['inc1', 'inc2', 'inc3'],
    memberships: [
      { unit: 'Sociedad Científica UNIVALLE', role: 'Presidente', since: '2020-05' },
      { unit: 'Incubadora de Desarrollo SICI', role: 'Director General', since: '2021-01' },
      { unit: 'Consejo de Investigación', role: 'Miembro Permanente', since: '2020-05' }
    ],
    socials: { linkedin: 'https://linkedin.com/in/rcarlos' }
  },
  {
    id: 'i1',
    name: 'Ing. Marco Polo',
    avatar: 'https://picsum.photos/seed/i1/400/400',
    role: 'Docente Investigador',
    email: 'mpolo@sici.edu.pe',
    rank: 'Experto',
    devScore: 2800,
    researchScore: 3100,
    bio: 'Docente apasionado por la innovación y el emprendimiento tecnológico. Mentor de múltiples startups exitosas.',
    skills: [
      { name: 'Emprendimiento', level: 95 },
      { name: 'Arquitectura', level: 90 },
      { name: 'Mentoría', level: 98 }
    ],
    projects: [],
    achievements: [
      { id: 'a7', title: 'Mentor Distinguido', icon: 'Star', date: '2023-12-01', description: 'Reconocimiento por la mentoría de 5 proyectos de incubación.' }
    ],
    badges: [
      { id: 'b7', name: 'Guide', icon: 'User', rarity: 'RARE', unlockedAt: '2023-11-01' }
    ],
    activeQuests: [],
    articleIds: [],
    incubatorProjectIds: ['inc1', 'inc2'],
    memberships: [
      { unit: 'Incubadora de Desarrollo SICI', role: 'Docente a Cargo', since: '2021-01' },
      { unit: 'Mentores', role: 'Docente a Cargo', since: '2022-03' }
    ],
    socials: { linkedin: 'https://linkedin.com/in/mpolo' }
  },
  {
    id: 'inv1',
    name: 'Dra. Lucia Mendez',
    avatar: 'https://picsum.photos/seed/inv1/400/400',
    role: 'Directora de Investigaciones',
    email: 'lmendez@sici.edu.pe',
    rank: 'Experto',
    devScore: 1200,
    researchScore: 4500,
    bio: 'Doctora en Ciencias de la Computación, especializada en inteligencia artificial y ética tecnológica.',
    skills: [
      { name: 'Investigación', level: 100 },
      { name: 'IA Ética', level: 95 },
      { name: 'Algoritmos', level: 92 }
    ],
    projects: [],
    achievements: [
      { id: 'a8', title: 'Investigadora Principal', icon: 'Book', date: '2022-03-15', description: 'Liderazgo en 3 proyectos financiados por el CONCYTEC.' }
    ],
    badges: [
      { id: 'b8', name: 'Science Pioneer', icon: 'Microscope', rarity: 'EPIC', unlockedAt: '2022-01-10' }
    ],
    activeQuests: [],
    articleIds: ['2'],
    incubatorProjectIds: [],
    memberships: [
      { unit: 'Investigaciones', role: 'Docente a Cargo', since: '2022-01' }
    ],
    socials: { linkedin: 'https://linkedin.com/in/lmendez' }
  }
];

export const userProfiles = users; // Alias for easier access

export interface UserRank {
  id: string;
  name: string;
  devScore: number;
  researchScore: number;
  rank: string;
  avatar: string;
}

export const incubatorProjects: IncubatorProject[] = [
  {
    id: 'inc1',
    title: 'EcoTrack IoT',
    status: 'En Desarrollo',
    description: 'Sistema de monitoreo ambiental en tiempo real para campus universitarios utilizando sensores de bajo costo y red LoRaWAN.',
    content: '# EcoTrack IoT\n\nEste proyecto busca democratizar el acceso a datos ambientales precisos en entornos universitarios. \n\n## Objetivos\n- Desplegar una red de sensores LoRaWAN.\n- Visualizar datos en tiempo real.\n- Analizar patrones de contaminación sonora y del aire.',
    author: 'Alejandro Chipana',
    authorId: 'u1',
    categories: ['IoT', 'Sostenibilidad', 'Smart City'],
    client: 'Dirección de Infraestructura Universitaria',
    team: [
      { userId: 'u1', name: 'Alejandro Chipana', role: 'Lead Developer' },
      { userId: 'u3', name: 'Carlos Ruiz', role: 'Security Lead' },
      { userId: 'u4', name: 'Elena Paz', role: 'UI/UX Designer' }
    ],
    image: 'https://picsum.photos/seed/ecotrack/1200/800',
    technologies: ['Arduino', 'LoRaWAN', 'React Native', 'Node.js']
  },
  {
    id: 'inc2',
    title: 'EduChain',
    status: 'MVP',
    description: 'Plataforma descentralizada para la emisión y verificación de certificados académicos inmutables.',
    content: '# EduChain\n\nEduChain utiliza la tecnología blockchain para eliminar el fraude en los certificados académicos. \n\n## Características\n- Registro inmutable en Ethereum.\n- Verificación instantánea vía QR.\n- Interfaz amigable para instituciones y estudiantes.',
    author: 'Maria Garcia',
    authorId: 'u2',
    categories: ['Blockchain', 'EdTech', 'Web3'],
    client: 'Secretaría Académica Regional',
    team: [
      { userId: 'u2', name: 'Maria Garcia', role: 'Blockchain Architect' },
      { userId: 'u4', name: 'Elena Paz', role: 'Frontend Designer' }
    ],
    image: 'https://picsum.photos/seed/educhain/1200/800',
    technologies: ['Solidity', 'Ethereum', 'Next.js', 'Ethers.js']
  },
  {
    id: 'inc3',
    title: 'Blockchain Credentials',
    status: 'Planificación',
    description: 'Sistema de certificación digital basado en tecnología blockchain para garantizar la autenticidad e inmutabilidad de los diplomas.',
    content: '# Blockchain Credentials\n\nUn sistema robusto para la gestión de credenciales digitales.\n\n## Visión\nCrear un estándar regional para la validación de competencias profesionales usando IPFS y Smart Contracts.',
    author: 'Alejandro Chipana',
    authorId: 'u1',
    categories: ['Blockchain', 'Security', 'Web3'],
    client: 'Secretaría General',
    team: [
      { userId: 'u1', name: 'Alejandro Chipana', role: 'Consultant' },
      { userId: 'u2', name: 'Maria Garcia', role: 'Architect' }
    ],
    image: 'https://picsum.photos/seed/blockchain/1200/800',
    technologies: ['Solidity', 'Ethereum', 'React', 'IPFS']
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Optimización de Algoritmos de IA en Sistemas Embebidos',
    author: 'Alejandro Chipana',
    authorId: 'u1',
    description: 'Investigación sobre la reducción de latencia en modelos de visión por computadora para microcontroladores.',
    content: '# Optimización de Algoritmos de IA\n\nEste proyecto explora técnicas de cuantización y poda para modelos de Deep Learning...\n\n## Metodología\nUtilizamos TensorFlow Lite para microcontroladores...',
    tags: ['IA', 'Sistemas Embebidos', 'Optimización'],
    date: '2024-03-15',
    likes: 45,
    image: 'https://picsum.photos/seed/ai/800/600',
    category: 'IA',
  },
  {
    id: '2',
    title: 'Blockchain para la Trazabilidad Académica',
    author: 'Maria Garcia',
    authorId: 'u2',
    description: 'Implementación de una red privada de blockchain para verificar certificados universitarios.',
    content: '# Blockchain Académico\n\nLa seguridad de los títulos académicos es primordial...\n\n## Implementación\nUsamos Hyperledger Fabric para la red...',
    tags: ['Blockchain', 'Seguridad', 'Web3'],
    date: '2024-02-20',
    likes: 32,
    image: 'https://picsum.photos/seed/blockchain/800/600',
    category: 'Blockchain',
  },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Análisis de Ciberseguridad en Redes IoT Industriales',
    authors: ['Carlos Ruiz', 'Elena Paz'],
    authorIds: ['u3', 'u4'],
    abstract: 'Este artículo presenta un estudio exhaustivo sobre las vulnerabilidades en protocolos MQTT y CoAP en entornos de manufactura inteligente.',
    content: `
# Análisis de Ciberseguridad en Redes IoT Industriales

## Introducción
El crecimiento exponencial de la Internet de las Cosas (IoT) en el sector industrial ha introducido nuevas superficies de ataque que antes no existían. Los sistemas SCADA tradicionales están siendo reemplazados por dispositivos conectados que a menudo carecen de las medidas de seguridad necesarias.

## Metodología
En este estudio, se desplegó un entorno de pruebas controlado simulando una planta de ensamblaje automatizada. Se utilizaron herramientas de análisis de tráfico para identificar patrones de comunicación y posibles puntos de entrada para ataques de denegación de servicio (DoS) y de hombre en el medio (MITM).

## Resultados
Los resultados indican que el 65% de los dispositivos analizados utilizan configuraciones por defecto y protocolos sin cifrado. Se propone una arquitectura de seguridad basada en segmentación de red y autenticación mutua TLS para mitigar estos riesgos.

## Conclusión
La seguridad en IoT industrial no debe ser una idea de último momento. La implementación de estándares robustos es crítica para la continuidad operativa de las infraestructuras críticas.
    `,
    researchArea: 'Ciberseguridad',
    date: '2024-01-10',
    likes: 120,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    image: 'https://picsum.photos/seed/cybersecurity/800/1200'
  },
  {
    id: '2',
    title: 'Optimización de Redes Neuronales para Edge Computing',
    authors: ['Alejandro Chipana', 'Dr. Roberto Gomez'],
    authorIds: ['u1', 'i1'],
    abstract: 'Investigación sobre técnicas de poda y cuantización para ejecutar modelos de visión artificial en dispositivos de bajos recursos.',
    content: `
# Optimización de Redes Neuronales para Edge Computing

## Resumen
La ejecución de modelos de Deep Learning en el borde (Edge) presenta desafíos significativos debido a las limitaciones de memoria y procesamiento. Este artículo explora cómo la cuantización de pesos puede reducir el tamaño del modelo en un 75% con una pérdida mínima de precisión.

## Técnicas Exploradas
1. **Poda de Pesos:** Eliminación de conexiones neuronales redundantes.
2. **Cuantización de 8 bits:** Conversión de pesos de punto flotante de 32 bits a enteros de 8 bits.
3. **Destilación de Conocimiento:** Entrenamiento de modelos pequeños (estudiantes) a partir de modelos grandes (maestros).

## Conclusiones
Es posible ejecutar inferencia en tiempo real en microcontroladores ARM Cortex-M4 utilizando estas técnicas, abriendo la puerta a aplicaciones de IA en dispositivos desconectados de la nube.
    `,
    researchArea: 'Inteligencia Artificial',
    date: '2024-02-15',
    likes: 85,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    image: 'https://picsum.photos/seed/ai-edge/800/1200'
  },
  {
    id: '3',
    title: 'Protocolos de Consenso en Blockchains de Tercera Generación',
    authors: ['Maria Garcia', 'Valentina Ortiz'],
    authorIds: ['u2', 'u5'],
    abstract: 'Comparativa entre Proof of Stake y Proof of History en términos de escalabilidad y consumo energético.',
    content: `
# Protocolos de Consenso en Blockchains de Tercera Generación

## Introducción
La escalabilidad es el "trilema" de la tecnología blockchain. Este artículo analiza cómo los nuevos protocolos de consenso intentan resolver este problema sin sacrificar la descentralización o la seguridad.

## Análisis Comparativo
Se analizan los protocolos utilizados en redes como Solana, Cardano y Ethereum 2.0. Se mide el rendimiento en transacciones por segundo (TPS) y el costo energético por bloque validado.

## Resultados
Los protocolos de Proof of History muestran una ventaja significativa en TPS, mientras que Proof of Stake sigue siendo el estándar para la seguridad económica distribuida.
    `,
    researchArea: 'Blockchain',
    date: '2024-03-05',
    likes: 210,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    image: 'https://picsum.photos/seed/blockchain-research/800/1200'
  }
];

export const mentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Roberto Gomez',
    photo: 'https://picsum.photos/seed/docente1/400/400',
    specialty: 'Machine Learning & Data Science',
    experience: '15 años en investigación académica y consultoría industrial.',
    type: 'docente',
    courseIds: ['c1'],
    skills: [
      { name: 'Deep Learning', level: 95 },
      { name: 'Python', level: 90 },
      { name: 'Data Science', level: 88 }
    ],
  },
  {
    id: 'm2',
    name: 'MSc. Elena Paz',
    photo: 'https://picsum.photos/seed/docente2/400/400',
    specialty: 'Ciberseguridad & Redes',
    experience: 'Especialista en seguridad de la información con 10 años de trayectoria.',
    type: 'docente',
    courseIds: ['c2'],
    skills: [
      { name: 'Pentesting', level: 92 },
      { name: 'Network Security', level: 94 },
      { name: 'Cryptography', level: 85 }
    ],
  },
  {
    id: 'm3',
    name: 'Alejandro Chipana',
    photo: 'https://picsum.photos/seed/estudiante1/400/400',
    specialty: 'Fullstack Development & AI',
    experience: 'Estudiante de 9no semestre, ganador de múltiples hackathons.',
    type: 'estudiante',
    courseIds: ['c3', 'c5'],
    skills: [
      { name: 'React/Next.js', level: 98 },
      { name: 'Node.js', level: 90 },
      { name: 'AI Integration', level: 85 }
    ],
  },
  {
    id: 'm4',
    name: 'Maria Garcia',
    photo: 'https://picsum.photos/seed/estudiante2/400/400',
    specialty: 'Blockchain & Web3',
    experience: 'Investigadora en tecnologías descentralizadas y smart contracts.',
    type: 'estudiante',
    courseIds: ['c4'],
    skills: [
      { name: 'Solidity', level: 94 },
      { name: 'Web3.js', level: 88 },
      { name: 'Smart Contracts', level: 92 }
    ],
  },
];

export const courses: Course[] = [
  {
    id: 'c1',
    name: 'Fundamentos de Deep Learning',
    description: 'Aprende las bases de las redes neuronales y cómo implementarlas desde cero.',
    duration: '40 horas',
    image: 'https://picsum.photos/seed/course1/800/450',
    instructorName: 'Dr. Roberto Gomez',
    instructorId: 'm1',
    relevantInfo: 'Incluye certificación oficial de la SICI y acceso a laboratorios de GPU.',
    syllabus: [
      { title: 'Introducción a las Redes Neuronales', lessons: ['Conceptos básicos', 'Perceptrón', 'Backpropagation'] },
      { title: 'Funciones de Activación y Optimización', lessons: ['ReLU, Sigmoid, Tanh', 'Gradiente Descendente', 'Adam Optimizer'] },
      { title: 'Redes Neuronales Convolucionales (CNN)', lessons: ['Capas de Convolución', 'Pooling', 'Arquitecturas famosas'] },
    ],
    objective: 'Aprender las bases de las redes neuronales y cómo implementarlas desde cero.',
    results: 'Capacidad para diseñar y entrenar modelos de Deep Learning para visión artificial.',
    category: 'Inteligencia Artificial',
    status: 'active'
  },
  {
    id: 'c2',
    name: 'Hacking Ético y Seguridad Ofensiva',
    description: 'Domina las técnicas de penetración y protege infraestructuras críticas.',
    duration: '35 horas',
    image: 'https://picsum.photos/seed/course2/800/450',
    instructorName: 'MSc. Elena Paz',
    instructorId: 'm2',
    relevantInfo: 'Laboratorios prácticos en entornos controlados de simulación de ataques.',
    syllabus: [
      { title: 'Fases del Pentesting', lessons: ['Reconocimiento', 'Escaneo', 'Ganar acceso'] },
      { title: 'Explotación de Sistemas', lessons: ['Metasploit', 'Payloads', 'Post-explotación'] },
    ],
    objective: 'Dominar técnicas de penetración ética.',
    results: 'Habilidad para realizar auditorías de seguridad ofensiva.',
    category: 'Ciberseguridad',
    status: 'finished',
    gallery: [
      'https://picsum.photos/seed/course2_1/800/600',
      'https://picsum.photos/seed/course2_2/800/600',
      'https://picsum.photos/seed/course2_3/800/600',
      'https://picsum.photos/seed/course2_4/800/600'
    ]
  },
  {
    id: 'c3',
    name: 'Desarrollo de Aplicaciones con Next.js 15',
    description: 'Construye aplicaciones web modernas, rápidas y escalables con el App Router.',
    duration: '30 horas',
    image: 'https://picsum.photos/seed/course3/800/450',
    instructorName: 'Alejandro Chipana',
    instructorId: 'm3',
    relevantInfo: 'Enfoque 100% práctico basado en proyectos reales del mundo laboral.',
    syllabus: [
      { title: 'Fundamentos de React y Next.js', lessons: ['App Router', 'Server Components', 'Client Components'] },
      { title: 'Data Fetching', lessons: ['Server Actions', 'Suspense', 'Streaming'] },
    ],
    objective: 'Construir aplicaciones web modernas y escalables.',
    results: 'Desarrollo de una aplicación fullstack con Next.js 15.',
    category: 'Desarrollo Web',
    status: 'active'
  },
  {
    id: 'c4',
    name: 'Smart Contracts con Solidity',
    description: 'Aprende a programar contratos inteligentes seguros en la red de Ethereum.',
    duration: '25 horas',
    image: 'https://picsum.photos/seed/course4/800/450',
    instructorName: 'Maria Garcia',
    instructorId: 'm4',
    relevantInfo: 'Desarrollo de una DApp completa desde el frontend hasta el contrato.',
    syllabus: [
      { title: 'Introducción a Blockchain', lessons: ['Ethereum', 'EVM', 'Gas'] },
      { title: 'Sintaxis de Solidity', lessons: ['Variables', 'Funciones', 'Mappings'] },
    ],
    objective: 'Programar contratos inteligentes seguros.',
    results: 'Despliegue de una DApp en una testnet.',
    category: 'Blockchain',
    status: 'active'
  },
  {
    id: 'c5',
    name: 'Laravel Básico – Intermedio: Desarrollo Web Profesional con PHP',
    description: 'Capacitar a los participantes en el desarrollo de aplicaciones web utilizando el framework Laravel mediante la construcción de un proyecto real.',
    duration: '10 clases (20 horas)',
    image: 'https://picsum.photos/seed/laravel/800/450',
    instructorName: 'Alejandro Chipana',
    instructorId: 'm3',
    relevantInfo: 'Requisitos: Conocimientos básicos de PHP, HTML, CSS, JS y bases de datos.',
    objective: 'Capacitar a los participantes en el desarrollo de aplicaciones web utilizando el framework Laravel mediante la construcción de un proyecto real.',
    results: 'Al finalizar el curso, los participantes habrán desarrollado un sistema web funcional con autenticación de usuarios, operaciones CRUD completas, generación de documentos PDF, códigos QR y un panel administrativo moderno.',
    category: 'Desarrollo Web',
    status: 'active',
    syllabus: [
      {
        title: 'Módulo 1: Fundamentos de Laravel',
        lessons: [
          'Instalación y configuración de Laravel',
          'Estructura del proyecto',
          'Arquitectura MVC',
          'Rutas, controladores y vistas'
        ]
      },
      {
        title: 'Módulo 2: CRUD Básico',
        lessons: [
          'Configuración de base de datos',
          'Migraciones',
          'Modelos con Eloquent',
          'Operaciones CRUD'
        ]
      },
      {
        title: 'Módulo 3: Proyecto Real',
        lessons: [
          'Sistema de matriculación',
          'Gestión de estudiantes',
          'Generación de reportes PDF',
          'Generación de códigos QR'
        ]
      },
      {
        title: 'Módulo 4: Autenticación',
        lessons: [
          'Laravel UI',
          'Sistema de login y registro',
          'Personalización del flujo de autenticación'
        ]
      },
      {
        title: 'Módulo 5: Panel Administrativo',
        lessons: [
          'Instalación de Filament',
          'Creación de panel administrativo',
          'Recursos CRUD automáticos'
        ]
      }
    ],
  },
];

export const questions: Question[] = [
  {
    id: 'q1',
    title: '¿Cómo implementar WebSockets en Next.js 15?',
    description: 'Estoy teniendo problemas con la integración de Socket.io en las nuevas rutas de App Router. ¿Alguien tiene un ejemplo funcional?',
    tags: ['Next.js', 'WebSockets', 'React'],
    author: 'Juan Perez',
    authorId: 'u1',
    date: '2024-03-18',
    likes: 12,
    views: 450,
    answers: [
      {
        id: 'a1',
        author: 'DevExpert',
        authorId: 'u2',
        content: 'Para Next.js 15, te recomiendo usar un servidor Express personalizado o una ruta de API específica...',
        likes: 8,
        date: '2024-03-19',
        images: ['https://picsum.photos/seed/socket/800/600']
      },
    ],
    featuredAnswerId: 'a1'
  },
  {
    id: 'q2',
    title: 'Error de CORS al conectar con API de Laravel',
    description: 'He configurado el middleware de CORS en Laravel pero sigo recibiendo errores al intentar hacer peticiones desde mi frontend en Next.js.',
    tags: ['Laravel', 'CORS', 'API'],
    author: 'Maria Gomez',
    authorId: 'u2',
    date: '2024-03-20',
    likes: 5,
    views: 230,
    answers: [],
  },
  {
    id: 'q3',
    title: 'Mejores prácticas para seguridad en Smart Contracts',
    description: '¿Cuáles son los ataques más comunes que debo prevenir al escribir contratos en Solidity? He oído hablar de reentrancy.',
    tags: ['Solidity', 'Blockchain', 'Security'],
    author: 'Carlos Ruiz',
    authorId: 'u3',
    date: '2024-03-21',
    likes: 24,
    views: 890,
    answers: [
      {
        id: 'a2',
        author: 'CryptoGuard',
        authorId: 'u2',
        content: 'El ataque de reentrancy es clásico. Usa el patrón Checks-Effects-Interactions para prevenirlo.',
        likes: 15,
        date: '2024-03-22',
      }
    ],
  },
  {
    id: 'q4',
    title: '¿Cómo optimizar imágenes en Next.js sin usar el componente Image?',
    description: 'Por razones de diseño necesito usar etiquetas img estándar pero quiero mantener algo de optimización. ¿Es posible?',
    tags: ['Next.js', 'Performance', 'Images'],
    author: 'Elena Paz',
    authorId: 'u4',
    date: '2024-03-22',
    likes: -2,
    views: 120,
    answers: [],
  }
];

export interface TeamMemberInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  type: 'docente' | 'estudiante' | 'directivo';
}

export interface TeamSection {
  title: string;
  members: TeamMemberInfo[];
}

export const societyTeam: TeamSection[] = [
  {
    title: 'Directiva de la Sociedad',
    members: [
      { id: 'd1', name: 'Ing. Roberto Carlos', role: 'Presidente', avatar: 'https://picsum.photos/seed/d1/400/400', type: 'directivo' },
      { id: 'd2', name: 'Lic. Ana Maria', role: 'Vicepresidente', avatar: 'https://picsum.photos/seed/d2/400/400', type: 'directivo' },
      { id: 'd3', name: 'Carlos Mendez', role: 'Secretario de Actas', avatar: 'https://picsum.photos/seed/d3/400/400', type: 'directivo' },
      { id: 'd4', name: 'Luis Fernando', role: 'Secretario de Deportes', avatar: 'https://picsum.photos/seed/d4/400/400', type: 'directivo' },
      { id: 'd5', name: 'Sofia Rodriguez', role: 'Secretario de Relaciones', avatar: 'https://picsum.photos/seed/d5/400/400', type: 'directivo' },
      { id: 'd6', name: 'Mateo Vargas', role: 'Vocal 1', avatar: 'https://picsum.photos/seed/d6/400/400', type: 'directivo' },
      { id: 'd7', name: 'Valentina Ortiz', role: 'Vocal 2', avatar: 'https://picsum.photos/seed/d7/400/400', type: 'directivo' },
    ]
  },
  {
    title: 'Incubadora de Desarrollo',
    members: [
      { id: 'i1', name: 'Ing. Marco Polo', role: 'Docente a Cargo', avatar: 'https://picsum.photos/seed/i1/400/400', type: 'docente' },
      { id: 'u1', name: 'Alejandro Chipana', role: 'Estudiante a Cargo', avatar: 'https://picsum.photos/seed/u1/400/400', type: 'estudiante' },
      { id: 'u3', name: 'Carlos Ruiz', role: 'Miembro', avatar: 'https://picsum.photos/seed/u3/400/400', type: 'estudiante' },
      { id: 'u4', name: 'Elena Paz', role: 'Miembro', avatar: 'https://picsum.photos/seed/u4/400/400', type: 'estudiante' },
    ]
  },
  {
    title: 'Mentores',
    members: [
      { id: 'm1', name: 'Dr. Roberto Gomez', role: 'Docente a Cargo', avatar: 'https://picsum.photos/seed/docente1/400/400', type: 'docente' },
      { id: 'm3', name: 'Alejandro Chipana', role: 'Estudiante a Cargo', avatar: 'https://picsum.photos/seed/estudiante1/400/400', type: 'estudiante' },
      { id: 'm4', name: 'Maria Garcia', role: 'Miembro', avatar: 'https://picsum.photos/seed/estudiante2/400/400', type: 'estudiante' },
    ]
  },
  {
    title: 'Investigaciones',
    members: [
      { id: 'inv1', name: 'Dra. Lucia Mendez', role: 'Docente a Cargo', avatar: 'https://picsum.photos/seed/inv1/400/400', type: 'docente' },
      { id: 'u2', name: 'Maria Garcia', role: 'Estudiante a Cargo', avatar: 'https://picsum.photos/seed/u2/400/400', type: 'estudiante' },
      { id: 'u1', name: 'Alejandro Chipana', role: 'Miembro', avatar: 'https://picsum.photos/seed/u1/400/400', type: 'estudiante' },
    ]
  }
];

export const getDevRank = (points: number) => {
  if (points >= 3001) return { name: 'Gran Arquitecto', color: 'text-primary' };
  if (points >= 2001) return { name: 'Maestro de Forja', color: 'text-primary/80' };
  if (points >= 1001) return { name: 'Arquitecto', color: 'text-secondary' };
  if (points >= 501) return { name: 'Constructor', color: 'text-secondary/70' };
  return { name: 'Novato', color: 'text-secondary/50' };
};

export const getResearchRank = (points: number) => {
  if (points >= 3001) return { name: 'Eminencia', color: 'text-primary' };
  if (points >= 2001) return { name: 'Erudito', color: 'text-primary/80' };
  if (points >= 1001) return { name: 'Académico', color: 'text-secondary' };
  if (points >= 501) return { name: 'Investigador', color: 'text-secondary/70' };
  return { name: 'Aspirante', color: 'text-secondary/50' };
};

export const ranking: UserRank[] = users.map(u => ({
  id: u.id,
  name: u.name,
  devScore: u.devScore,
  researchScore: u.researchScore,
  rank: u.rank,
  avatar: u.avatar
}));
