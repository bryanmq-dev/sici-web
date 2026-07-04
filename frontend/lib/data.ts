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

export const mentorshipRequests: MentorshipRequest[] = [];

export const events: Event[] = [];

export const challenges: Challenge[] = [];

export const notifications: Notification[] = [];

export const users: UserProfile[] = [
  {
    id: 'u-001',
    name: 'Bryan Mamani',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bryan',
    role: 'Miembro Activo',
    email: 'bryan@sici.edu.pe',
    rank: 'Senior Dev',
    devScore: 1840,
    researchScore: 920,
    bio: 'Desarrollador apasionado por la inteligencia artificial y los sistemas distribuidos. Miembro fundador de SICI, enfocado en llevar la investigación aplicada a soluciones reales para la industria peruana.',
    skills: [
      { name: 'TypeScript', level: 88 },
      { name: 'Python', level: 82 },
      { name: 'React / Next.js', level: 90 },
      { name: 'Machine Learning', level: 74 },
      { name: 'Sistemas Distribuidos', level: 68 },
    ],
    projects: [
      {
        id: 'p-001',
        name: 'Sistema de Detección de Anomalías IoT',
        role: 'Líder Técnico',
        description: 'Plataforma de monitoreo en tiempo real para dispositivos IoT industriales usando ML embebido.',
      },
    ],
    achievements: [
      {
        id: 'ach-001',
        title: 'Primer Hackathon SICI',
        icon: 'Trophy',
        date: '2024-08',
        description: 'Primer lugar en el hackathon interno con el proyecto DataSense.',
      },
      {
        id: 'ach-002',
        title: 'Artículo Publicado',
        icon: 'Book',
        date: '2024-11',
        description: 'Publicación aceptada en el repositorio de investigación SICI.',
      },
    ],
    badges: [
      { id: 'b-001', name: 'Fundador', icon: 'Star', rarity: 'LEGENDARY', unlockedAt: '2023-03' },
      { id: 'b-002', name: 'Hacker', icon: 'Code', rarity: 'EPIC', unlockedAt: '2024-08' },
      { id: 'b-003', name: 'Investigador', icon: 'Book', rarity: 'RARE', unlockedAt: '2024-11' },
      { id: 'b-004', name: 'Mentor', icon: 'Shield', rarity: 'COMMON', unlockedAt: '2025-01' },
    ],
    activeQuests: [
      {
        id: 'q-001',
        title: 'Publica tu primer artículo',
        description: 'Sube un artículo al repositorio de investigación de SICI.',
        reward: { devPoints: 100, researchPoints: 250 },
        status: 'completed',
        category: 'research',
        difficulty: 'MEDIUM',
        progress: 100,
      },
    ],
    articleIds: [],
    incubatorProjectIds: [],
    memberships: [
      { unit: 'Unidad Científica', role: 'Investigador Junior', since: '2023-03' },
      { unit: 'Incubadora SICI', role: 'Desarrollador', since: '2024-01' },
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

export const userProfiles = users;

export interface UserRank {
  id: string;
  name: string;
  devScore: number;
  researchScore: number;
  rank: string;
  avatar: string;
}

export const incubatorProjects: IncubatorProject[] = [];

export const projects: Project[] = [];

export const articles: Article[] = [];

export const mentors: Mentor[] = [];

export const courses: Course[] = [];

export const questions: Question[] = [];

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

export const societyTeam: TeamSection[] = [];

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

export const ranking: UserRank[] = [];
