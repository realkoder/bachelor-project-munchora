import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { curRecipeAtom } from '~/atoms/curRecipeAtom';
import { curUserAtom } from '~/atoms/curUserAtom';
import { groceryListsAtom } from '~/atoms/groceryLists';
import { recipesAtom } from '~/atoms/recipesAtom';
import { useFetch } from '~/lib/api-client';
import type { ICreateUser, ILoginResponse, IUser } from '~/types/user.interface';

const useAuth = () => {
  const [curUser, setCurUser] = useAtom(curUserAtom);
  const { fetchData: postLogin } = useFetch<ILoginResponse>();
  const { fetchData: postUser } = useFetch<ICreateUser>();
  const { fetchData: putUser } = useFetch<IUser>();
  const { fetchData: signOut } = useFetch<{ message: string }>();
  const { fetchData: deleteUser } = useFetch<{ msg: string }>();
  const navigate = useNavigate();
  const setRecipes = useSetAtom(recipesAtom);
  const setCurRecipe = useSetAtom(curRecipeAtom);
  const setGroceries = useSetAtom(groceryListsAtom);

  const createNewUser = async (user: ICreateUser) => {
    try {
      const newUserData = await postUser('/users', {
        method: 'POST',
        data: { user },
      });

      if (newUserData) {
        toast("Welcome to Munchora - You've successfully signed up.");
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const loginData = await postLogin('/auth/login', {
        method: 'POST',
        data: { email, password },
      });

      if (loginData) {
        setCurUser({ user: loginData.user, status: 'SIGNED_IN' });
        toast('Successfully signed in.');
      } else {
        setCurUser({ user: null, status: 'NOT_SIGNED_IN' });
      }
      return true;
    } catch (e) {
      setCurUser({ user: null, status: 'NOT_SIGNED_IN' });
      return false;
    }
  };

  const signOutUser = async () => {
    const signedOutRes = await signOut('/auth/logout', { method: 'DELETE' });

    if (signedOutRes.message) {
      setRecipes(null);
      setCurRecipe(null);
      setGroceries(undefined);
      setCurUser(null);
      navigate('/');
    } else {
      toast.info('Could not sign you out...');
    }
  };

  const updateUser = async (first_name: string, last_name: string, bio: string) => {
    try {
      const res = await putUser(`/users/${curUser?.user?.id}`, { method: 'PUT', data: { first_name, last_name, bio } });
      setCurUser((cur) => {
        if (!cur || !cur.user) return undefined;
        return { ...cur, user: { ...cur.user, fullname: res.fullname, bio: res.bio } };
      });
      toast.info('Successfully updated user info');
    } catch {
      toast.error('Something went wrong updating your info - try to reload');
    }
  };

  const deleteUserNoReturn = async () => {
    try {
      const signedOutRes = await deleteUser(`/users/${curUser?.user?.id}`, { method: 'DELETE' });
      if (signedOutRes.msg === 'OK') {
        await signOutUser();
        navigate('/');
      } else {
        console.log('Error while deleting your profile.');
      }
    } catch {
      console.log('Error while deleting your profile.');
    }
  };

  return { createNewUser, loginUser, signOutUser, deleteUserNoReturn, updateUser };
};

export default useAuth;
