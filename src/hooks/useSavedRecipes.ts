import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/services/api.service';

interface SavedRecipe {
  id: string;
  recipe_name: string;
  recipe_data: Recipe;
  human_readable: string | null;
  notes: string | null;
  created_at: string;
}

export function useSavedRecipes() {
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSavedRecipes = useCallback(async () => {
    if (!user || !subscription.subscribed) {
      setSavedRecipes([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved recipes:', error);
        return;
      }

      setSavedRecipes(data as unknown as SavedRecipe[]);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, subscription.subscribed]);

  const saveRecipe = useCallback(async (
    recipe: Recipe,
    humanReadable?: string,
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please sign in to save recipes.",
      });
      return false;
    }

    if (!subscription.subscribed) {
      toast({
        variant: "destructive",
        title: "Premium feature",
        description: "Upgrade to Premium to save recipes.",
      });
      return false;
    }

    try {
      const recipeToInsert = {
        user_id: user.id,
        recipe_name: recipe.recipe_name,
        recipe_data: JSON.parse(JSON.stringify(recipe)),
        human_readable: humanReadable || null,
        notes: notes || null,
      };

      const { error } = await supabase
        .from('saved_recipes')
        .insert(recipeToInsert);

      if (error) {
        console.error('Error saving recipe:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save recipe. Please try again.",
        });
        return false;
      }

      toast({
        title: "Recipe saved! 🎉",
        description: `"${recipe.recipe_name}" has been saved to your collection.`,
      });

      await fetchSavedRecipes();
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      return false;
    }
  }, [user, subscription.subscribed, toast, fetchSavedRecipes]);

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recipe:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete recipe.",
        });
        return false;
      }

      toast({
        title: "Recipe deleted",
        description: "Recipe removed from your collection.",
      });

      await fetchSavedRecipes();
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }, [user, toast, fetchSavedRecipes]);

  const isRecipeSaved = useCallback((recipeName: string): boolean => {
    return savedRecipes.some(r => r.recipe_name === recipeName);
  }, [savedRecipes]);

  useEffect(() => {
    if (user && subscription.subscribed) {
      fetchSavedRecipes();
    }
  }, [user, subscription.subscribed, fetchSavedRecipes]);

  return {
    savedRecipes,
    isLoading,
    saveRecipe,
    deleteRecipe,
    isRecipeSaved,
    fetchSavedRecipes,
    canSave: subscription.subscribed,
  };
}
