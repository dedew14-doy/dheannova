import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, UserProfile } from '../lib/supabase';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function DashboardLayout({ session }: { session: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) setProfile(data);
      // Fallback if public.users doesn't have the user yet (metadata fallback)
      else if (session.user.user_metadata) {
        setProfile({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name || 'User',
          role: session.user.user_metadata.role || 'staf',
          created_at: session.user.created_at
        });
      }
    }
    fetchProfile();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const role = profile?.role || 'staf';

  const menuGroups = [
    {
      label: 'Main Menus',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/app', roles: ['admin', 'guru', 'staf'] },
        { label: 'Absensi Karyawan', icon: UserCheck, path: '/app/absensi-karyawan', roles: ['admin', 'guru', 'staf'] },
        { label: 'Absensi Siswa', icon: GraduationCap, path: '/app/absensi-siswa', roles: ['admin', 'guru'] },
      ]
    },
    {
      label: 'Laporan',
      items: [
        { label: 'Rekap Absensi', icon: FileText, path: '/app/rekap-absensi', roles: ['admin', 'guru'] },
      ]
    },
    {
      label: 'Master Data',
      items: [
        { label: 'Data Siswa', icon: Users, path: '/app/data-siswa', roles: ['admin'] },
        { label: 'User Management', icon: Settings, path: '/app/user-management', roles: ['admin'] },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-gray flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-border-gray transition-all duration-300 fixed lg:sticky top-0 h-screen z-40 overflow-hidden flex flex-col",
          sidebarOpen ? "w-[260px]" : "w-0 lg:w-20"
        )}
      >
        <div className="p-8 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xl">
            S
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-[16px] font-bold text-text-dark whitespace-nowrap">SMK Prima Unggul</h1>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider whitespace-nowrap">Edu-Admin Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {menuGroups.map((group, gIdx) => {
            const visibleItems = group.items.filter(item => item.roles.includes(role));
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={gIdx} className="mb-4">
                {sidebarOpen && (
                  <div className="text-[11px] font-bold text-text-muted uppercase px-4 py-4 tracking-widest">
                    {group.label}
                  </div>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[14px] font-medium group",
                          isActive 
                            ? "bg-brand-light text-brand-dark" 
                            : "text-text-muted hover:bg-surface-hover"
                        )}
                      >
                        <item.icon size={20} className={cn("shrink-0", isActive ? "text-brand-dark" : "group-hover:scale-110 transition-transform")} />
                        {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 mt-auto border-t border-surface-hover">
            <div className="bg-brand-primary text-white p-5 rounded-xl">
              <p className="text-[11px] font-bold uppercase opacity-80 mb-3 tracking-widest">Program Keahlian</p>
              <ul className="space-y-1.5 list-none">
                {['TKJ', 'DKV', 'AK', 'BC', 'MPLB'].map((major) => (
                  <li key={major} className="text-[12px] opacity-90 border-b border-white/20 pb-1.5 last:border-0 last:pb-0">
                    {major === 'TKJ' && 'Teknik Komputer Jaringan'}
                    {major === 'DKV' && 'Desain Komunikasi Visual'}
                    {major === 'AK' && 'Akuntansi'}
                    {major === 'BC' && 'Broadcasting'}
                    {major === 'MPLB' && 'Manajemen Perkantoran'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[80px] bg-white border-b border-border-gray flex items-center justify-between px-10 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-surface-hover rounded-lg text-text-muted transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:block overflow-hidden">
               <h2 className="text-[20px] font-bold text-text-dark">Admin Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold overflow-hidden">
                {profile?.full_name.charAt(0)}
              </div>
              <span className="font-bold text-sm text-text-dark">{profile?.full_name || 'Super Admin'}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn-logout"
            >
              <span className="hidden sm:inline">Logout</span>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Viewport */}
        <main className="p-10 flex-1 overflow-y-auto">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}
