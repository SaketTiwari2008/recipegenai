import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ShoppingBasket, Sparkles } from "lucide-react";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ingredients: string[]) => void;
}

const exampleIngredients = [
  "potato, onion, tomato, rice",
  "chicken, garlic, ginger, yogurt",
  "paneer, bell pepper, cream",
  "eggs, bread, cheese, butter",
];

export function IngredientModal({ isOpen, onClose, onSubmit }: IngredientModalProps) {
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = () => {
    if (!ingredients.trim()) return;

    const ingredientList = ingredients
      .split(/[,\n]+/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (ingredientList.length > 0) {
      onSubmit(ingredientList);
      setIngredients("");
    }
  };

  const handleExampleClick = (example: string) => {
    setIngredients(example);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            What ingredients do you have?
          </DialogTitle>
          <DialogDescription>
            Enter ingredients separated by commas or on new lines. I'll suggest recipes you can make!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., potato, onion, tomato, garlic, cumin..."
            className="min-h-[120px]"
          />

          <div>
            <p className="text-sm text-muted-foreground mb-2">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {exampleIngredients.map((example) => (
                <Button
                  key={example}
                  variant="chip"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                >
                  <Sparkles className="h-3 w-3" />
                  {example.split(",")[0]}...
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleSubmit}
            disabled={!ingredients.trim()}
          >
            Find Recipes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}