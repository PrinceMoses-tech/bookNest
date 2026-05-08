import { Link } from 'react-router-dom';
import { FiBook, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                <FiBook className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold text-white">BookNest</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Discover, explore, and collect books that inspire. Your premium digital bookstore with curated selections.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: FiGithub,  label: 'GitHub' },
                { Icon: FiTwitter, label: 'Twitter' },
                { Icon: FiMail,    label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Browse</h4>
            <ul className="space-y-3 text-sm">
              {[
                ['All Books',      '/browse'],
                ['Fantasy',        '/browse?genre=Fantasy'],
                ['Classic Fiction','/browse?genre=Classic+Fiction'],
                ['Romance',        '/browse?genre=Romance'],
                ['Dystopian',      '/browse?genre=Dystopian+Fiction'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-indigo-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Account</h4>
            <ul className="space-y-3 text-sm">
              {[
                ['Login',     '/login'],
                ['Sign Up',   '/signup'],
                ['My Orders', '/orders'],
                ['Profile',   '/profile'],
                ['Cart',      '/cart'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-indigo-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BookNest. All rights reserved.</p>
          <p>Built with React + MongoDB Atlas</p>
        </div>
      </div>
    </footer>
  );
}
