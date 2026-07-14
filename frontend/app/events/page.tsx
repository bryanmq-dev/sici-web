import { getEvents, getNextUpcomingEvent, getImpactGalleryImages } from '@/lib/actions/events';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const [events, nextEvent, galleryImages] = await Promise.all([
    getEvents(),
    getNextUpcomingEvent(),
    getImpactGalleryImages(),
  ]);

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <EventsClient events={events} nextEvent={nextEvent} galleryImages={galleryImages} />
        </div>
      </main>
  );
}
