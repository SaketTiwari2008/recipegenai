import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Trash2,
  ChefHat,
  Crown,
  BookOpen,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { Recipe } from "@/services/api.service";

export default function SavedRecipesPage() {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const { savedRecipes, isLoading, deleteRecipe } = useSavedRecipes();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteRecipe(id);
    setDeletingId(null);
  };

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-6">
              <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your saved recipes.
              </p>
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Not subscribed
  if (!subscription.subscribed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-6">
              <Crown className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Premium Feature</h2>
              <p className="text-muted-foreground mb-6">
                Upgrade to Premium to save and manage your favorite recipes.
              </p>
              <Button onClick={() => navigate("/pricing")}>
                <Crown className="h-4 w-4 mr-2" />
                View Plans
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Saved Recipes</h1>
            <p className="text-muted-foreground mt-1">
              Your personal recipe collection
            </p>
          </div>
          <Button onClick={() => navigate("/chat")}>
            <ChefHat className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading recipes...</span>
          </div>
        ) : savedRecipes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Saved Recipes Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start cooking! Generate a recipe and save it to your collection.
              </p>
              <Button onClick={() => navigate("/chat")}>
                <ChefHat className="h-4 w-4 mr-2" />
                Generate Recipe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedRecipes.map((saved) => {
              const recipe = saved.recipe_data as Recipe;
              return (
                <Card key={saved.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {saved.recipe_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {recipe.servings} servings
                      </span>
                      {recipe.times && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {recipe.times.total_min} min
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Ingredients preview */}
                      <div>
                        <p className="text-sm font-medium mb-1">Ingredients</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.ingredients?.slice(0, 4).map(i => i.name).join(", ")}
                          {recipe.ingredients && recipe.ingredients.length > 4 && "..."}
                        </p>
                      </div>

                      {/* Notes if any */}
                      {saved.notes && (
                        <div>
                          <p className="text-sm font-medium mb-1">Notes</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {saved.notes}
                          </p>
                        </div>
                      )}

                      {/* Saved date */}
                      <p className="text-xs text-muted-foreground">
                        Saved {new Date(saved.created_at).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/chat?recipe=${encodeURIComponent(saved.recipe_name)}`)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Full
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={deletingId === saved.id}
                            >
                              {deletingId === saved.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{saved.recipe_name}" from your collection? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(saved.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
