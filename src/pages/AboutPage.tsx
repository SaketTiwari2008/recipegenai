import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChefHat, Heart, Globe, Users, Lightbulb, Target } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion for Food",
    description: "We believe cooking should be joyful, not stressful. Every feature we build is designed to make your time in the kitchen more enjoyable.",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    description: "From Hindi to English, from beginners to experts - RecipeGen is built for everyone who loves food.",
  },
  {
    icon: Lightbulb,
    title: "Always Learning",
    description: "Our AI gets smarter with every recipe, learning from millions of cooking traditions and techniques.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We're building more than an app - we're nurturing a community of home cooks who inspire each other.",
  },
];

const stats = [
  { value: "10,000+", label: "Recipes Generated" },
  { value: "5,000+", label: "Happy Cooks" },
  { value: "2", label: "Languages" },
  { value: "24/7", label: "Always Available" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero mb-6 shadow-glow">
                <ChefHat className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Making Cooking Accessible to Everyone
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RecipeGen was born from a simple idea: everyone deserves access to great recipes, regardless of their cooking experience or language preference. We're using AI to break down barriers and bring the joy of cooking to millions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-border bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gradient-hero mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Democratizing Culinary Knowledge
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Traditional recipe sharing has always been limited by language, culture, and access. We're changing that. With RecipeGen, anyone can ask for a recipe in their preferred language and get detailed, accurate instructions instantly.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're a college student making your first dal or an experienced cook exploring new cuisines, RecipeGen adapts to your needs. Our AI understands context, dietary preferences, and available ingredients to give you recipes that actually work.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-hero opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-6xl mb-4">🍳</p>
                    <p className="text-xl font-semibold text-foreground">
                      "Food is love made visible"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Made in India */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 text-center">
            <p className="text-6xl mb-4">🇮🇳</p>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Proudly Made in India
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by a team passionate about Indian cuisine and technology, RecipeGen celebrates the rich diversity of food cultures while making cooking accessible to all.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}