import { NavLink } from 'react-router';
import type { Route } from './+types/about';
import { Sparkles, ShoppingCart, Users, Heart, Target, Zap, Mail } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'About' }, { name: 'About', content: 'Welcome to Munchora!' }];
}

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Munchora</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make cooking more accessible, creative, and enjoyable for everyone. Using the power of AI, we help you discover new Munchoras
          and organize your culinary journey.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            Cooking should be a joyful experience, not a stressful chore. Munchora combines artificial intelligence with culinary expertise to help you discover
            new recipes, organize your ingredients, and share your love of food with others.
          </p>
          <p className="text-lg text-gray-600">
            Whether you're a beginner cook looking for simple recipes or an experienced chef seeking inspiration from global cuisines, Munchora adapts to your
            needs and helps you create memorable meals.
          </p>
        </div>
        <div className="bg-gradient-to-br from-sky-100 to-violet-100 rounded-2xl p-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Personalized</h3>
              <p className="text-sm text-gray-600">Recipes tailored to your taste</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Efficient</h3>
              <p className="text-sm text-gray-600">Smart grocery planning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Deep Dive */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Munchora Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Recipe Generation</h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI understands your preferences and dietary requirements to generate unique recipes from cuisines around the world.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Asian, European, Mediterranean cuisines</li>
                <li>• Custom dietary restrictions</li>
                <li>• Ingredient-based suggestions</li>
                <li>• Difficulty level matching</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Grocery Management</h3>
              <p className="text-gray-600 mb-4">
                Automatically generate shopping lists from your recipes and organize your grocery shopping with intelligent categorization.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Auto-generated shopping lists</li>
                <li>• Ingredient categorization</li>
                <li>• Progress tracking</li>
                <li>• Multiple list management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="bg-violet-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Social Cooking Experience</h3>
              <p className="text-gray-600 mb-4">
                Share your favorite recipes and collaborate on grocery lists with family and friends for better meal planning.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recipe sharing</li>
                <li>• Collaborative grocery lists</li>
                <li>• Family meal planning</li>
                <li>• Community features</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-secondary/50 rounded-2xl p-12 shadow-lg mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Passion for Food</h3>
            <p className="text-sm text-gray-600">We believe cooking is an art form that brings people together</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-sm text-gray-600">Using cutting-edge AI to revolutionize how we approach cooking</p>
          </div>

          <div className="text-center">
            <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-600">Building connections through shared culinary experiences</p>
          </div>

          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
            <p className="text-sm text-gray-600">Making cooking accessible to everyone, regardless of skill level</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-third/50 to-fourth rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Culinary Journey?</h2>
        <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
          Join thousands of home cooks who are already discovering new flavors and simplifying their meal planning with Munchora.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink to="/sign-in">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
          </NavLink>
        </div>
      </div>
      <div className="text-center mt-8 flex items-center justify-center">
        <span className="mr-2">
          <Mail className="h-5 w-5 text-fourth" /> {/* Add the Mail icon */}
        </span>
        <p className="text-gray-600">
          Contact us:{' '}
          <a href="mailto:munchora.pro@gmail.com" className="text-final hover:underline">
            munchora.pro@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
