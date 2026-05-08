import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';
import { books } from '../data/books';
import BookCard from '../components/BookCard';

const genres = ['All', ...new Set(books.map(b => b.genre))];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

export default function BrowseBooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,      setSearch]      = useState(searchParams.get('q')     || '');
  const [genre,       setGenre]       = useState(searchParams.get('genre') || 'All');
  const [sort,        setSort]        = useState('default');
  const [view,        setView]        = useState('grid');

  useEffect(() => {
    const q = searchParams.get('q');
    const g = searchParams.get('genre');
    if (q) setSearch(q);
    if (g) setGenre(g);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...books];
    if (genre !== 'All') list = list.filter(b => b.genre === genre);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'title')      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [genre, search, sort]);

  const clearSearch = () => {
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Page header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Browse Books
          </motion.h1>
          <p className="text-indigo-100 text-sm">
            {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
            {genre !== 'All' ? ` in ${genre}` : ''}
            {search ? ` for "${search}"` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or author…"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FiX size={15} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="title">Title: A → Z</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            {[{ v: 'grid', Icon: FiGrid }, { v: 'list', Icon: FiList }].map(({ v, Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2.5 flex items-center justify-center transition-colors ${view === v ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                genre === g
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No books found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filter.</p>
              <button onClick={() => { setSearch(''); setGenre('All'); }} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${genre}-${search}-${sort}`}
              initial="hidden" animate="visible" variants={stagger}
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'
                  : 'flex flex-col gap-4'
              }
            >
              {filtered.map(book =>
                view === 'grid' ? (
                  <motion.div key={book.id} variants={fadeUp}>
                    <BookCard book={book} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={book.id}
                    variants={fadeUp}
                    className="flex gap-5 p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-200"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{book.genre}</span>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5 mb-0.5 truncate">{book.title}</h3>
                      <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{book.description}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">${book.price.toFixed(2)}</span>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
