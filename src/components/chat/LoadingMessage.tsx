import { ChefHat } from "lucide-react";

const cookingMessages = [
  "Gathering ingredients...",
  "Prepping the recipe...",
  "Measuring portions...",
  "Writing instructions...",
  "Almost ready to serve...",
];

export function LoadingMessage() {
  const randomMessage = cookingMessages[Math.floor(Math.random() * cookingMessages.length)];

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[80%] bg-card border border-border rounded-2xl rounded-bl-md px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center animate-pulse">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">{randomMessage}</p>
            <div className="flex gap-1 mt-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}