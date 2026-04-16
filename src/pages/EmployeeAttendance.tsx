import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, UserProfile } from '../lib/supabase';
import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Calendar as CalendarIcon, History, UserCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EmployeeAttendance() {
  const { profile } = useOutletContext<{ profile: UserProfile }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    checkTodayAttendance();
    fetchHistory();
    return () => clearInterval(timer);
  }, [profile]);

  async function checkTodayAttendance() {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile.id)
      .eq('date', today);
    
    if (data && data.length > 0) {
      setAlreadyCheckedIn(true);
    }
  }

  async function fetchHistory() {
    if (!profile) return;
    const { data } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile.id)
      .order('date', { ascending: false })
      .limit(5);
    
    if (data) setHistory(data);
  }

  const handleCheckIn = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });

    // In a real app, we'd check GPS coords here
    try {
      const { error } = await supabase
        .from('employee_attendance')
        .insert({
          user_id: profile.id,
          date: today,
          clock_in: time,
          status: 'hadir'
        });

      if (error) throw error;
      setSuccess(true);
      setAlreadyCheckedIn(true);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert('Gagal melakukan absensi. Mohon coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="card text-center py-10">
            <h2 className="text-[14px] font-bold text-text-muted uppercase tracking-widest mb-2">Waktu Saat Ini</h2>
            <div className="text-[48px] font-bold text-brand-primary leading-none mb-1">
              {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <p className="text-[14px] text-text-muted font-medium">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleCheckIn}
                disabled={loading || alreadyCheckedIn}
                className={cn(
                  "w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center transition-all shadow-xl",
                  alreadyCheckedIn 
                    ? "bg-gray-100 border-gray-200 text-gray-400" 
                    : "bg-brand-primary border-brand-light text-white hover:scale-105 active:scale-95"
                )}
              >
                <div className="bg-white/20 p-3 rounded-full mb-2">
                   <UserCheck size={32} />
                </div>
                <span className="font-bold text-[18px]">
                  {alreadyCheckedIn ? 'Sudah Absen' : 'Absen Sekarang'}
                </span>
                {alreadyCheckedIn && history.length > 0 && <span className="text-[12px] opacity-80 mt-1">{history[0].clock_in} WIB</span>}
              </button>
            </div>
          </div>

          <div className="card bg-surface-hover border-dashed">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <MapPin size={24} className="text-brand-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-text-dark">Lokasi Sekolah</h4>
                <p className="text-[12px] text-text-muted">Area SMK Prima Unggul (Radios Presensi)</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold border border-green-200">
                Dalam Radius
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-80 space-y-6">
          <div className="card">
            <h3 className="text-[16px] font-bold text-text-dark mb-6">Status Kehadiran</h3>
            <div className="space-y-4">
               {[
                 { label: 'Hadir Tepat Waktu', val: '18', color: 'text-green-600' },
                 { label: 'Terlambat', val: '2', color: 'text-brand-primary' },
                 { label: 'Izin / Sakit', val: '1', color: 'text-blue-600' },
                 { label: 'Tanpa Keterangan', val: '0', color: 'text-red-600' },
               ].map((s, i) => (
                 <div key={i} className="flex justify-between items-center pb-3 border-b border-bg-gray last:border-0 last:pb-0">
                    <span className="text-[13px] text-text-muted font-medium">{s.label}</span>
                    <span className={cn("font-bold text-[15px]", s.color)}>{s.val}</span>
                 </div>
               ))}
            </div>
            <p className="mt-6 text-[11px] text-text-muted font-medium text-center italic">
              *Statistik bulan ini
            </p>
          </div>

          <div className="bg-text-dark text-white p-6 rounded-xl text-center">
             <h4 className="text-[14px] font-bold mb-1 opacity-80 uppercase tracking-widest leading-none">Poin Disiplin</h4>
             <div className="text-[32px] font-black">98</div>
             <p className="text-[12px] opacity-70 mt-1">Excellent Performance!</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-[16px] font-bold text-text-dark mb-6 px-2">Riwayat Terbaru Mingguan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
               <tr className="border-b border-surface-hover">
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Hari / Tanggal</th>
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Presensi</th>
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-bg-gray">
              {history.length > 0 ? history.map((h, i) => (
                <tr key={h.id} className="hover:bg-bg-gray transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-[14px] text-text-dark">
                      {new Date(h.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  <td className="py-4 font-medium text-[14px] text-text-dark">{h.clock_in} WIB</td>
                  <td className="py-4">
                    <span className="status-badge bg-green-100 text-green-700">Hadir</span>
                  </td>
                  <td className="py-4 text-right">
                       <button className="text-[12px] text-brand-primary font-bold hover:underline">
                          Lihat
                       </button>
                    </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="py-10 text-center text-text-muted italic">Belum ada riwayat absensi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
