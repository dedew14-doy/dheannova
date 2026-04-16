import { useOutletContext } from 'react-router-dom';
import { UserProfile } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  TrendingUp,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const { profile } = useOutletContext<{ profile: UserProfile }>();

  const stats = [
    { label: 'Siswa Hadir', value: '954', sub: '+12 dari kemarin', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' },
    { label: 'Guru Hadir', value: '42', sub: '98% presensi', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
    { label: 'Staf Hadir', value: '18', sub: 'Semua hadir', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'up' },
    { label: 'Terlambat', value: '5', sub: '-2 dari kemarin', icon: Clock, color: 'text-brand-primary', bg: 'bg-brand-light', trend: 'down' },
  ];

  return (
    <div className="space-y-8">
      <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.slice(0, 3).map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card"
          >
            <p className="text-[12px] text-text-muted font-medium mb-2">{stat.label}</p>
            <h3 className="text-[24px] font-bold text-text-dark">{stat.value}</h3>
            <div className="flex items-center gap-1 text-[11px] font-bold text-green-500 mt-1">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-text-dark">Aktivitas Absensi Terbaru</h3>
              <button className="text-[12px] text-brand-primary font-bold hover:underline">
                Lihat Semua
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-hover">
                    <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Nama / Identitas</th>
                    <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Peran</th>
                    <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Waktu</th>
                    <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-gray">
                  {[
                    { name: 'Ahmad Subarjo', nip: '192837482', role: 'Guru TKJ', time: '07:15 AM', status: 'Hadir' },
                    { name: 'Siti Aminah', nip: '20231011', role: 'Siswa X DKV 1', time: '07:22 AM', status: 'Hadir' },
                    { name: 'Budi Hartono', nip: '192837551', role: 'Tendik', time: '07:45 AM', status: 'Izin (Sakit)' },
                    { name: 'Rina Marlina', nip: '20231045', role: 'Siswa XII BC 2', time: '07:10 AM', status: 'Hadir' },
                  ].map((item, i) => (
                    <tr key={i} className="group hover:bg-bg-gray transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-[14px] text-text-dark">{item.name}</p>
                        <p className="text-[12px] text-text-muted">{item.nip}</p>
                      </td>
                      <td className="py-4 text-[14px] text-text-muted">{item.role}</td>
                      <td className="py-4 text-[14px] text-text-muted">{item.time}</td>
                      <td className="py-4">
                        <span className={cn(
                          "status-badge",
                          item.status.includes('Hadir') ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-[16px] font-bold text-text-dark mb-4">Manajemen User</h3>
            <p className="text-[13px] text-text-muted mb-6">Kelola akses dan akun pengguna SMK Prima Unggul.</p>
            
            <button className="btn-primary w-full py-3 mb-6">
              Tambah User Baru
            </button>

            <div className="pt-6 border-t border-surface-hover space-y-4">
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-muted font-medium">Admin Aktif</span>
                  <span className="text-text-dark font-bold">3</span>
               </div>
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-muted font-medium">Guru Aktif</span>
                  <span className="text-text-dark font-bold">62</span>
               </div>
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-muted font-medium">Tendik Aktif</span>
                  <span className="text-text-dark font-bold">21</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
