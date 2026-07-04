'use server';

import { db } from '@/db';
import { courses, mentors, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';
import { createCourseSchema, updateCourseSchema } from '@/lib/validations/courses';

export async function getCourses() {
  const allCourses = await db
    .select({
      id: courses.id,
      name: courses.name,
      description: courses.description,
      duration: courses.duration,
      syllabus: courses.syllabus,
      category: courses.category,
      status: courses.status,
      image: courses.image,
      gallery: courses.gallery,
      objective: courses.objective,
      results: courses.results,
      relevantInfo: courses.relevantInfo,
      createdAt: courses.createdAt,
      instructorId: courses.instructorId,
      mentorSpecialty: mentors.specialty,
      instructorName: users.name,
    })
    .from(courses)
    .leftJoin(mentors, eq(courses.instructorId, mentors.id))
    .leftJoin(users, eq(mentors.userId, users.id))
    .orderBy(desc(courses.createdAt));

  return allCourses;
}

export async function getCourseById(id: string) {
  const course = await db
    .select({
      id: courses.id,
      name: courses.name,
      description: courses.description,
      duration: courses.duration,
      syllabus: courses.syllabus,
      category: courses.category,
      status: courses.status,
      image: courses.image,
      gallery: courses.gallery,
      objective: courses.objective,
      results: courses.results,
      relevantInfo: courses.relevantInfo,
      createdAt: courses.createdAt,
      instructorId: courses.instructorId,
      mentorSpecialty: mentors.specialty,
      mentorExperience: mentors.experience,
      instructorName: users.name,
      instructorAvatar: users.avatar,
      mentorUserId: mentors.userId,
    })
    .from(courses)
    .leftJoin(mentors, eq(courses.instructorId, mentors.id))
    .leftJoin(users, eq(mentors.userId, users.id))
    .where(eq(courses.id, id))
    .limit(1);

  return course[0] || null;
}

export async function createCourse(data: z.infer<typeof createCourseSchema>) {
  await requireAdmin();
  const input = createCourseSchema.parse(data);

  await db.insert(courses).values(input);

  revalidatePath('/courses');
  revalidatePath('/mentors');
  revalidatePath('/admin/courses');
}

export async function updateCourse(id: string, data: z.infer<typeof updateCourseSchema>) {
  await requireAdmin();
  const input = updateCourseSchema.parse(data);

  await db.update(courses).set(input).where(eq(courses.id, id));

  revalidatePath('/courses');
  revalidatePath(`/courses/${id}`);
  revalidatePath('/admin/courses');
}

export async function deleteCourse(id: string) {
  await requireAdmin();

  await db.delete(courses).where(eq(courses.id, id));

  revalidatePath('/courses');
  revalidatePath('/admin/courses');
}
