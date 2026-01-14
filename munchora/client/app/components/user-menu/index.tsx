import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import useAuth from '~/hooks/useAuth';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router';
import { LogOut, MessageSquare, User, UserPen } from 'lucide-react';

const UserMenu = () => {
  const curUser = useAtomValue(curUserAtom);
  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  const imageUrl = curUser?.user?.image_src;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-10 w-10">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl ?? undefined} alt={curUser?.user?.fullname ?? 'User'} />
            <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center">
              {imageUrl ? (
                curUser?.user?.fullname?.charAt(0).toUpperCase() ?? 'U'
              ) : (
                <>
                  <UserPen className="w-5 h-5" />
                  <p className="p-1">{curUser?.user?.fullname?.charAt(0).toUpperCase() ?? 'U'}</p>
                </>
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuLabel>{(curUser?.user && curUser?.user.fullname) ?? 'Account'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
          <User className="mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={signOutUser}>
          <LogOut className="mr-2" />
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/feedback')}>
          <MessageSquare className="mr-2" />
          Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
