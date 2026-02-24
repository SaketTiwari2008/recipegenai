// RecipeGen API Service - Webhook Integration

const WEBHOOK_URL = 'https://ayush-tiwari.app.n8n.cloud/webhook-test/b2d929a2-7fcf-424e-ba47-1d8ca8c078d4';
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  time_min?: number;
}

export interface RecipeTimes {
  prep_min: number;
  cook_min: number;
  total_min: number;
}

export interface RecipeNutrition {
  calories_kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
}

export interface Recipe {
  recipe_name: string;
  servings: number;
  scaling_factor?: number;
  times: RecipeTimes;
  ingredients: RecipeIngredient[];
  equipment: string[];
  steps: RecipeStep[];
  shopping_list: RecipeIngredient[];
  nutrition_per_serving?: RecipeNutrition;
  substitutions?: string[];
  safety_notes?: string[];
  source_notes?: string;
}

export interface WebhookResponse {
  status: string;
  recipe: Recipe;
  human_readable: string;
}

export interface WebhookRequest {
  user_id: string | null;
  message: string;
  context: {
    previous_messages?: string[];
    preferred_language?: string;
    available_ingredients?: string[];
    mode?: string;
  };
  timestamp: string;
}

// Detect if text contains Hindi characters
export function detectLanguage(text: string): 'hi' | 'en' {
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(text) ? 'hi' : 'en';
}

// Parse servings from user message
export function parseServings(message: string): number | null {
  // Match patterns like "for 4", "4 people", "serves 6", "6 लोग"
  const patterns = [
    /for\s+(\d+)/i,
    /(\d+)\s+people/i,
    /(\d+)\s+persons?/i,
    /serves?\s+(\d+)/i,
    /(\d+)\s+लोग/i,
    /(\d+)\s+servings?/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  // Check for written numbers
  const numberWords: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12,
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5,
    'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  };
  
  for (const [word, num] of Object.entries(numberWords)) {
    if (message.toLowerCase().includes(word)) {
      return num;
    }
  }
  
  return null;
}

// Get current user ID from localStorage
function getCurrentUserId(): string | null {
  try {
    const user = localStorage.getItem('recipegen_user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id || null;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

// Validate recipe against schema
export function validateRecipeSchema(recipe: unknown): recipe is Recipe {
  if (!recipe || typeof recipe !== 'object') return false;
  
  const r = recipe as Record<string, unknown>;
  
  return (
    typeof r.recipe_name === 'string' &&
    typeof r.servings === 'number' &&
    typeof r.times === 'object' &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.steps)
  );
}

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Main recipe generation function
export async function generateRecipe(
  userMessage: string,
  context: Partial<WebhookRequest['context']> = {}
): Promise<WebhookResponse> {
  const request: WebhookRequest = {
    user_id: getCurrentUserId(),
    message: userMessage,
    context: {
      preferred_language: detectLanguage(userMessage),
      previous_messages: [],
      ...context,
    },
    timestamp: new Date().toISOString(),
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        WEBHOOK_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        },
        TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      const data = await response.json();
      
      console.log('[RecipeGen] Webhook response:', JSON.stringify(data));

      // Handle different response formats
      // Format 1: Direct response with status and recipe
      if (data.status === 'ok' && data.recipe) {
        if (!validateRecipeSchema(data.recipe)) {
          console.error('[RecipeGen] Recipe validation failed:', data.recipe);
          throw new Error('Invalid recipe format received');
        }
        return data as WebhookResponse;
      }
      
      // Format 2: Recipe at root level (legacy format)
      if (data.recipe_name && data.servings && data.ingredients) {
        console.log('[RecipeGen] Recipe found at root level');
        const webhookResponse: WebhookResponse = {
          status: 'ok',
          recipe: data as Recipe,
          human_readable: formatRecipeAsText(data as Recipe),
        };
        return webhookResponse;
      }
      
      // Format 3: Async workflow response - this means webhook is misconfigured
      if (data.message === 'Workflow was started') {
        console.error('[RecipeGen] Webhook is configured for async mode. Please configure n8n to respond when workflow finishes.');
        throw new Error('Webhook is not returning recipe data. Please check n8n configuration.');
      }
      
      // Unknown format
      console.error('[RecipeGen] Unexpected response format:', data);
      throw new Error('Invalid recipe format received');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new Error('Request timed out');
      }

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Failed to generate recipe');
}

// Scale recipe ingredients
export function scaleRecipe(recipe: Recipe, newServings: number): Recipe {
  const scalingFactor = newServings / recipe.servings;
  
  const scaleQuantity = (qty: number): number => {
    const scaled = qty * scalingFactor;
    if (scaled < 0.25) return Math.round(scaled * 4) / 4; // Round to nearest 0.25
    if (scaled < 1) return Math.round(scaled * 4) / 4;
    if (scaled > 10) return Math.round(scaled);
    return Math.round(scaled * 2) / 2; // Round to nearest 0.5
  };

  return {
    ...recipe,
    servings: newServings,
    scaling_factor: scalingFactor,
    ingredients: recipe.ingredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity),
    })),
    shopping_list: recipe.shopping_list.map(item => ({
      ...item,
      quantity: scaleQuantity(item.quantity),
    })),
  };
}

