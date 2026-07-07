import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb, date, uniqueIndex, primaryKey, AnyPgColumn } from 'drizzle-orm/pg-core';

// ============================================================================
// USUARIOS Y AUTENTICACIÓN
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  role: varchar('role', { length: 50 }).notNull().default('student'),
  bio: text('bio'),
  semester: integer('semester'),
  gender: varchar('gender', { length: 10 }), // se setea al asignar un cargo directivo (título dinámico)
  socials: jsonb('socials').default({}),
  // Ciclo de vida de la cuenta: 'postulacion' (recién registrado, no puede loguear) →
  // admin aprueba ('activo') o rechaza ('inactivo', con motivo en statusReason).
  status: varchar('status', { length: 20 }).notNull().default('postulacion'),
  interestArea: varchar('interest_area', { length: 255 }),
  motivation: text('motivation'),
  statusReason: text('status_reason'),
  // Puntaje unificado ("isipoints") — reemplaza los antiguos devScore/researchScore.
  isiPoints: integer('isi_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// AUTH.JS - Tablas necesarias para Auth.js
// ============================================================================

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).primaryKey(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  expires: timestamp('expires').notNull(),
});

// ============================================================================
// CONTENIDO PRINCIPAL
// ============================================================================

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authorId: uuid('author_id').references(() => users.id),
  description: text('description').notNull(),
  content: text('content'),
  category: varchar('category', { length: 100 }),
  tags: text('tags').array().default([]),
  image: varchar('image', { length: 500 }),
  likes: integer('likes').default(0).notNull(),
  featured: boolean('featured').default(false).notNull(),
  // Workflow de aprobación: nace pending, solo visible públicamente cuando approved.
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  impactScore: integer('impact_score').default(0).notNull(),
  supportSlots: integer('support_slots').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectCoAuthors = pgTable('project_co_authors', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('project_co_authors_unique').on(t.projectId, t.userId),
}));

export const projectSupportRequests = pgTable('project_support_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  respondedAt: timestamp('responded_at'),
}, (t) => ({
  unique: uniqueIndex('project_support_requests_unique').on(t.projectId, t.userId),
}));

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  abstract: text('abstract').notNull(),
  content: text('content'),
  researchArea: varchar('research_area', { length: 100 }),
  authorIds: uuid('author_ids').array().default([]),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  image: varchar('image', { length: 500 }),
  likes: integer('likes').default(0).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  // { titulo, introduccion, metodologia, resultados, conclusion }
  execSummary: jsonb('exec_summary').default({}),
  publicationDate: date('publication_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  eventDate: timestamp('event_date').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  image: varchar('image', { length: 500 }),
  link: varchar('link', { length: 500 }),
  location: varchar('location', { length: 255 }),
  status: varchar('status', { length: 50 }).default('upcoming').notNull(),
  appliesToScore: boolean('applies_to_score').default(false).notNull(),
  scoreDescription: varchar('score_description', { length: 255 }),
  scorePoints: integer('score_points'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventParticipants = pgTable('event_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  intent: varchar('intent', { length: 20 }).notNull(),
  evaluationScore: integer('evaluation_score'),
  evaluatedAt: timestamp('evaluated_at'),
  evaluatedBy: uuid('evaluated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('event_participants_unique').on(t.eventId, t.userId, t.intent),
}));

export const eventGalleryImages = pgTable('event_gallery_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  caption: varchar('caption', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// INCUBADORA
// ============================================================================

export const incubatorProjects = pgTable('incubator_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authorId: uuid('author_id').references(() => users.id),
  description: text('description').notNull(),
  content: text('content'),
  // Etapa del pipeline del proyecto (Idea..Lanzado) — distinto del gate de admin (approvalStatus).
  status: varchar('status', { length: 50 }).default('Idea').notNull(),
  approvalStatus: varchar('approval_status', { length: 20 }).default('pending').notNull(),
  categories: text('categories').array().default([]),
  technologies: text('technologies').array().default([]),
  client: varchar('client', { length: 255 }),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const incubatorTeamMembers = pgTable('incubator_team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  incubatorProjectId: uuid('incubator_project_id').notNull().references(() => incubatorProjects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).default('dev').notNull(),
  finalScore: integer('final_score'),
  evaluatedAt: timestamp('evaluated_at'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('incubator_team_members_unique').on(t.incubatorProjectId, t.userId),
}));

export const incubatorJoinRequests = pgTable('incubator_join_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  incubatorProjectId: uuid('incubator_project_id').notNull().references(() => incubatorProjects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  respondedAt: timestamp('responded_at'),
}, (t) => ({
  unique: uniqueIndex('incubator_join_requests_unique').on(t.incubatorProjectId, t.userId),
}));

export const incubatorSuggestions = pgTable('incubator_suggestions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// MENTORÍAS
// ============================================================================

export const mentors = pgTable('mentors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).unique(),
  specialty: varchar('specialty', { length: 255 }).notNull(),
  experience: text('experience'),
  mentorType: varchar('mentor_type', { length: 50 }).notNull(),
  skills: jsonb('skills').default([]),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorshipRequests = pgTable('mentorship_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => users.id),
  mentorId: uuid('mentor_id').references(() => mentors.id),
  topic: varchar('topic', { length: 255 }).notNull(),
  description: text('description').notNull(),
  tags: text('tags').array().default([]),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  // 'open': el creador (studentId) es el líder que abre una mentoría para varios interesados.
  // 'request': solicitud de ayuda 1 a 1 dirigida a un mentor.
  kind: varchar('kind', { length: 20 }).default('request').notNull(),
  approvalStatus: varchar('approval_status', { length: 20 }).default('pending').notNull(),
  syllabusUrl: varchar('syllabus_url', { length: 500 }),
  rating: integer('rating'),
  ratingComment: text('rating_comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorshipCategories = pgTable('mentorship_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const mentorshipCategoryLinks = pgTable('mentorship_category_links', {
  mentorshipId: uuid('mentorship_id').notNull().references(() => mentorshipRequests.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => mentorshipCategories.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.mentorshipId, t.categoryId] }),
}));

export const mentorshipParticipants = pgTable('mentorship_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorshipId: uuid('mentorship_id').notNull().references(() => mentorshipRequests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).default('mentee').notNull(),
  attendanceConfirmed: boolean('attendance_confirmed').default(false).notNull(),
  evaluationScore: integer('evaluation_score'),
  evaluatedAt: timestamp('evaluated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('mentorship_participants_unique').on(t.mentorshipId, t.userId),
}));

// ============================================================================
// CURSOS
// ============================================================================

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  duration: varchar('duration', { length: 100 }),
  instructorId: uuid('instructor_id').references(() => mentors.id),
  syllabus: jsonb('syllabus').default([]),
  category: varchar('category', { length: 100 }),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  image: varchar('image', { length: 500 }),
  gallery: text('gallery').array().default([]),
  objective: text('objective'),
  results: text('results'),
  relevantInfo: text('relevant_info'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('course_enrollments_unique').on(t.courseId, t.userId),
}));

