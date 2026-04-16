import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, UserProfile, Student } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  Info, 
  ChevronDown, 
  Save,
  AlertCircle
} from 'lucide-react';

export default function StudentAttendance() {
  const { profile } = useOutletContext<{ profile: UserProfile }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [selectedKelas, setSelectedKelas] = useState('XII TKJ A');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const classes = ['X TKJ A', 'X TKJ B', 'XI TKJ A', 'XII TKJ A', 'XII DKV', 'XII AKL'];

  useEffect(() => {
    fetchStudents();
  }, [selectedKelas]);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('kelas', selectedKelas)
      .order('name');
    
    if (data) setStudents(data);
    setLoading(false);

    // Initial state: all present
    const initial: Record<string, string> = {};
    data?.forEach(s => initial[s.id] = 'hadir');
    setAttendance(initial);
  }

  const updateStatus = (id: string, status: string) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    
    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      date: today,
      status,
      recorded_by: profile.id
    }));

    try {
      const { error } = await supabase
        .from('student_attendance')
        .insert(records);

      if (error) throw error;
      alert('Absensi berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-text-dark">Absensi Siswa</h2>
          <p className="text-text-muted text-[14px]">Input data kehadiran siswa hari ini.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <select 
                value={selectedKelas} 
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="appearance-none bg-white border border-border-gray rounded-lg px-4 py-2 pr-10 font-bold text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
           </div>
           
           <button 
             onClick={handleSave}
             disabled={saving || students.length === 0}
             className="btn-primary"
           >
             {saving ? 'Menyimpan...' : (
               <>
                 <Save size={18} />
                 <span>Simpan Absensi</span>
               </>
             )}
           </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Cari NIS atau Nama Siswa..." 
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-hover">
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">#</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">NIS</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Nama Lengkap</th>
                <th className="text-center py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-gray">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? filteredStudents.map((s, i) => (
                <tr key={s.id} className="hover:bg-bg-gray transition-colors">
                  <td className="py-4 text-[14px] text-text-muted">{i + 1}</td>
                  <td className="py-4 text-[14px] font-medium text-text-dark">{s.nis}</td>
                  <td className="py-4">
                    <p className="font-bold text-[14px] text-text-dark capitalize">{s.name.toLowerCase()}</p>
                  </td>
                  <td className="py-4">
                     <div className="flex items-center justify-center gap-1.5 p-1 bg-bg-gray rounded-lg border border-border-gray w-fit mx-auto">
                       {[
                         { status: 'hadir', label: 'H', color: 'bg-green-500', tColor: 'text-green-600' },
                         { status: 'izin', label: 'I', color: 'bg-blue-500', tColor: 'text-blue-600' },
                         { status: 'sakit', label: 'S', color: 'bg-yellow-500', tColor: 'text-yellow-600' },
                         { status: 'alfa', label: 'A', color: 'bg-red-500', tColor: 'text-red-600' }
                       ].map(opt => (
                         <button
                           key={opt.status}
                           onClick={() => updateStatus(s.id, opt.status)}
                           className={`w-8 h-8 rounded-md text-[11px] font-black transition-all ${
                             attendance[s.id] === opt.status 
                               ? `${opt.color} text-white` 
                               : `bg-white ${opt.tColor} hover:bg-surface-hover`
                           }`}
                         >
                           {opt.label}
                         </button>
                       ))}
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-text-muted italic text-[14px]">
                    Belum ada data siswa untuk kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
