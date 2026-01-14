import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '~/components/ui/card';
import type {Route} from './+types/index';
import {Avatar, AvatarFallback, AvatarImage} from '~/components/ui/avatar';
import {Button} from '~/components/ui/button';
import {Camera, Mail, Save, Shield, Trash2, User} from 'lucide-react';
import {Badge} from '~/components/ui/badge';
import {Label} from '~/components/ui/label';
import {Input} from '~/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import {useAtom} from 'jotai';
import {curUserAtom} from '~/atoms/curUserAtom';
import {useEffect, useRef, useState} from 'react';
import {Textarea} from '~/components/ui/textarea';
import useAuth from '~/hooks/useAuth';
import {useFetch} from '~/lib/api-client';
import {toast} from 'sonner';
import {processImageUpload} from '~/utils/imageUpload';

export function meta({}: Route.MetaArgs) {
  return [{title: 'Profile'}, {name: 'Profile', content: 'Welcome to Munchora!'}];
}

export default function Profile() {
  const [curUser, setCurUser] = useAtom(curUserAtom);
  const {deleteUserNoReturn, updateUser} = useAuth();
  const [updatedFirstName, setUpdatedFirstName] = useState('');
  const [updatedLastName, setUpdatedLastName] = useState('');
  const [updatedBio, setUpdatedBio] = useState('');
  const {fetchData} = useFetch<{ image_url: string }>();
  const {fetchData: fetchDelImage} = useFetch<{ message: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (curUser?.user?.fullname && updatedFirstName?.length === 0 && updatedLastName?.length === 0 && updatedBio?.length === 0) {
      setUpdatedFirstName(curUser.user.first_name);
      setUpdatedLastName(curUser.user.last_name);
      setUpdatedBio(curUser?.user?.bio || '');
    }
  }, [curUser?.user]);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    updateUser(updatedFirstName, updatedLastName, updatedBio);
    setIsLoading(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 15MB for original since HEIC files can be larger)
    if (file.size > 15 * 1024 * 1024) {
      toast.warning('Image size should be less than 15MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = await processImageUpload(file);

      const response = await fetchData(`/users/upload-image`, {
        method: 'POST',
        data: formData,
      });

      if (response.image_url) {
        setCurUser((cur) => {
          if (!cur?.user?.id) return cur;
          return {...cur, user: {...cur.user, image_src: response.image_url}};
        });
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    }
    setIsUploadingImage(false);
  };

  const handleDeleteAccount = async () => {
    await deleteUserNoReturn();
  };

  const handleDeleteProfileImg = async () => {
    try {
      const res = await fetchDelImage('/users/delete-image', {method: 'DELETE'});
      if (res.message === 'OK') {
        setCurUser((cur) => {
          if (!cur?.user?.id) return cur;
          return {...cur, user: {...cur.user, image_src: undefined}};
        });
      }
    } catch (e) {
      console.log('COULD NOT DELETE IMage', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-slate-800 mb-1">Profile Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="border backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={curUser?.user?.image_src || '/placeholder.png?height=96&width=96'} alt="Profile"/>
                  <AvatarFallback className="bg-secondary/50 text-fourth text-xl">AJ</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef} // Attach the ref to the input
                />
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                  onClick={handleCameraClick} // Trigger the file input on click
                >
                  <Camera className="h-4 w-4"/>
                </Button>
                {curUser?.user?.image_src && (
                  <Button size="sm" variant="destructive" onClick={handleDeleteProfileImg}
                          className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full p-0">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                )}
              </div>
              <h3 className="font-medium text-slate-800 mb-1">{curUser?.user?.fullname}</h3>
              <p className="text-sm text-slate-500 mb-4">{curUser?.user?.email}</p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-secondary/50 text-fourth">
                  Member since {curUser?.user?.created_at.toLocaleString().split('T')[0] ?? ''}
                </Badge>
                {/* <div className="text-xs text-slate-500">
                  <p>24 Recipes Created</p>
                  <p>5 Lists Shared</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <User className="h-5 w-5 text-slate-600"/>
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your personal details and bio</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" type="text" value={updatedFirstName || ''}
                           onChange={(e) => setUpdatedFirstName(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" type="text" value={updatedLastName || ''}
                           onChange={(e) => setUpdatedLastName(e.target.value)}/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={updatedBio || ''}
                    onChange={(e) => setUpdatedBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself and your cooking interests..."
                  />
                </div>
                <Button type="submit"
                        disabled={isLoading || (updatedFirstName === curUser?.user?.first_name && updatedLastName === curUser.user.last_name && updatedBio === (curUser.user?.bio || ''))}>
                  <Save className="h-4 w-4 mr-2"/>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="border backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Mail className="h-5 w-5 text-slate-600"/>
                <span>Email Settings</span>
              </CardTitle>
              <CardDescription>Manage your email address and communication preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={curUser?.user?.email || ''} disabled className="bg-slate-50"/>
                <p className="text-xs text-slate-500">Contact support to change your email address</p>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          {/* <ChangePassword /> */}

          {/* Notifications */}
          {/* <NotificationsSettings /> */}

          {/* Data & Privacy */}
          <Card className="border backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="h-5 w-5 text-slate-600"/>
                <span>Data & Privacy</span>
              </CardTitle>
              <CardDescription>Manage your data and account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">Export Your Data</h4>
                  <p className="text-sm text-slate-500">Download all your recipes and data</p>
                </div>
                <Button variant="outline" onClick={handleExportData} className="border-slate-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div> */}

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <h4 className="font-medium text-red-800">Delete Account</h4>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2"/>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        from our servers, including recipes,
                        grocery lists, and account information.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
