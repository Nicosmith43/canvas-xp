import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.118.0"

const CANVAS_CLIENT_ID = Deno.env.get('CANVAS_CLIENT_ID')
const CANVAS_CLIENT_SECRET = Deno.env.get('CANVAS_CLIENT_SECRET')
const REDIRECT_URI = Deno.env.get('CANVAS_REDIRECT_URI')

serve(async (req) => {
  const { url, method } = req
  const parsedUrl = new URL(url)
  const path = parsedUrl.pathname
  
  // 1. Initial Authorization Request
  if (path === '/canvas-oauth/authorize' && method === 'GET') {
    const authUrl = `https://unco.instructure.com/login/oauth2/auth?client_id=${CANVAS_CLIENT_ID}&response_type=code&state=canvasxp&redirect_uri=${REDIRECT_URI}&scope=url:GET|/api/v1/users/self/todo`
    
    return new Response(null, {
      status: 302,
      headers: { Location: authUrl }
    })
  }

  // 2. Callback from Canvas
  if (path === '/canvas-oauth/callback' && method === 'GET') {
    const code = parsedUrl.searchParams.get('code')
    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), { status: 400 })
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://unco.instructure.com/login/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CANVAS_CLIENT_ID,
        client_secret: CANVAS_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      })
    })

    const tokenData = await tokenResponse.json()
    
    if (tokenData.access_token) {
      // Securely store the token in Supabase (CanvasConnections table)
      // Note: In a real app, we'd encrypt this or use Supabase Vault
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Get user from auth context (requires passing user ID or session)
      // For this scaffold, we'll just return the token (NOT FOR PRODUCTION)
      return new Response(JSON.stringify({ 
        message: 'Successfully connected to Canvas!',
        expires_in: tokenData.expires_in 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
})
