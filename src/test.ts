import { serve } from "https://deno.land/std@0.167.0/http/server.ts";

serve((_req) => {
    return new Response("Hello from Deno Deploy!", { status: 200 });
});