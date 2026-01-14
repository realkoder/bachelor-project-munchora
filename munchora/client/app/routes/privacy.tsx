import type { Route } from './+types/privacy';
import { Shield, Cookie, Eye, Lock, Database } from 'lucide-react';
import { NavLink } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Privacy' }, { name: 'Privacy', content: 'Welcome to Munchora!' }];
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-10 w-10 text-sky-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Your privacy matters to us. Here&apos;s how we collect, use, and protect your information.</p>
        <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
      </div>

      <div className="space-y-8">
        {/* Information We Collect */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Database className="h-6 w-6 mr-3 text-sky-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
              <p className="text-gray-600">
                When you create an account, we collect your name, email address, and password (encrypted). This helps us provide you with a personalized cooking
                experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recipe Data</h3>
              <p className="text-gray-600">
                We store the recipes you create, save, and share. This includes ingredients, instructions, photos, and your personal notes to help you build
                your recipe collection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
              <p className="text-gray-600">
                We collect information about how you use Munchora, such as which features you use most, to improve our service and provide better recipe
                recommendations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Cookie className="h-6 w-6 mr-3 text-sky-600" />
              How We Use Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
              <p className="text-gray-600">
                Required for the website to function properly. These include authentication cookies to keep you signed in and preference cookies to remember
                your settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
              <p className="text-gray-600">
                Help us understand how you use Munchora so we can improve the experience. These are anonymized and don&apos;s identify you personally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Preference Cookies</h3>
              <p className="text-gray-600">
                Remember your choices like dietary preferences, favorite cuisines, and interface settings to provide a more personalized experience.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Eye className="h-6 w-6 mr-3 text-sky-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Provide and improve our recipe generation and meal planning services</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Personalize your experience with relevant recipe recommendations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Send you important updates about your account and our services</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Analyze usage patterns to improve our AI recipe generation</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Ensure the security and integrity of our platform</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Lock className="h-6 w-6 mr-3 text-sky-600" />
              How We Protect Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
              <p className="text-gray-600">
                All data is encrypted in transit and at rest. Your passwords are hashed using industry-standard security practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Access Controls</h3>
              <p className="text-gray-600">
                Only authorized personnel have access to your data, and only when necessary to provide support or improve our services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
              <p className="text-gray-600">
                We keep your data only as long as necessary to provide our services. You can delete your account and all associated data at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Access Your Data</h3>
                <p className="text-gray-600 text-sm">You can view and download all your data from your account settings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delete Your Data</h3>
                <p className="text-gray-600 text-sm">You can delete your account and all associated data at any time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Control Cookies</h3>
                <p className="text-gray-600 text-sm">Manage cookie preferences in your browser settings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600 text-sm">Reach out with any privacy questions or concerns.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-sky-500 to-violet-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-sky-100 mb-6">We&apos;re here to help. Contact us if you have any questions about how we handle your data.</p>
            <NavLink to="/terms">
              <Button size="lg" variant="outline" className=" text-sky-600 hover:text-sky-500">
                View Terms of Service
              </Button>
            </NavLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
