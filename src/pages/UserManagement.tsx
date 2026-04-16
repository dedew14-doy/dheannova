import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Shield, User, Mail, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', role: 'staf' });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        setFormData({ email: '', password: '', full_name: '', role: 'staf' });
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create user');
      }
    } catch (err) {
      alert('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Hapus user ${email} secara permanen? Akun ini tidak akan bisa login lagi.`)) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-text-dark">User Management</h2>
          <p className="text-text-muted text-[14px]">Kelola hak akses dan akun pengguna sistem.</p>
        </div>
        <button 
          onClick={() => { setFormData({ email: '', password: '', full_name: '', role: 'staf' }); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="text" placeholder="Cari by email atau nama..." className="input-field pl-10" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-hover">
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">User</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider font-center">Status</th>
                <th className="text-right py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-gray">
              {loading && users.length === 0 ? (
                <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic">Memuat data user...</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-bg-gray transition-colors">
                  <td className="py-4 font-bold text-[14px] text-text-dark">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-bg-gray border border-border-gray flex items-center justify-center text-brand-primary">
                           <User size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-[14px] text-text-dark">{u.user_metadata?.full_name || 'No Name'}</p>
                           <p className="text-[12px] text-text-muted flex items-center gap-1 font-medium">
                             {u.email}
                           </p>
                        </div>
                     </div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-1 text-[11px] font-bold rounded uppercase",
                      u.user_metadata?.role === 'admin' ? "bg-red-50 text-red-600 border border-red-100" :
                      u.user_metadata?.role === 'guru' ? "bg-brand-light text-brand-dark border border-brand-primary/10" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {u.user_metadata?.role || 'staf'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-green-600">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Aktif
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleDelete(u.id, u.email)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                       <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border-gray flex items-center justify-between">
                 <div>
                   <h2 className="text-[20px] font-bold text-text-dark">Tambah Akun Baru</h2>
                   <p className="text-text-muted text-[13px] mt-1 font-medium flex items-center gap-1">
                      <Shield size={14} className="text-brand-primary" /> Synced with Supabase Auth
                   </p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-dark p-2">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-text-muted uppercase tracking-widest">Nama Lengkap</label>
                  <input type="text" required className="input-field" value={formData.full_name} onChange={e=>setFormData({...formData, full_name:e.target.value})} placeholder="Contoh: Budi Santoso" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                    <input type="email" required className="input-field" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} placeholder="budi@sekolah.id" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold text-text-muted uppercase tracking-widest">Role</label>
                    <select className="input-field font-bold" value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})}>
                      <option value="admin">Admin</option>
                      <option value="guru">Guru</option>
                      <option value="staf">Tendik</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-text-muted uppercase tracking-widest">Password Sementara</label>
                  <input type="password" required className="input-field" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} placeholder="••••••••" />
                </div>
                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-text-muted bg-bg-gray rounded-lg text-[14px]">Batal</button>
                   <button type="submit" disabled={loading} className="flex-1 py-3 btn-primary text-[14px]">
                     {loading ? 'Mendaftarkan...' : 'Buat Akun'}
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
