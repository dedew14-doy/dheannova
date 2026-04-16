import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, LogIn, ChevronRight, School, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  const majors = [
    { title: 'TKJ', desc: 'Teknik Komputer & Jaringan' },
    { title: 'DKV', desc: 'Desain Komunikasi Visual' },
    { title: 'AK', desc: 'Akuntansi' },
    { title: 'BC', desc: 'Broadcasting' },
    { title: 'MPLB', desc: 'Manajemen Perkantoran & Layanan Bisnis' },
    { title: 'BD', desc: 'Bisnis Digital' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-primary rounded-lg text-white">
                <School size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                SMK <span className="text-brand-primary">Prima Unggul</span>
              </span>
            </div>
            <Link to="/login" className="btn-primary">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-brand-light text-brand-primary text-sm font-semibold mb-6">
                Selamat Datang di Portal Akademik
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Membangun Generasi <br />
                <span className="text-brand-primary">Unggul & Berkarakter</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                SMK Prima Unggul berkomitmen untuk memberikan pendidikan berkualitas tinggi dengan kurikulum yang relevan dengan kebutuhan industri masa kini.
              </p>
              <div className="flex gap-4">
                <Link to="/login" className="btn-primary py-3 px-8 text-lg">
                  Mulai Sekarang <ChevronRight size={20} />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 lg:mt-0 relative"
            >
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-brand-light flex items-center justify-center border-8 border-white">
                <img 
                  src="https://picsum.photos/seed/school/800/600" 
                  alt="School Hero" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Alumni Sukses</div>
                  <div className="text-xl font-bold">10,000+</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Majors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">6 Jurusan Unggulan</h2>
            <p className="text-gray-600">Pilih masa depanmu sesuai dengan minat dan bakatmu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majors.map((major, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="card border-none hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-brand-light text-brand-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{major.title}</h3>
                <p className="text-gray-600">{major.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2024 SMK Prima Unggul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
