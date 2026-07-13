import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMentorshipRequests } from '@/lib/actions/mentorship';
import { getMentors } from '@/lib/actions/mentors';
import MentorshipClient from './MentorshipClient';

export const dynamic = 'force-dynamic';

export default async function MentorshipPage() {
  const requests = await getMentorshipRequests();
  const mentors = await getMentors();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <MentorshipClient requests={requests} mentors={mentors} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
