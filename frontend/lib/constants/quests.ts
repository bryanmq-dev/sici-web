// Códigos de disparador realmente conectados en checkAndProgressQuests(userId, actionType).
// Si se agrega un nuevo call site, agregarlo aquí también o el dropdown de creación de
// misiones quedará desactualizado.
export const QUEST_TRIGGER_TYPES = [
  { code: 'forum_answer_posted', label: 'Publicar una respuesta en el foro' },
  { code: 'project_approved', label: 'Aprobación de un proyecto de investigación' },
  { code: 'article_approved', label: 'Aprobación de un artículo científico' },
] as const;