// ============================================================================
// FORO
// ============================================================================

export const forumQuestions = pgTable('forum_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  tags: text('tags').array().default([]),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  featuredAnswerId: uuid('featured_answer_id'),
  isSolved: boolean('is_solved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const forumAnswers = pgTable('forum_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => forumQuestions.id),
  authorId: uuid('author_id').references(() => users.id),
  content: text('content').notNull(),
  images: text('images').array().default([]),
  likes: integer('likes').default(0).notNull(),
  // NULL = respuesta al post original. Si tiene valor, es una respuesta a otra respuesta.
  // El tope de 2 niveles se valida en la action, no acá (ver createForumAnswer).
  parentReplyId: uuid('parent_reply_id').references((): AnyPgColumn => forumAnswers.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// GAMIFICACIÓN
// ============================================================================

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  description: text('description'),
  achievedAt: date('achieved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  icon: varchar('icon', { length: 100 }),
  rarity: varchar('rarity', { length: 50 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  badgeId: uuid('badge_id').notNull().references(() => badges.id),
  count: integer('count').default(1).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
}, (t) => ({
  unique: uniqueIndex('user_badges_unique').on(t.userId, t.badgeId),
}));

export const quests = pgTable('quests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  pointsReward: integer('points_reward').default(0).notNull(),
  // Condición de auto-progreso: se evalúa en lib/quest-engine.ts contra las acciones del usuario.
  // Ej: triggerType='forum_answers_count', triggerThreshold=5.
  triggerType: varchar('trigger_type', { length: 50 }),
  triggerThreshold: integer('trigger_threshold'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userSkills = pgTable('user_skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillName: varchar('skill_name', { length: 100 }).notNull(),
}, (t) => ({
  unique: uniqueIndex('user_skills_unique').on(t.userId, t.skillName),
}));

export const userQuests = pgTable('user_quests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  questId: uuid('quest_id').references(() => quests.id),
  status: varchar('status', { length: 50 }).default('available').notNull(),
  progress: integer('progress').default(0).notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// ORGANIZACIÓN
// ============================================================================

export const societyUnits = pgTable('society_units', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const societyMemberships = pgTable('society_memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  unitId: uuid('unit_id').references(() => societyUnits.id),
  role: varchar('role', { length: 100 }).notNull(),
  since: date('since'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// SISTEMA
// ============================================================================

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// LIKES Y PUNTOS (Fase 0 — fundamentos)
// ============================================================================

// Un like por usuario+recurso, y fuente de verdad para el contador `likes` de
// projects/articles/forum_questions/forum_answers (incremento atómico, ver lib/actions/likes.ts).
export const contentLikes = pgTable('content_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: uuid('target_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  uniqueLike: uniqueIndex('content_likes_user_target_unique').on(t.userId, t.targetType, t.targetId),
}));

// Historial auditable de cada cambio a isiPoints — awardPoints() es la única forma
// sancionada de escribir acá (ver lib/actions/gamification.ts).
export const pointsLedger = pgTable('points_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  reason: varchar('reason', { length: 100 }).notNull(),
  sourceType: varchar('source_type', { length: 50 }),
  sourceId: uuid('source_id'),
  awardedBy: uuid('awarded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
