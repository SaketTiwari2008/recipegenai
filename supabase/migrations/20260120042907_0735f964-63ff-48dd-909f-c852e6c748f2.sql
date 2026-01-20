-- Create recipe_usage table to track daily recipe generations per user
CREATE TABLE public.recipe_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recipe_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recipe_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe_usage
CREATE POLICY "Users can view their own usage"
ON public.recipe_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.recipe_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create saved_recipes table for Premium subscribers
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_data JSONB NOT NULL,
  human_readable TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_recipes (Premium only - will be checked in application layer)
CREATE POLICY "Users can view their own saved recipes"
ON public.saved_recipes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recipes"
ON public.saved_recipes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recipes"
ON public.saved_recipes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recipes"
ON public.saved_recipes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_recipe_usage_user_date ON public.recipe_usage (user_id, generated_at);
CREATE INDEX idx_saved_recipes_user ON public.saved_recipes (user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on saved_recipes
CREATE TRIGGER update_saved_recipes_updated_at
BEFORE UPDATE ON public.saved_recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();