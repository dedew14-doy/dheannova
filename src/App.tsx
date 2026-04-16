import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import Home from './pages/Home';
import EmployeeAttendance from './pages/EmployeeAttendance';
import StudentAttendance from './pages/StudentAttendance';
import RecapAttendance from './pages/RecapAttendance';
import StudentData from './pages/StudentData';
import UserManagement from './pages/UserManagement';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={session ? <Navigate to="/app" /> : <LoginPage />} />
        
        <Route path="/app" element={session ? <DashboardLayout session={session} /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
          <Route path="absensi-siswa" element={<StudentAttendance />} />
          <Route path="rekap-absensi/*" element={<RecapAttendance />} />
          <Route path="data-siswa" element={<StudentData />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
