import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const navigation = [
    { name: 'News', href: '/news' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Stats', href: '/stats' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-yellow-500 bg-blue-900/95 backdrop-blur supports-[backdrop-filter]:bg-blue-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src="/tuskers-logo.png" 
            alt="Tuskers CC Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-yellow-500">Tuskers CC</h1>
            <p className="text-sm text-blue-300 font-medium">Est. 2022</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 mr-auto ml-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium uppercase transition-colors ${
                isActive(item.href)
                  ? 'text-yellow-500'
                  : 'text-white hover:text-yellow-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium uppercase transition-colors ${
                isActive('/admin')
                  ? 'text-yellow-500'
                  : 'text-white hover:text-yellow-500'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-yellow-500">
                  <User className="w-4 h-4 mr-2" />
                  {user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-blue-800 border-blue-700">
                <DropdownMenuItem
                  onClick={logout}
                  className="text-white hover:bg-blue-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin">
              <Button variant="ghost" className="text-white hover:text-yellow-500 border border-yellow-500">
                Admin Login
              </Button>
            </Link>
          )}

          <Link href="/registration">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              Season Registration
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800">
          <div className="container mx-auto py-3 px-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="text-white hover:text-yellow-500 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="text-white hover:text-yellow-500 w-full justify-start">
                    Admin Login
                  </Button>
                </Link>
              )}

              <Link href="/registration" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-2">
                  Season Registration
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}