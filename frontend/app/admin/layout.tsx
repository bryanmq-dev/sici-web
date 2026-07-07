import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminNav from './AdminNav';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'admin') redirect('/');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-text-primary">SICI Admin</h1>
          <p className="text-xs text-text-muted mt-1">Panel de Control</p>
        </div>
        
        <AdminNav />

        <div className="p-4 border-t border-border space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors rounded-lg">
            <ArrowLeft className="w-4 h-4" />
            Volver al Sitio
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
