import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256(message: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(message));
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
}

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function verifyTelegramData(
    data: Record<string, string | number>,
    hash: string,
    botToken: string
): Promise<boolean> {
    const checkString = Object.entries(data)
        .filter(([k]) => k !== 'hash')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

    const secretKey = await sha256(botToken);
    const computedHash = await hmacSha256(secretKey, checkString);
    return bufferToHex(computedHash) === hash;
}

async function derivePassword(botToken: string, telegramId: number): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(botToken), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(telegramId.toString()));
    return bufferToHex(sig);
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

        if (!botToken) {
            return new Response(
                JSON.stringify({ error: 'Server misconfiguration: missing bot token' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const body = await req.json();
        const { hash, ...userData } = body;

        if (!hash || !userData.id || !userData.auth_date) {
            return new Response(
                JSON.stringify({ error: 'Missing required Telegram fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Reject stale auth data (older than 1 hour)
        const authAge = Math.floor(Date.now() / 1000) - Number(userData.auth_date);
        if (authAge > 3600) {
            return new Response(
                JSON.stringify({ error: 'Telegram auth data expired. Please try again.' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const valid = await verifyTelegramData(userData, hash, botToken);
        if (!valid) {
            return new Response(
                JSON.stringify({ error: 'Invalid Telegram signature' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const telegramId = Number(userData.id);
        const email = `tg_${telegramId}@cefracademy.uz`;
        const password = await derivePassword(botToken, telegramId);
        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ');

        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
        const anonClient = createClient(supabaseUrl, anonKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Try to create user; ignore "already exists" error
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                telegram_id: telegramId,
                telegram_username: userData.username || null,
                avatar_url: userData.photo_url || null,
            },
        });

        if (createError && !createError.message.includes('already been registered')) {
            throw createError;
        }

        // For new users, create the profile row
        if (newUser?.user) {
            await adminClient.from('profiles').upsert({
                id: newUser.user.id,
                full_name: fullName,
                xp: 0,
                streak: 0,
                cefr_level: 'A2',
            }, { onConflict: 'id', ignoreDuplicates: true });
        }

        // Sign in to get a real session
        const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw signInError;

        return new Response(
            JSON.stringify({ session: signInData.session, user: signInData.user }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
