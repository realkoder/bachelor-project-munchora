import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import useAuth from "~/hooks/useAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const { createNewUser, loginUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const newUser = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    const isNewUserCreated = await createNewUser(newUser);

    if (isNewUserCreated) {
      const isUserLoggedIn = await loginUser(formData.email, formData.password);
      if (isUserLoggedIn) {
        navigate("/home");
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Join Munchora and start your culinary journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="additional-name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">First Name</Label>
            <Input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="additional-name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
              />
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400"/>
                ) : (
                    <Eye className="h-4 w-4 text-gray-400"/>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
              />
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400"/>
                ) : (
                    <Eye className="h-4 w-4 text-gray-400"/>
                )}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-secondary/50 p-3 rounded-lg mb-4">
            <p>
              By creating an account, you agree to our{" "}
              <NavLink
                  to="/privacy"
                  className="text-fourth hover:text-fourth/80 underline"
              >
                Privacy Policy
              </NavLink>{" "}
              and{" "}
              <NavLink
                  to="/terms"
                  className="text-fourth hover:text-fourth/80 underline"
              >
                Terms of Service
              </NavLink>
              . We use cookies to enhance your experience, remember your
              preferences, and analyze site usage.
            </p>
          </div>

          <Button
              type="submit"
              disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
