import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="font-bold text-xl tracking-tight text-white">SkillSwap</span>
            </Link>
            <p className="text-sm max-w-sm">
              Exchange Skills, Not Money. A peer-to-peer skill exchange platform built for the SRM Institute Mini Project.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/matches" className="hover:text-primary-400 transition-colors">Find Matches</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-slate-500">Built for SRM Institute of Science & Technology</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
