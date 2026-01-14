import { NavLink } from 'react-router';
import { Input } from '../ui/input';
import { useState } from 'react';
import useAuth from '~/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import GoogleButton from 'react-google-signin-button';
import 'react-google-signin-button/dist/button.css';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const credentialsProvided = password.length > 5 && email.length > 5;
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await loginUser(email, password);
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="flex flex-col items-center gap-4">
          Sign in to your account to continue cooking
          <a
            href={import.meta.env.VITE_ENV !== 'production' ? 'http://localhost:3000/api/v1/auth/google' : 'https://munchora.pro/api/v1/auth/google'}
            className="btn"
          >
            <GoogleButton />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <NavLink to="#" className="text-sm text-fourth hover:text-fourth/80">
              Forgot password?
            </NavLink>
          </div>

          <div className="text-xs text-gray-600 bg-secondary/50 p-3 rounded-lg mb-4">
            <p>
              By signing in, you agree to our use of cookies to enhance your experience and remember your preferences.{' '}
              <NavLink to="/privacy" className="text-fourth hover:text-fourth/80 underline">
                Learn more
              </NavLink>
            </p>
          </div>

          <Button name="signinbtn" type="submit" className="w-full" disabled={isLoading || !credentialsProvided}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
