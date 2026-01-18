import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Globe,
  Scale,
  ShoppingCart,
  Heart,
  Clock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ChefHat,
  Check,
} from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const features = [
  {
    icon: Globe,
    title: "English, Hindi & Hinglish",
    description: "Get recipes in your preferred language",
  },
  {
    icon: Scale,
    title: "Auto-Scale Servings",
    description: "Adjust portions with smart ingredient scaling",
  },
  {
    icon: ShoppingCart,
    title: "Shopping Lists",
    description: "Download ready-to-use grocery lists",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Build your personal recipe collection",
  },
  {
    icon: Clock,
    title: "Step Timers",
    description: "Precise timing for perfect results",
  },
  {
    icon: RefreshCw,
    title: "Substitutions",
    description: "Alternative ingredients when you need them",
  },
];

const exampleSearches = [
  "Aloo Gobi for 4 people",
  "Quick breakfast with eggs",
  "I have potato, tomato, onion - what can I make?",
  "Paneer Tikka",
  "चिकन बिरयानी 6 लोगों के लिए",
  "Easy dal recipe",
];

const howItWorks = [
  {
    step: "1",
    title: "Tell us what you want",
    description: "Type any dish name, ingredients you have, or dietary preferences",
  },
  {
    step: "2",
    title: "Get detailed recipe",
    description: "Receive complete instructions with ingredients, steps & timings",
  },
  {
    step: "3",
    title: "Cook with confidence",
    description: "Scale servings, download shopping list, and start cooking",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/50" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container relative px-4 md:px-6 py-16 md:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Recipe Assistant
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Get Perfect Recipes{" "}
                  <span className="text-gradient-hero">Instantly</span> in English or Hindi
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  Your AI cooking assistant — from Samosa to Spaghetti. Just tell us what you want to cook!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/chat">
                    <Button variant="hero" size="xl" className="w-full sm:w-auto">
                      Get Your Recipe Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Free to try
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    No signup required
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative animate-fade-in">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={heroImage}
                    alt="Delicious Indian cuisine spread"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-4 bottom-8 bg-card rounded-xl p-4 shadow-lg border border-border animate-float hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ChefHat className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">10,000+</p>
                      <p className="text-xs text-muted-foreground">Recipes Generated</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-8 bg-card rounded-xl p-4 shadow-lg border border-border animate-float hidden md:block" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">🇮🇳 🇬🇧</p>
                      <p className="text-xs text-muted-foreground">Hindi & English</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Searches */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container px-4 md:px-6">
            <p className="text-center text-sm text-muted-foreground mb-4">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {exampleSearches.map((search) => (
                <Link key={search} to={`/chat?q=${encodeURIComponent(search)}`}>
                  <Button variant="chip" size="sm" className="text-sm">
                    {search}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get from craving to cooking in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div
                  key={item.step}
                  className="relative text-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
                >
                  {/* Step Number */}
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground text-2xl font-bold mb-6 shadow-glow">
                    {item.step}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features to make cooking easier and more enjoyable
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start free, upgrade when you need more
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl bg-card border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
                <p className="text-muted-foreground mb-4">Perfect for trying out</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    5 recipes per day
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Ingredient scaling
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Shopping list downloads
                  </li>
                </ul>
                <Link to="/chat">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="relative p-8 rounded-2xl bg-card border-2 border-primary shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Premium</h3>
                <p className="text-muted-foreground mb-4">For serious home cooks</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Unlimited recipes
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Save unlimited favorites
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Recipe history
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-success" />
                    Priority support
                  </li>
                </ul>
                <Link to="/pricing">
                  <Button variant="hero" className="w-full">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Cooking?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of home cooks who are making delicious meals with RecipeGen
            </p>
            <Link to="/chat">
              <Button size="xl" className="bg-card text-foreground hover:bg-card/90 shadow-xl">
                Get Your Recipe Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}