import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);

export default Layout;
