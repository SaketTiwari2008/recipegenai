import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out RecipeGen",
    price: "₹0",
    period: "forever",
    icon: Zap,
    features: [
      { text: "5 recipes per day", included: true },
      { text: "Ingredient scaling", included: true },
      { text: "Shopping list downloads", included: true },
      { text: "English & Hindi support", included: true },
      { text: "Save recipes", included: false },
      { text: "Recipe history", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    description: "For serious home cooks",
    price: "₹299",
    period: "per month",
    icon: Crown,
    features: [
      { text: "Unlimited recipes", included: true },
      { text: "Ingredient scaling", included: true },
      { text: "Shopping list downloads", included: true },
      { text: "English & Hindi support", included: true },
      { text: "Save unlimited recipes", included: true },
      { text: "Complete recipe history", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Premium Trial",
    ctaVariant: "hero" as const,
    popular: true,
  },
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and UPI payments through our secure payment partner.",
  },
  {
    question: "Is there a free trial?",
    answer: "The free plan lets you try 5 recipes per day forever. For Premium, we offer a 7-day free trial.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a full refund within 7 days of purchase if you're not satisfied with Premium.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-8 rounded-2xl bg-card border-2 ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      plan.popular
                        ? "bg-gradient-hero"
                        : "bg-muted"
                    }`}>
                      <plan.icon className={`h-6 w-6 ${
                        plan.popular
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-success flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/chat">
                    <Button variant={plan.ctaVariant} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Annual Discount */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Save 16% with annual billing:{" "}
                <span className="font-semibold text-foreground">₹2,999/year</span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to start cooking?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Try RecipeGen free today and discover the joy of effortless cooking.
            </p>
            <Link to="/chat">
              <Button variant="hero" size="xl">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}