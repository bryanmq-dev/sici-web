import { getCourses, createCourse, deleteCourse } from '@/lib/actions/courses';
import { getMentors } from '@/lib/actions/mentors';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const [allCourses, mentors] = await Promise.all([getCourses(), getMentors()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Cursos</h1>
        <p className="text-text-secondary">{allCourses.length} cursos registrados</p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Nuevo curso</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createCourse({
              name: String(formData.get('name')),
              description: String(formData.get('description')),
              category: String(formData.get('category') || '') || undefined,
              duration: String(formData.get('duration') || '') || undefined,
              instructorId: String(formData.get('instructorId') || '') || undefined,
            });
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <input name="name" required placeholder="Nombre del curso" className="input" />
          <input name="category" placeholder="Categoría" className="input" />
          <input name="duration" placeholder="Duración (ej. 6 semanas)" className="input" />
          <select name="instructorId" className="input">
            <option value="">Sin instructor asignado</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.userName} — {m.specialty}</option>
            ))}
          </select>
          <textarea name="description" required placeholder="Descripción" rows={3} className="input sm:col-span-2 resize-none" />
          <button type="submit" className="btn-primary sm:col-span-2">Crear curso</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Instructor</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course) => (
                <tr key={course.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{course.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{course.instructorName || 'N/A'}</td>
                  <td className="p-4"><span className="badge badge-secondary">{course.status}</span></td>
                  <td className="p-4">
                    <form action={async () => { 'use server'; await deleteCourse(course.id); }}>
                      <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
