import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button } from '~/components/ui/button';
import { BookA, ChefHat, MessageCircleQuestion, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Nav Links component to avoid repetition
  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <NavLink to="/faq" onClick={onClick}>
        <Button variant="ghost" className="flex items-center w-full justify-start">
          <MessageCircleQuestion />
          <span className={`${isActive('/faq') ? 'border-black border-b' : ''} ml-2`}>FAQ</span>
        </Button>
      </NavLink>
      <NavLink to="/about" onClick={onClick}>
        <Button variant="ghost" className="flex items-center w-full justify-start">
          <BookA />
          <span className={`${isActive('/about') ? 'border-black border-b' : ''} ml-2`}>About</span>
        </Button>
      </NavLink>
    </>
  );

  return (
    <nav className="backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-third" />
            <span className="text-2xl font-bold text-gray-900">Munchora</span>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <NavLink to="/sign-in">
              <Button>Sign In</Button>
            </NavLink>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} aria-label="Toggle menu" className="p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-blue-100">
            <NavLinks onClick={() => setMobileMenuOpen(false)} />
            <Button onClick={() => setMobileMenuOpen(false)}>
              <NavLink to="/sign-in">Sign In</NavLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
