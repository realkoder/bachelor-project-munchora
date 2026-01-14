import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { curUserAtom } from '~/atoms/curUserAtom';
import useAuth from '~/hooks/useAuth';
import { isIOSDevice } from '~/utils/check--devices';

export const Footer = () => {
  const curUser = useAtomValue(curUserAtom);
  const { signOutUser } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="border-t py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-left col-span-2">
            <NavLink to={'/'} className="flex items-center space-x-2 mb-4">
              <img className="w-[80px] h-[80px] mx-auto sm:mx-0 rounded-lg" src={'logo.png'} alt={'logo'} />
            </NavLink>
            <p className="text-final mb-4 max-w-md">Discover your next culinary adventure with AI-powered recipe generation and smart meal planning.</p>
            {isMounted && isIOSDevice() && (
              <a
                className="text-fourth font-semibold transition duration-200 ease-in-out underline hover:text-final"
                href="https://apps.apple.com/dk/app/munchora/id6747978117"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in App Store
              </a>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-final">Product</h3>
            <div className="space-y-2">
              <NavLink to="/recipes" className="block text-fourth hover:text-gray-700 transition-colors">
                Recipes
              </NavLink>
              <NavLink to="/grocery-lists" className="block text-fourth hover:text-gray-700 transition-colors">
                Grocery Lists
              </NavLink>
              <NavLink to="/about" className="block text-fourth hover:text-gray-700 transition-colors">
                About
              </NavLink>
            </div>
          </div>
          <div>
            <h3 className="text-final font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <NavLink to="/faq" className="block text-fourth hover:text-gray-700 transition-colors">
                FAQ
              </NavLink>
              {curUser?.status === 'SIGNED_IN' ? (
                <div className="flex flex-col text-fourth transition-colors">
                  <NavLink to={'/profile'} className="hover:text-gray-700 cursor-pointer">
                    Profile
                  </NavLink>
                  <div className="text-fourth my-2 hover:text-gray-700 cursor-pointer" onClick={signOutUser}>
                    Sign Out
                  </div>
                </div>
              ) : (
                <NavLink to="/sign-in" className="block text-fourth hover:text-gray-700 transition-colors">
                  Sign in
                </NavLink>
              )}
              <NavLink to="/feedback" className="block text-fourth hover:text-gray-700 transition-colors">
                Feedback
              </NavLink>
            </div>
          </div>
        </div>
        <div className="border-t border-border text-center text-fourth">
          <p className="mt-2">
            Contact us:{' '}
            <a href="mailto:your-email@example.com" className="text-final hover:text-gray-700">
              munchora.pro@gmail.com
            </a>
          </p>
          <p>&copy; 2025 Munchora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
