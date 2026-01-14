import { NavLink } from 'react-router';
import type { Route } from './+types/index';
import { Users, ShoppingCart, Sparkles, ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { IosAppModal } from '~/components/iosAppModal';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Index' }, { name: 'description', content: 'Welcome to Munchora!' }];
}

export default function Index() {
  return (
    <>
      <IosAppModal />

      {/* Hero Section with Food Images */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover Your Next
                <span className="text-third block">Culinary Adventure</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Let AI craft personalized recipes from cuisines around the world. Organize your cooking with smart grocery lists and share culinary discoveries
                with friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <NavLink to="/sign-in">
                  <Button size="lg" className=" text-lg px-8 py-3">
                    Start Cooking <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </NavLink>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Recipes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5K+</div>
                  <div className="text-sm text-gray-600">Happy Cooks</div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Hero Food Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/food-potato-index.png?height=300&width=600"
                    alt="Delicious sweet potato salat bowl with fresh ingredients"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-1 left-4 text-white">
                    <h3 className="font-semibold">Mediterranean Pasta</h3>
                    <p className="text-sm opacity-90">AI-Generated Recipe</p>
                  </div>
                </div>

                {/* Smaller images */}
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img src="/asian-stir-fry.png?height=150&width=200&text=Asian+Stir+Fry" alt="Colorful Asian stir fry" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img src="/salad-bowl.png?height=150&width=200&text=Fresh+Salad+Bowl" alt="Fresh colorful salad bowl" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Sparkles className="h-6 w-6 text-fourth" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-500 rounded-full p-3 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Food Images */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Cook Better</h2>
            <p className="text-xl text-gray-600">From AI-generated recipes to smart grocery planning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Recipe Generation */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src="ai-hand-human-hand.jpg?height=200&width=400&text=AI+Recipe+Generation"
                  alt="AI generating diverse recipes"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-third" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Recipe Generation</h3>
                <p className="text-gray-600">Generate unique recipes from Asian, European, Mediterranean, and more cuisines using advanced AI technology.</p>
              </CardContent>
            </Card>

            {/* Smart Grocery Lists */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src="/grocery-list.jpg?height=200&width=400&text=Smart+Grocery+Shopping"
                  alt="Organized grocery shopping with fresh ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Grocery Lists</h3>
                <p className="text-gray-600">Automatically generate shopping lists from your recipes and organize your grocery shopping efficiently.</p>
              </CardContent>
            </Card>

            {/* Share & Collaborate */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src="/eating.png?height=200&width=400&text=Family+Cooking+Together"
                  alt="Family cooking and sharing meals together"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Share & Collaborate</h3>
                <p className="text-gray-600">Share your favorite recipes and collaborate on grocery lists with family and friends for better meal planning.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recipe Showcase Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Recipes
            </h2>
            <p className="text-xl text-gray-600">
              Discover what our community is cooking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Spicy Thai Basil Chicken",
                cuisine: "Thai",
                time: "25 min",
                image:
                  "/spicy-thai-basil.png?height=250&width=300&text=Thai+Basil+Chicken",
                rating: 4.8,
              },
              {
                title: "Creamy Mushroom Risotto",
                cuisine: "Italian",
                time: "35 min",
                image:
                  "/placeholder.svg?height=250&width=300&text=Mushroom+Risotto",
                rating: 4.9,
              },
              {
                title: "Korean BBQ Bowls",
                cuisine: "Korean",
                time: "30 min",
                image:
                  "/placeholder.svg?height=250&width=300&text=Korean+BBQ+Bowl",
                rating: 4.7,
              },
              {
                title: "Mediterranean Quinoa Salad",
                cuisine: "Mediterranean",
                time: "15 min",
                image:
                  "/placeholder.svg?height=250&width=300&text=Quinoa+Salad",
                rating: 4.6,
              },
            ].map((recipe, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                      {recipe.cuisine}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-600">
                        {recipe.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-sky-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600">{recipe.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <NavLink to="/recipes">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Globe className="mr-2 h-5 w-5" />
                Explore All Recipes
              </Button>
            </NavLink>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Munchora Works</h2>
            <p className="text-xl text-gray-600">From inspiration to delicious meals in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Describe Your Craving',
                description: 'Tell our AI what you want to cook - cuisine type, ingredients, dietary preferences, or cooking time.',
                image: '/craving-pancake.png?height=200&width=300&text=AI+Chat+Interface',
              },
              {
                step: '2',
                title: 'Get Your Perfect Recipe',
                description: 'Our AI generates a personalized recipe with ingredients, instructions, and cooking tips tailored just for you.',
                image: '/recipe.png?height=200&width=300&text=Generated+Recipe',
              },
              {
                step: '3',
                title: 'Cook & Share',
                description: 'Follow the recipe, add it to your grocery list, and share your culinary creation with friends and family.',
                image: '/sharing-iphone.png?height=200&width=300&text=Cooking+Process',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <img src={step.image || '/placeholder.png'} alt={step.title} className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                  <div className="absolute -top-4 -left-4 bg-third text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NavLink to="/sign-in">
        <Button size="lg" className="mb-4 text-lg px-8 py-3">
          Get Started Free
        </Button>
      </NavLink>

      {/* CTA Section with Background Image */}
      {/* <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/kitchen.png?height=400&width=1200&text=Beautiful+Kitchen+Background"
            alt="Beautiful kitchen background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/90 to-violet-500/90"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Join thousands of home cooks discovering new Munchora's every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/sign-in">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-sky-50 text-lg px-8 py-3"
              >
                Get Started Free
              </Button>
            </NavLink>
          </div>
        </div>
      </section> */}
    </>
  );
}
