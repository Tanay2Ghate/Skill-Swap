import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-xl tracking-tight text-slate-900">SkillSwap</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/matches" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  Find Matches
                </Link>
                <Link to="/swaps" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  My Swaps
                </Link>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <Link to="/profile/me" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary-600">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-medium bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all shadow-sm shadow-primary-500/20 active:scale-95">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
