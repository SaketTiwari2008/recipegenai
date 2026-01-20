import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RecipeDisplay } from "@/components/recipe/RecipeDisplay";
import { IngredientModal } from "@/components/chat/IngredientModal";
import { LoadingMessage } from "@/components/chat/LoadingMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipeUsage } from "@/hooks/useRecipeUsage";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import {
  Send,
  ChefHat,
  ShoppingBasket,
  Sparkles,
  AlertCircle,
  Crown,
} from "lucide-react";
import {
  generateRecipe,
  getErrorMessage,
  type Recipe,
  type WebhookResponse,
} from "@/services/api.service";

interface Message {
  id: string;
  type: "user" | "system" | "recipe" | "error";
  content: string;
  recipe?: Recipe;
  humanReadable?: string;
  timestamp: Date;
}

const exampleSearches = [
  "Aloo Gobi for 4",
  "Quick pasta recipe",
  "Chicken biryani",
  "Paneer butter masala",
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user, subscription } = useAuth();
  const { usage, recordUsage, isPremium, checkUsage } = useRecipeUsage();
  const { saveRecipe, isRecipeSaved, canSave } = useSavedRecipes();

  // Handle initial query from URL
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && messages.length === 0) {
      setInput(query);
    }
  }, [searchParams, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
    ]);
  };

  const handleSubmit = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    // Check usage limit for free users
    if (user && !isPremium && !usage.canGenerate) {
      addMessage({
        type: "error",
        content: "You've reached your daily limit of 5 free recipes. Upgrade to Premium for unlimited recipes! 🚀",
      });
      return;
    }

    const userMessage = messageText.trim();
    setInput("");

    // Add user message
    addMessage({
      type: "user",
      content: userMessage,
    });

    setIsLoading(true);

    try {
      const response: WebhookResponse = await generateRecipe(userMessage);

      // Record usage for authenticated free users
      if (user && !isPremium) {
        await recordUsage(response.recipe.recipe_name);
      }

      // Add recipe message
      addMessage({
        type: "recipe",
        content: response.human_readable,
        recipe: response.recipe,
        humanReadable: response.human_readable,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : "Something went wrong. Please try again.";
      
      addMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientSubmit = (ingredients: string[]) => {
    const message = `I have these ingredients: ${ingredients.join(", ")}. What can I make?`;
    handleSubmit(message);
    setIsIngredientModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (search: string) => {
    setInput(search);
    textareaRef.current?.focus();
  };

  const handleRetry = (content: string) => {
    // Find the last user message and retry
    const lastUserMessage = [...messages].reverse().find((m) => m.type === "user");
    if (lastUserMessage) {
      handleSubmit(lastUserMessage.content);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-20 w-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow">
                <ChefHat className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What would you like to cook?
              </h2>
              <p className="text-muted-foreground mb-4 max-w-md">
                Ask for any recipe in English or Hindi. I'll give you detailed instructions with ingredients and timings.
              </p>

              {/* Usage indicator for authenticated free users */}
              {user && !isPremium && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-muted/50 rounded-full">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {usage.remaining} of {usage.limit} free recipes remaining today
                  </span>
                </div>
              )}

              {/* Premium badge */}
              {isPremium && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    Premium • Unlimited recipes
                  </span>
                </div>
              )}

              {/* Quick Examples */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {exampleSearches.map((search) => (
                  <Button
                    key={search}
                    variant="chip"
                    size="sm"
                    onClick={() => handleExampleClick(search)}
                  >
                    <Sparkles className="h-3 w-3" />
                    {search}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsIngredientModalOpen(true)}
              >
                <ShoppingBasket className="h-4 w-4" />
                I have some ingredients...
              </Button>
            </div>
          ) : (
            // Messages List
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`animate-fade-in ${
                    message.type === "user" ? "flex justify-end" : "flex justify-start"
                  }`}
                >
                  {message.type === "user" ? (
                    <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : message.type === "error" ? (
                    <div className="max-w-[80%] bg-destructive/10 border border-destructive/20 rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="text-destructive">{message.content}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => handleRetry(message.content)}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : message.type === "recipe" && message.recipe ? (
                    <div className="w-full">
                      <RecipeDisplay
                        recipe={message.recipe}
                        humanReadable={message.humanReadable || ""}
                        onSave={canSave ? saveRecipe : undefined}
                        isSaved={isRecipeSaved(message.recipe.recipe_name)}
                        canSave={canSave}
                      />
                    </div>
                  ) : (
                    <div className="max-w-[80%] bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && <LoadingMessage />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <div className="flex gap-3 items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsIngredientModalOpen(true)}
              title="I have ingredients"
            >
              <ShoppingBasket className="h-5 w-5" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your recipe request... (e.g., 'chicken biryani for 6')"
                className="min-h-[52px] max-h-32 resize-none pr-12 rounded-xl"
                rows={1}
              />
              <Button
                variant="send"
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            ⚠️ Recipes are AI-generated. Always verify cooking times and food safety.
          </p>
        </div>
      </main>

      <IngredientModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        onSubmit={handleIngredientSubmit}
      />
    </div>
  );
}