// Format quantity for display
export function formatQuantity(qty: number): string {
  if (qty === 0.25) return '¼';
  if (qty === 0.5) return '½';
  if (qty === 0.75) return '¾';
  if (qty === 0.33 || qty === 0.34) return '⅓';
  if (qty === 0.67 || qty === 0.66) return '⅔';
  if (Number.isInteger(qty)) return qty.toString();
  return qty.toFixed(1).replace(/\.0$/, '');
}

// Generate shopping list CSV
export function generateShoppingListCSV(recipe: Recipe): string {
  const headers = 'Item,Quantity,Unit,Notes';
  const rows = recipe.shopping_list.map(item => 
    `"${item.name}",${item.quantity},"${item.unit}","${item.notes || ''}"`
  );
  return [headers, ...rows].join('\n');
}

// Format recipe as readable text (fallback)
export function formatRecipeAsText(recipe: Recipe): string {
  let text = `**${recipe.recipe_name}** (Serves ${recipe.servings})\n\n`;
  
  if (recipe.times) {
    text += `⏱️ Prep: ${recipe.times.prep_min} min | Cook: ${recipe.times.cook_min} min | Total: ${recipe.times.total_min} min\n\n`;
  }
  
  text += '### Ingredients:\n';
  recipe.ingredients.forEach((ing) => {
    text += `• ${formatQuantity(ing.quantity)} ${ing.unit} ${ing.name}`;
    if (ing.notes) text += ` (${ing.notes})`;
    text += '\n';
  });
  
  if (recipe.equipment && recipe.equipment.length > 0) {
    text += '\n### Equipment:\n';
    recipe.equipment.forEach((eq) => {
      text += `• ${eq}\n`;
    });
  }
  
  text += '\n### Instructions:\n';
  recipe.steps.forEach((step) => {
    text += `${step.step}. ${step.instruction}`;
    if (step.time_min) text += ` (${step.time_min} min)`;
    text += '\n';
  });
  
  if (recipe.nutrition_per_serving && recipe.nutrition_per_serving.calories_kcal) {
    text += '\n### Nutrition (per serving):\n';
    text += `Calories: ${recipe.nutrition_per_serving.calories_kcal} kcal | `;
    text += `Protein: ${recipe.nutrition_per_serving.protein_g}g | `;
    text += `Fat: ${recipe.nutrition_per_serving.fat_g}g | `;
    text += `Carbs: ${recipe.nutrition_per_serving.carbs_g}g\n`;
  }
  
  if (recipe.substitutions && recipe.substitutions.length > 0) {
    text += '\n### Substitutions:\n';
    recipe.substitutions.forEach((sub) => {
      text += `• ${sub}\n`;
    });
  }
  
  if (recipe.safety_notes && recipe.safety_notes.length > 0) {
    text += '\n⚠️ **Safety Notes:**\n';
    recipe.safety_notes.forEach((note) => {
      text += `• ${note}\n`;
    });
  }
  
  return text;
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Error messages
export const errorMessages = {
  timeout: "Our kitchen is busy! Please try again in a moment. 🍳",
  network_error: "Connection lost. Check your internet and retry. 📡",
  invalid_response: "Recipe didn't cook properly. Let's try again! 🔄",
  rate_limited: "Too many requests. Please wait a minute. ⏰",
  server_error: "Our servers are having trouble. We're fixing it! 🔧",
  webhook_async: "Recipe service is starting up. Please try again in a moment. ⏳",
};

export function getErrorMessage(error: Error): string {
  if (error.message.includes('timeout') || error.message.includes('timed out')) {
    return errorMessages.timeout;
  }
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return errorMessages.network_error;
  }
  if (error.message.includes('n8n') || error.message.includes('Workflow')) {
    return errorMessages.webhook_async;
  }
  if (error.message.includes('Invalid recipe')) {
    return errorMessages.invalid_response;
  }
  if (error.message.includes('429') || error.message.includes('rate')) {
    return errorMessages.rate_limited;
  }
  return errorMessages.server_error;
}
