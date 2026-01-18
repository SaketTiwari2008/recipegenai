import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is RecipeGen?",
        answer: "RecipeGen is an AI-powered recipe assistant that generates detailed cooking instructions based on your requests. Simply tell us what you want to cook, and we'll provide complete recipes with ingredients, steps, and timings.",
      },
      {
        question: "How accurate are the recipes?",
        answer: "Our AI is trained on millions of recipes and cooking techniques. While we strive for accuracy, we recommend verifying cooking times and temperatures, especially for meat dishes. Always use food safety best practices.",
      },
      {
        question: "Can I use RecipeGen in Hindi?",
        answer: "Yes! RecipeGen supports both English and Hindi. You can type your requests in Hindi, Hinglish (mixed), or English, and we'll understand and respond appropriately.",
      },
      {
        question: "Do I need to create an account?",
        answer: "No account is needed to try RecipeGen. You can generate up to 5 recipes per day for free without signing up. Create an account to save recipes and access premium features.",
      },
    ],
  },
  {
    category: "Features",
    questions: [
      {
        question: "How does ingredient scaling work?",
        answer: "Simply use the scaling slider to adjust servings from 1 to 12. All ingredient quantities are automatically recalculated with smart rounding to practical measurements.",
      },
      {
        question: "Can I get recipes based on ingredients I have?",
        answer: "Absolutely! Click the 'I have ingredients' button and enter what you have. We'll suggest recipes you can make with those ingredients.",
      },
      {
        question: "How do I download a shopping list?",
        answer: "After generating a recipe, expand the 'Shopping List' section and click 'Download CSV'. This creates a file you can open in Excel or Google Sheets.",
      },
      {
        question: "Can I print recipes?",
        answer: "Yes! Click the print button on any recipe to get a printer-friendly version with clean formatting.",
      },
    ],
  },
  {
    category: "Account & Billing",
    questions: [
      {
        question: "What's included in the free plan?",
        answer: "Free users get 5 recipes per day, ingredient scaling, shopping list downloads, and support for English and Hindi. Recipe saving and history require a premium subscription.",
      },
      {
        question: "How much does Premium cost?",
        answer: "Premium is ₹299/month or ₹2,999/year (save 16%). You get unlimited recipes, unlimited saves, complete recipe history, and priority support.",
      },
      {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel anytime from your account settings. You'll continue to have premium access until the end of your billing period.",
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards, debit cards, and UPI payments through our secure payment partner Stripe.",
      },
    ],
  },
  {
    category: "Safety & Privacy",
    questions: [
      {
        question: "Is my data safe?",
        answer: "Yes! We use industry-standard encryption and never sell your data. Your recipes and preferences are stored securely and only used to improve your experience.",
      },
      {
        question: "Are recipes safe for people with allergies?",
        answer: "Our recipes may contain common allergens. Always check the ingredient list if you have allergies. We recommend consulting the original source or a healthcare provider for serious dietary restrictions.",
      },
      {
        question: "How do you handle food safety?",
        answer: "We include safety notes for recipes involving raw meat, eggs, or other potentially hazardous ingredients. However, always verify cooking temperatures and times using reliable sources.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero mb-6 shadow-glow">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about RecipeGen
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            {faqs.map((category) => (
              <div key={category.category} className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.category}-${index}`}
                      className="bg-card border border-border rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium text-foreground">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help! Reach out to our support team.
            </p>
            <a href="/contact">
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}