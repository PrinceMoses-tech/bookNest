import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiStar, FiBook, FiUsers, FiAward,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { books } from '../data/books';
import BookCard from '../components/BookCard';

const CATEGORIES = [
  { genre: 'Classic Fiction',      emoji: '📚', from: 'from-amber-50  dark:from-amber-950/30', border: 'border-amber-200  dark:border-amber-900/50'  },
  { genre: 'Fantasy',              emoji: '🧙', from: 'from-violet-50 dark:from-violet-950/30', border: 'border-violet-200 dark:border-violet-900/50' },
  { genre: 'Dystopian Fiction',    emoji: '🌆', from: 'from-slate-50  dark:from-slate-800/30',  border: 'border-slate-200  dark:border-slate-700/50'  },
  { genre: 'Romance',              emoji: '💕', from: 'from-rose-50   dark:from-rose-950/30',   border: 'border-rose-200   dark:border-rose-900/50'   },
  { genre: 'Coming of Age',        emoji: '🌱', from: 'from-emerald-50 dark:from-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-900/50' },
  { genre: 'Adventure',            emoji: '⚡', from: 'from-sky-50    dark:from-sky-950/30',    border: 'border-sky-200    dark:border-sky-900/50'    },
  { genre: 'Philosophical Fiction',emoji: '💭', from: 'from-indigo-50 dark:from-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-900/50' },
];

const STATS = [
  { icon: FiBook,  value: '1,000+', label: 'Books Available' },
  { icon: FiUsers, value: '50K+',   label: 'Happy Readers'  },
  { icon: FiStar,  value: '4.9',    label: 'Avg Rating'     },
  { icon: FiAward, value: '100%',   label: 'Satisfaction'   },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

export default function HomePage() {
  const featured  = books.slice(0, 4);
  const trending  = books.slice(3);
  const scrollRef = useRef(null);
  const navigate  = useNavigate();

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center overflow-hidden">
        {/* decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        {/* grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/15 text-indigo-300 rounded-full text-sm font-medium mb-8 border border-indigo-500/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                New arrivals every week
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight"
            >
              Your Library,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore curated books — from timeless classics to modern bestsellers.
              Find your next favourite story today.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow duration-300 flex items-center gap-2"
                >
                  Browse Books <FiArrowRight />
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 bg-white/10 text-white border border-white/15 rounded-xl font-semibold text-base backdrop-blur-sm hover:bg-white/15 transition-all duration-200"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-xl mx-auto"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-1.5">
                    <Icon className="text-indigo-400" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Browse by genre</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-100">Find Your Genre</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                View all <FiArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
          >
            {CATEGORIES.map(({ genre, emoji, from, border }) => {
              const count = books.filter(b => b.genre === genre).length;
              return (
                <motion.div key={genre} variants={fadeUp}>
                  <Link
                    to={`/browse?genre=${encodeURIComponent(genre)}`}
                    className={`flex flex-col items-center p-4 rounded-2xl border bg-gradient-to-b ${from} ${border} hover:scale-105 active:scale-95 transition-transform duration-200 text-center cursor-pointer`}
                  >
                    <span className="text-2xl mb-2">{emoji}</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight line-clamp-2">{genre}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{count} book{count !== 1 ? 's' : ''}</p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Books ───────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Hand-picked</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-100">Featured Books</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                All books <FiArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featured.map(book => (
              <motion.div key={book.id} variants={fadeUp}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trending – horizontal scroll ─────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">🔥 Popular now</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-100">Trending Books</motion.h2>
            </div>
            <motion.div variants={fadeUp} className="flex gap-2">
              {[{ dir: -1, Icon: FiChevronLeft }, { dir: 1, Icon: FiChevronRight }].map(({ dir, Icon }) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  <Icon size={16} />
                </button>
              ))}
            </motion.div>
          </motion.div>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
          >
            {trending.map(book => (
              <div key={book.id} className="min-w-[190px] max-w-[190px]">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-14 md:py-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Reading Today</h2>
              <p className="text-indigo-100 mb-8 max-w-md mx-auto text-base">
                Join thousands of book lovers. Create a free account and dive into your next great read.
              </p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Free Account
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
