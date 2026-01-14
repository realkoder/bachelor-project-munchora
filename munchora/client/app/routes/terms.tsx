import type { Route } from "./+types/terms";
import { AlertTriangle, ChefHat, FileText, Scale, Shield, Users } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy" },
    { name: "Privacy", content: "Welcome to Munchora!" },
  ];
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-10 w-10 text-sky-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The rules and guidelines for using Munchora's recipe generation and
          meal planning services.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last updated: December 2024
        </p>
      </div>

      <div className="space-y-8">
        {/* Acceptance */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Scale className="h-6 w-6 mr-3 text-sky-600" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              By accessing or using Munchora, you agree to be bound by these
              Terms of Service and our Privacy Policy. If you don't agree with
              any part of these terms, you may not use our service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ChefHat className="h-6 w-6 mr-3 text-sky-600" />
              Our Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Munchora provides AI-powered recipe generation, meal planning,
              and grocery list management services. Our platform helps you
              discover new recipes, organize your cooking, and share culinary
              experiences.
            </p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What We Provide:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>AI-generated recipes based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Recipe storage and organization tools</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Smart grocery list generation and management</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Recipe sharing and collaboration features</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="h-6 w-6 mr-3 text-sky-600" />
              Your Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Account Security
              </h3>
              <p className="text-gray-600">
                You're responsible for maintaining the security of your account
                and password. Notify us immediately of any unauthorized use of
                your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Content Guidelines
              </h3>
              <p className="text-gray-600">
                When sharing recipes or content, ensure it's appropriate,
                accurate, and doesn't infringe on others' rights. Don't share
                harmful, offensive, or copyrighted content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Proper Use</h3>
              <p className="text-gray-600">
                Use Munchora only for its intended purpose. Don't attempt to
                hack, spam, or misuse our services. Respect other users and our
                community guidelines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Disclaimer */}
        <Card className="shadow-lg border-0 border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <AlertTriangle className="h-6 w-6 mr-3 text-amber-600" />
              Recipe and Food Safety Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-800 font-medium mb-2">
                Important Food Safety Notice
              </p>
              <p className="text-amber-700 text-sm">
                AI-generated recipes are suggestions only. Always use your
                judgment regarding food safety, cooking temperatures, and
                ingredient freshness. We're not responsible for any health
                issues that may arise from following our recipes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Your Responsibility
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Verify ingredient safety and freshness</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Follow proper cooking temperatures and food handling
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Consider dietary restrictions and allergies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Consult professionals for specific dietary needs</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Shield className="h-6 w-6 mr-3 text-sky-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
              <p className="text-gray-600">
                You retain ownership of recipes and content you create. By using
                Munchora, you grant us permission to store, display, and
                share your content as part of our service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Our Platform</h3>
              <p className="text-gray-600">
                Munchora's technology, design, and features are our
                intellectual property. You may not copy, modify, or distribute
                our platform without permission.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Munchora is provided "as is" without warranties. We're not
              liable for any damages arising from your use of our service,
              including but not limited to food-related incidents, data loss, or
              service interruptions. Your use of our service is at your own
              risk.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We may update these terms occasionally. We'll notify you of
              significant changes via email or through our service. Continued
              use of Munchora after changes constitutes acceptance of the new
              terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-sky-500 to-violet-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-sky-100 mb-6">
              We're here to help clarify anything about our terms of service.
            </p>
              <NavLink to="/privacy">
                <Button
                  size="lg"
                  variant="outline"
                  className=" text-sky-600 hover:text-sky-500"
                >
                  View Privacy Policy
                </Button>
              </NavLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
