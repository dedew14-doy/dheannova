import React, { useState, useEffect } from 'react';
import { supabase, Student } from '../lib/supabase';
import { Plus, Search, Edit2, Trash2, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nis: '', name: '', kelas: 'XII TKJ A' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const { data } = await supabase.from('students').select('*').order('nis');
    if (data) setStudents(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await supabase.from('students').update(formData).eq('id', editingId);
      } else {
        await supabase.from('students').insert(formData);
      }
      setShowModal(false);
      setFormData({ nis: '', name: '', kelas: 'XII TKJ A' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert('Error saving student');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Student) => {
    setFormData({ nis: s.nis, name: s.name, kelas: s.kelas });
    setEditingId(s.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data siswa ini?')) return;
    await supabase.from('students').delete().eq('id', id);
    fetchStudents();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Data Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola data seluruh siswa SMK Prima Unggul.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setEditingId(null); setFormData({ nis: '', name: '', kelas: 'XII TKJ A' }); setShowModal(true); }}
            className="btn-primary"
          >
            <Plus size={18} />
            Tambah Siswa
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Cari NIS atau Nama Siswa..." className="input-field pl-10" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50">
             <Filter size={18} /> Filter
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">NIS</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4 font-mono text-sm">{s.nis}</td>
                  <td className="px-6 py-4 font-bold text-sm">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-brand-light text-brand-primary text-[10px] font-black rounded-lg uppercase">
                      {s.kelas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(s)} className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors">
                          <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 bg-brand-primary text-white">
                 <h2 className="text-2xl font-bold">{editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
                 <p className="text-white/80 text-sm mt-1">Lengkapi informasi siswa di bawah ini.</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">NIS</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        required 
                        value={formData.nis}
                        onChange={(e) => setFormData({...formData, nis: e.target.value})}
                      />
                   </div>
                   <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kelas</label>
                      <select 
                        className="input-field"
                        value={formData.kelas}
                        onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                      >
                         <option>X TKJ A</option>
                         <option>XI TKJ A</option>
                         <option>XII TKJ A</option>
                         <option>XII DKV</option>
                      </select>
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nama Lengkap</label>
                   <input 
                    type="text" 
                    className="input-field" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                </div>
                <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors">Batal</button>
                   <button type="submit" disabled={loading} className="flex-1 py-3 btn-primary shadow-lg shadow-brand-primary/20">
                     {loading ? 'Menyimpan...' : 'Simpan Data'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
