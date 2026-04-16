import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileText, UserCheck, GraduationCap, Download, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

function EmployeeRecap() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-[16px] font-bold text-text-dark">Rekap Absensi Karyawan</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border-gray text-text-muted rounded-lg font-bold text-[12px] hover:bg-surface-hover transition-all">
          <Download size={14} /> Export Excel
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-hover">
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Nama</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Hadir</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Izin</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Sakit</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Alfa</th>
                <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-gray">
              {[
                { name: 'Dr. Ahmad Sujadi', h: 22, i: 0, s: 0, a: 0, p: '100%' },
                { name: 'Siti Aminah, M.Pd', h: 20, i: 1, s: 1, a: 0, p: '91%' },
                { name: 'Budi Santoso, S.Kom', h: 21, i: 1, s: 0, a: 0, p: '95%' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-bg-gray transition-colors">
                  <td className="py-4 font-bold text-[14px] text-text-dark">{row.name}</td>
                  <td className="py-4 text-[14px] text-text-muted">{row.h}</td>
                  <td className="py-4 text-[14px] text-text-muted">{row.i}</td>
                  <td className="py-4 text-[14px] text-text-muted">{row.s}</td>
                  <td className="py-4 text-[14px] text-text-muted">{row.a}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-brand-light text-brand-dark font-bold rounded text-[11px]">
                      {row.p}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentRecap() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center px-2">
        <h3 className="text-[16px] font-bold text-text-dark">Rekap Absensi Siswa</h3>
        <div className="flex gap-2">
          <select className="bg-white border border-border-gray rounded-lg px-4 py-2 font-bold text-[12px] text-text-muted">
             <option>XII TKJ A</option>
             <option>XII TKJ B</option>
          </select>
          <button className="btn-primary py-2 px-4 text-[12px]">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="card">
            <p className="text-[12px] font-bold text-text-muted uppercase mb-2">Rata-rata Hadir</p>
            <h3 className="text-[24px] font-bold text-green-600">96.8%</h3>
         </div>
         <div className="card">
            <p className="text-[12px] font-bold text-text-muted uppercase mb-2">Total Absen (Alfa)</p>
            <h3 className="text-[24px] font-bold text-brand-primary">12 Siswa</h3>
         </div>
         <div className="card">
            <p className="text-[12px] font-bold text-text-muted uppercase mb-2">Paling Rajin</p>
            <h3 className="text-[24px] font-bold text-blue-600">XII TKJ A</h3>
         </div>
      </div>

      <div className="card">
         <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
               <tr className="border-b border-surface-hover">
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">NIS</th>
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Nama</th>
                  <th className="text-left py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Persentase</th>
                  <th className="text-right py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-bg-gray">
               {[
                 { nis: '102931', name: 'ADRIAN MAULANA', p: 98 },
                 { nis: '102932', name: 'BELLA PUSPITA', p: 95 },
                 { nis: '102933', name: 'CHANDRA KIRANA', p: 100 },
               ].map((s, i) => (
                 <tr key={i} className="hover:bg-bg-gray transition-colors">
                    <td className="py-4 text-[14px] text-text-muted font-mono">{s.nis}</td>
                    <td className="py-4 text-[14px] font-bold text-text-dark">{s.name}</td>
                    <td className="py-4">
                       <div className="w-40 bg-bg-gray h-1.5 rounded-full">
                          <div className="bg-brand-primary h-full rounded-full" style={{ width: `${s.p}%` }} />
                       </div>
                    </td>
                    <td className="py-4 text-right">
                       <button className="text-[12px] text-brand-primary font-bold hover:underline">
                          Detail
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
        </div>
      </div>
    </div>
  );
}

export default function RecapAttendance() {
  const location = useLocation();
  const isStudent = location.pathname.includes('siswa');

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-[20px] font-bold text-text-dark">Rekap Absensi</h2>
        <p className="text-text-muted text-[14px]">Laporan dan ringkasan data presensi SMK Prima Unggul.</p>
      </div>

      <div className="flex gap-1 p-1 bg-surface-hover w-fit rounded-lg border border-border-gray">
         <Link 
           to="/app/rekap-absensi/karyawan" 
           className={cn(
             "flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-[13px] transition-all",
             !isStudent ? "bg-white text-brand-dark shadow-sm border border-border-gray" : "text-text-muted hover:text-text-dark"
           )}
         >
           <UserCheck size={18} />
           <span>Karyawan</span>
         </Link>
         <Link 
           to="/app/rekap-absensi/siswa" 
           className={cn(
             "flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-[13px] transition-all",
             isStudent ? "bg-white text-brand-dark shadow-sm border border-border-gray" : "text-text-muted hover:text-text-dark"
           )}
         >
           <GraduationCap size={18} />
           <span>Siswa</span>
         </Link>
      </div>

      <div className="mt-8">
        <Routes>
          <Route index element={<EmployeeRecap />} />
          <Route path="karyawan" element={<EmployeeRecap />} />
          <Route path="siswa" element={<StudentRecap />} />
        </Routes>
      </div>
    </div>
  );
}
