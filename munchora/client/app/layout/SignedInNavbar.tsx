import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button } from '~/components/ui/button';
import { BookA, ChefHat, House, MessageCircleQuestion, ShoppingCart, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';
import UserMenu from '~/components/user-menu';
import useNotifications from '~/hooks/useNotifications';
import useFetchGroceryLists from '~/hooks/fetching/useFetchGroceryLists';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import {ADMIN_USER_ID} from "~/constants/admin-constants";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const curUser = useAtomValue(curUserAtom);
  useNotifications();
  useFetchGroceryLists();

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <NavLink to="/home" onClick={onClick}>
        <Button variant="ghost" className="flex items-center w-full justify-start">
          <House className="h-4 w-4" />
          <span className={`${isActive('/home') ? 'border-black border-b' : ''} ml-2`}>Home</span>
        </Button>
      </NavLink>
      <NavLink to="/recipes" onClick={onClick}>
        <Button variant="ghost" className="flex items-center w-full justify-start">
          <Sparkles className="h-4 w-4" />
          <span className={`${isActive('/recipes') ? 'border-black border-b' : ''} ml-2`}>Generate Recipe</span>
        </Button>
      </NavLink>
      <NavLink to="/grocery-lists" onClick={onClick}>
        <Button variant="ghost" className="flex items-center w-full justify-start">
          <ShoppingCart className="h-4 w-4" />
          <span className={`${isActive('/grocery-lists') ? 'border-black border-b' : ''} ml-2`}>Grocery Lists</span>
        </Button>
      </NavLink>
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
      {curUser?.user?.id === ADMIN_USER_ID && (
        <NavLink to="/admin" onClick={onClick}>
          <Button variant="ghost" className="flex items-center w-full justify-start">
            <ShieldCheck />
            <span className={`${isActive('/admin') ? 'border-black border-b' : ''} ml-2`}>Admin</span>
          </Button>
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/home" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-third" />
            <span className="text-2xl font-bold text-gray-900">Munchora</span>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Desktop user menu */}
          <div data-cy="user-menu" className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <UserMenu />
            <Button variant="ghost" onClick={toggleMobileMenu} aria-label="Toggle menu" className="p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-200">
            <NavLinks onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
}
