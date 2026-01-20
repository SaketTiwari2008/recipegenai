import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clock,
  Users,
  Scale,
  Download,
  Printer,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  ShoppingCart,
  CookingPot,
  Bookmark,
  BookmarkCheck,
  Crown,
} from "lucide-react";
import {
  type Recipe,
  scaleRecipe,
  formatQuantity,
  generateShoppingListCSV,
  downloadCSV,
} from "@/services/api.service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RecipeDisplayProps {
  recipe: Recipe;
  humanReadable: string;
  onSave?: (recipe: Recipe, humanReadable?: string, notes?: string) => Promise<boolean>;
  isSaved?: boolean;
  canSave?: boolean;
}

export function RecipeDisplay({ 
  recipe: initialRecipe, 
  humanReadable,
  onSave,
  isSaved = false,
  canSave = false,
}: RecipeDisplayProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [servings, setServings] = useState(initialRecipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isScaling, setIsScaling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleServingsChange = (value: number[]) => {
    const newServings = value[0];
    setServings(newServings);
    setIsScaling(true);
    
    // Debounce the scaling
    setTimeout(() => {
      setRecipe(scaleRecipe(initialRecipe, newServings));
      setIsScaling(false);
    }, 150);
  };

  const handleDownloadCSV = () => {
    const csv = generateShoppingListCSV(recipe);
    const filename = `shopping-list-${recipe.recipe_name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    toast({
      title: "Downloaded!",
      description: "Shopping list saved to your device.",
    });
  };

  const handleCopyList = async () => {
    const list = recipe.shopping_list
      .map((item) => `${formatQuantity(item.quantity)} ${item.unit} ${item.name}`)
      .join('\n');
    
    await navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Shopping list copied to clipboard.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handleSave = async () => {
    if (!onSave) {
      // Not logged in or not premium
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to save recipes to your collection.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
          >
            Upgrade
          </Button>
        ),
      });
      return;
    }

    setIsSaving(true);
    await onSave(initialRecipe, humanReadable);
    setIsSaving(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      <Tabs defaultValue="recipe" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
          <TabsTrigger
            value="recipe"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            <CookingPot className="h-4 w-4 mr-2" />
            Recipe
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            {"{ }"}
            <span className="ml-2">JSON Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipe" className="p-0">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {recipe.recipe_name}
                </h2>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    <Users className="h-4 w-4" />
                    {servings} servings
                    {recipe.scaling_factor && recipe.scaling_factor !== 1 && (
                      <span className="text-xs opacity-75">(scaled)</span>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    {recipe.times.total_min} min total
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 no-print">
                {isSaved ? (
                  <Button variant="success" size="sm" disabled>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </Button>
                ) : canSave ? (
                  <Button 
                    variant="teal" 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Bookmark className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                  >
                    <Crown className="h-4 w-4" />
                    Save
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Scaling Control */}
            <div className="p-4 bg-muted/50 rounded-xl no-print">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Scale Servings</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-8">1</span>
                <Slider
                  value={[servings]}
                  onValueChange={handleServingsChange}
                  min={1}
                  max={12}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">12</span>
              </div>
              {isScaling && (
                <p className="text-xs text-muted-foreground mt-2">Scaling ingredients...</p>
              )}
            </div>

            {/* Time Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <p className="text-2xl font-bold text-foreground">{recipe.times.prep_min}</p>
                <p className="text-sm text-muted-foreground">Prep (min)</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <p className="text-2xl font-bold text-foreground">{recipe.times.cook_min}</p>
                <p className="text-sm text-muted-foreground">Cook (min)</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-xl">
                <p className="text-2xl font-bold text-primary">{recipe.times.total_min}</p>
                <p className="text-sm text-muted-foreground">Total (min)</p>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`ingredient-${index}`}
                      checked={checkedIngredients.has(index)}
                      onCheckedChange={() => toggleIngredient(index)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className={`flex-1 cursor-pointer ${
                        checkedIngredients.has(index)
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      <span className="font-medium">
                        {formatQuantity(ingredient.quantity)} {ingredient.unit}
                      </span>{" "}
                      {ingredient.name}
                      {ingredient.notes && (
                        <span className="text-muted-foreground text-sm ml-2">
                          ({ingredient.notes})
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Equipment</h3>
                <ul className="flex flex-wrap gap-2">
                  {recipe.equipment.map((item, index) => (
                    <li
                      key={index}
                      className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Instructions</h3>
              <ol className="space-y-4">
                {recipe.steps.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-foreground">{step.instruction}</p>
                      {step.time_min && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.time_min} min
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Shopping List */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Shopping List
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 p-4 bg-muted/30 rounded-xl">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={handleCopyList}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
                <ul className="space-y-1">
                  {recipe.shopping_list.map((item, index) => (
                    <li key={index} className="text-sm text-foreground">
                      • {formatQuantity(item.quantity)} {item.unit} {item.name}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>

            {/* Nutrition */}
            {recipe.nutrition_per_serving && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <h4 className="font-medium text-foreground mb-3">Nutrition per serving</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {recipe.nutrition_per_serving.calories_kcal && (
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {recipe.nutrition_per_serving.calories_kcal}
                      </p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                  )}
                  {recipe.nutrition_per_serving.protein_g && (
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {recipe.nutrition_per_serving.protein_g}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                  )}
                  {recipe.nutrition_per_serving.carbs_g && (
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {recipe.nutrition_per_serving.carbs_g}g
                      </p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                  )}
                  {recipe.nutrition_per_serving.fat_g && (
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {recipe.nutrition_per_serving.fat_g}g
                      </p>
                      <p className="text-xs text-muted-foreground">Fat</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Substitutions */}
            {recipe.substitutions && recipe.substitutions.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-accent" />
                      Substitutions
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <ul className="space-y-2 p-4 bg-accent/10 rounded-xl">
                    {recipe.substitutions.map((sub, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Safety Notes */}
            {recipe.safety_notes && recipe.safety_notes.length > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Safety Notes
                </h4>
                <ul className="space-y-1">
                  {recipe.safety_notes.map((note, index) => (
                    <li key={index} className="text-sm text-foreground">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="json" className="p-0">
          <div className="p-6">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={async () => {
                  await navigator.clipboard.writeText(JSON.stringify(recipe, null, 2));
                  toast({
                    title: "Copied!",
                    description: "JSON data copied to clipboard.",
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="p-4 bg-muted rounded-xl overflow-x-auto text-sm">
                <code className="text-foreground">
                  {JSON.stringify(recipe, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}