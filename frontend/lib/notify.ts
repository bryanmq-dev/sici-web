import { db } from '@/db';
import { notifications } from '@/db/schema';

// Helper interno para notificaciones disparadas por el sistema (aprobaciones, puntos, etc).
// No es una server action — no tiene guard de sesión propio, se invoca desde otras actions
// que ya validaron quién puede disparar el evento que genera la notificación.
export async function notifyUser(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  await db.insert(notifications).values({ userId, title, message, type });
}
