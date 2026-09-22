import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const auth = req.headers.get('Authorization') || '';
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401});
    const { amount, receipt } = await req.json();
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')!, keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const basic = btoa(`${keyId}:${keySecret}`);
    const r = await fetch('https://api.razorpay.com/v1/orders', { method:'POST', headers:{Authorization:`Basic ${basic}`,'Content-Type':'application/json'}, body:JSON.stringify({amount:Math.round(amount*100),currency:'INR',receipt:receipt||`rd_${Date.now()}`}) });
    const body = await r.text();
    return new Response(body,{status:r.status,headers:{'Content-Type':'application/json'}});
  } catch(e) { return new Response(JSON.stringify({error:String(e)}),{status:500}); }
});
