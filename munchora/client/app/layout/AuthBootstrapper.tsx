import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { curUserAtom } from '~/atoms/curUserAtom';
import { useFetch } from '~/lib/api-client';
import type { ILoginResponse } from '~/types/user.interface';
import {ADMIN_USER_ID} from "~/constants/admin-constants";

const noAuthRoutes = ['/', '/faq', '/about', '/sign-in', '/recipe', '/privacy', '/terms', 'feedback'];

function isNoAuthRoute(pathname: string) {
  // Allow /recipe and /recipe/:id
  if (pathname === '/recipe') return true;
  if (pathname.startsWith('/recipe/')) return true;
  // Exact match for other public routes
  return noAuthRoutes.includes(pathname);
}

export default function AuthBootstrapper() {
  const [curUser, setCurUser] = useAtom(curUserAtom);
  const { fetchData: getMe } = useFetch<ILoginResponse>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (curUser?.status) return;

    (async () => {
      try {
        const meResponse = await getMe('/auth/me');
        if (meResponse?.user) {
          setCurUser({ user: meResponse.user, status: 'SIGNED_IN' });
        } else {
          setCurUser({ user: null, status: 'NOT_SIGNED_IN' });
        }
      } catch {
        setCurUser({ user: null, status: 'NOT_SIGNED_IN' });
        if (!isNoAuthRoute(location.pathname)) {
          navigate('/');
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (location.pathname === '/admin' && curUser?.user?.id !== ADMIN_USER_ID) {
      navigate('/home');
      return;
    }
    if (curUser?.status === 'NOT_SIGNED_IN') {
      if (!isNoAuthRoute(location.pathname)) {
        navigate('/');
      }
    }
  }, [location.pathname]);

  return null;
}
