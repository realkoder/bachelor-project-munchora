import { ChefHat, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import type { Route } from './+types/faq';
import { Card, CardContent } from '~/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { NavLink } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Faq page' }, { name: 'FAQ', content: 'Welcome to Munchora!' }];
}

export default function Faq() {
  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account?',
          answer:
            "Simply click the 'Get Started' or 'Sign Up' button on our homepage. You'll need to provide your name, email address, and create a secure password. Once you verify your email, you can start generating recipes immediately!",
        },
        {
          question: 'Is Munchora free to use?',
          answer:
            'Yes! Munchora offers a generous free tier that includes AI recipe generation, basic grocery list management, and recipe saving. We also offer premium features for users who want advanced functionality like unlimited recipe generation and enhanced sharing options.',
        },
        {
          question: 'Do I need to download an app?',
          answer:
            "No download required! Munchora works directly in your web browser on any device - desktop, tablet, or mobile. We're also working on dedicated mobile apps that will be available soon.",
        },
      ],
    },
    {
      title: 'AI Recipe Generation',
      questions: [
        {
          question: 'How does the AI recipe generator work?',
          answer:
            'Our AI analyzes thousands of recipes from various cuisines and cooking techniques. When you select a cuisine type or provide custom instructions, it creates unique recipes tailored to your preferences, considering ingredients, cooking methods, and flavor profiles.',
        },
        {
          question: 'Can I customize recipes for dietary restrictions?',
          answer:
            'You can specify dietary requirements like vegetarian, vegan, gluten-free, keto, or any allergies in your custom prompt. The AI will generate recipes that meet your specific needs while maintaining great taste and nutrition.',
        },
        {
          question: 'How accurate are the generated recipes?',
          answer:
            'Our AI is trained on verified recipes and cooking techniques, so the generated recipes are reliable and tested. However, we always recommend reviewing ingredients and instructions, and feel free to adjust seasoning and cooking times to your taste!',
        },
        {
          question: 'Can I save and modify generated recipes?',
          answer:
            'Yes! You can save any generated recipe to your personal recipe book. You can also edit ingredients, adjust quantities, add personal notes, and even share your modified versions with friends and family.',
        },
      ],
    },
    {
      title: 'Grocery Lists',
      questions: [
        {
          question: 'How do grocery lists work?',
          answer:
            'You can create multiple grocery lists for different occasions - weekly shopping, dinner parties, or meal prep. Add items manually or automatically generate lists from your saved recipes. Items are automatically categorized (produce, meat, dairy, etc.) for easier shopping.',
        },
        {
          question: 'Can I share grocery lists with family?',
          answer:
            'Yes! You can share grocery lists with family members or roommates. Everyone with access can add items, check off completed purchases, and see real-time updates. Perfect for collaborative meal planning!',
        },
        {
          question: 'Do grocery lists work offline?',
          answer:
            "Your grocery lists are accessible offline once loaded. You can check off items and add new ones even without internet connection. Changes will sync automatically when you're back online.",
        },
      ],
    },
    {
      title: 'Sharing & Collaboration',
      questions: [
        {
          question: 'How can I share recipes with friends?',
          answer:
            'Each recipe has a share button that generates a link you can send via text, email, or social media. Recipients can view the recipe and even save it to their own Munchora account if they have one.',
        },
        {
          question: 'Can I collaborate on meal planning?',
          answer:
            'Yes! You can create shared grocery lists and recipe collections with family or friends. Everyone can contribute recipe ideas, add ingredients to shopping lists, and coordinate meal preparation.',
        },
        {
          question: 'Is there a community feature?',
          answer:
            "We're building community features where you can discover recipes from other users, follow your favorite home cooks, and participate in cooking challenges. This feature will be available in our upcoming update!",
        },
      ],
    },
    {
      title: 'Account & Privacy',
      questions: [
        {
          question: 'How is my data protected?',
          answer:
            'We take privacy seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent. You can delete your account and all associated data at any time from your account settings.',
        },
        {
          question: 'Can I export my recipes?',
          answer:
            'Yes! You can export your saved recipes in various formats (PDF, text, or structured data) from your account settings. This ensures you always have access to your favorite recipes, even outside of Munchora.',
        },
        {
          question: 'How do I delete my account?',
          answer:
            "You can delete your account from the Account Settings page. This will permanently remove all your data, including saved recipes and grocery lists. We'll send a confirmation email before processing the deletion.",
        },
      ],
    },
    {
      title: 'Technical Support',
      questions: [
        {
          question: 'What browsers are supported?',
          answer:
            'Munchora works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
        },
        {
          question: 'Why is recipe generation taking a long time?',
          answer:
            "Recipe generation typically takes 2-5 seconds. If it's taking longer, it might be due to high server load or your internet connection. Try refreshing the page or generating a simpler recipe prompt.",
        },
        {
          question: 'I found a bug. How do I report it?',
          answer:
            'We appreciate bug reports! You can contact us through the support email below or use the feedback form in your account settings. Please include details about what you were doing when the bug occurred.',
        },
        {
          question: 'Can I use Munchora on my phone?',
          answer:
            'Munchora is fully responsive and works great on mobile devices. The interface adapts to your screen size for easy recipe browsing and grocery list management on the go.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="h-10 w-10 text-fourth" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about Munchora. Can't find what you're looking for? We're here to help!
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-8 bg-fourth rounded-full mr-4"></div>
                {category.title}
              </h2>

              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, questionIndex) => (
                  <AccordionItem key={questionIndex} value={`${categoryIndex}-${questionIndex}`} className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-fourth py-4">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support Section */}
      <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-secondary to-fourth/50 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-final">Still Have Questions?</h2>
          <p className="text-final mb-6 text-lg">Our support team is here to help you make the most of Munchora</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Mail className="h-5 w-5" />
              <span>Email Support</span>
            </Button>

            <Button size="lg">
              <MessageCircle className="h-5 w-5" />
              <span>Live Chat</span>
            </Button>
          </div>

          <div className="mt-6 text-sm text-final">
            <p>Average response time: 2-4 hours</p>
            <p>Support available Monday-Friday, 9 AM - 6 PM EST</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="bg-third w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-6 w-6 text-final" />
            </div>
            <h3 className="font-semibold mb-2">Getting Started Guide</h3>
            <p className="text-sm text-gray-600 mb-4">Learn the basics of using Munchora</p>
            <NavLink to="/about">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </NavLink>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Community Forum</h3>
            <p className="text-sm text-gray-600 mb-4">Connect with other Munchora users</p>
            <Button variant="outline" size="sm">
              Join Community
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600 mb-4">Watch step-by-step guides</p>
            <Button variant="outline" size="sm">
              Watch Videos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
