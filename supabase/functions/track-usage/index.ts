import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_FREE_LIMIT = 5;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.log('Auth error:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing usage request for user: ${user.id}`);

    const { action, recipe_name } = await req.json();

    if (action === 'check') {
      // Check current usage for today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const { count, error: countError } = await supabaseClient
        .from('recipe_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('generated_at', startOfDay.toISOString());

      if (countError) {
        console.error('Error checking usage:', countError);
        throw countError;
      }

      const usedToday = count || 0;
      const remaining = Math.max(0, DAILY_FREE_LIMIT - usedToday);

      console.log(`User ${user.id} has used ${usedToday} recipes today, ${remaining} remaining`);

      return new Response(
        JSON.stringify({
          used_today: usedToday,
          remaining: remaining,
          limit: DAILY_FREE_LIMIT,
          can_generate: remaining > 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    if (action === 'record') {
      // Record a new recipe generation
      const { error: insertError } = await supabaseClient
        .from('recipe_usage')
        .insert({
          user_id: user.id,
          recipe_name: recipe_name || null,
          generated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error recording usage:', insertError);
        throw insertError;
      }

      console.log(`Recorded recipe generation for user ${user.id}`);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in track-usage function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
