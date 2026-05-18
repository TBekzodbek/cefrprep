import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function respond(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function sha256(message: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

function toHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function verifyTelegramHash(
    fields: Record<string, string | number>,
    receivedHash: string,
    botToken: string
): Promise<{ ok: boolean; checkString: string; computedHash: string }> {
    // Build the data-check-string: all fields except hash, sorted alphabetically, joined by \n
    const checkString = Object.entries(fields)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

    const secretKey = await sha256(botToken);            // secret_key = SHA256(bot_token)
    const computedHash = toHex(await hmacSha256(secretKey, checkString));

    return { ok: computedHash === receivedHash, checkString, computedHash };
}

async function derivePassword(botToken: string, telegramId: number): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(botToken),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    return toHex(await crypto.subtle.sign(
        'HMAC', key, new TextEncoder().encode(telegramId.toString())
    ));
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

        // ── Guard: token must be configured ──────────────────
        if (!botToken) {
            console.error('[telegram-auth] TELEGRAM_BOT_TOKEN secret is not set');
            return respond({ error: 'Server misconfiguration: TELEGRAM_BOT_TOKEN not set' }, 500);
        }

        // ── Parse body ────────────────────────────────────────
        let body: Record<string, string | number>;
        try {
            body = await req.json();
        } catch {
            return respond({ error: 'Invalid JSON body' }, 400);
        }

        const { hash, ...userData } = body;

        if (!hash || !userData.id || !userData.auth_date) {
            console.error('[telegram-auth] Missing fields. Received:', Object.keys(body));
            return respond({ error: `Missing required fields. Got: ${Object.keys(body).join(', ')}` }, 400);
        }

        // ── Guard: reject stale data (> 1 hour) ──────────────
        const authAge = Math.floor(Date.now() / 1000) - Number(userData.auth_date);
        console.log(`[telegram-auth] auth_date age: ${authAge}s`);
        if (authAge > 3600) {
            return respond({ error: `Auth data expired (${authAge}s old). Please try again.` }, 401);
        }

        // ── Verify HMAC-SHA256 hash ───────────────────────────
        const { ok, checkString, computedHash } = await verifyTelegramHash(userData, String(hash), botToken);
        console.log(`[telegram-auth] check_string fields: ${checkString.split('\n').map(l => l.split('=')[0]).join(', ')}`);
        console.log(`[telegram-auth] hash match: ${ok}`);
        console.log(`[telegram-auth] bot token prefix: ${botToken.split(':')[0]}`);  // log bot ID only, not secret

        if (!ok) {
            return respond({
                error: `Hash mismatch — check that TELEGRAM_BOT_TOKEN matches the bot used in data-telegram-login. Bot ID in token: ${botToken.split(':')[0]}`,
            }, 401);
        }

        // ── Create / sign in user ─────────────────────────────
        const telegramId = Number(userData.id);
        const email = `tg_${telegramId}@cefracademy.uz`;
        const password = await derivePassword(botToken, telegramId);
        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ');

        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });
        const anonClient = createClient(supabaseUrl, anonKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                telegram_id: telegramId,
                telegram_username: userData.username ?? null,
                avatar_url: userData.photo_url ?? null,
            },
        });

        if (createError && !createError.message.includes('already been registered')) {
            console.error('[telegram-auth] createUser error:', createError.message);
            throw createError;
        }

        if (newUser?.user) {
            await adminClient.from('profiles').upsert(
                { id: newUser.user.id, full_name: fullName, xp: 0, streak: 0, cefr_level: 'A2' },
                { onConflict: 'id', ignoreDuplicates: true }
            );
        }

        const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({ email, password });
        if (signInError) {
            console.error('[telegram-auth] signIn error:', signInError.message);
            throw signInError;
        }

        console.log(`[telegram-auth] success for Telegram ID ${telegramId}`);
        return respond({ session: signInData.session, user: signInData.user }, 200);

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Internal server error';
        console.error('[telegram-auth] unhandled error:', msg);
        return respond({ error: msg }, 500);
    }
});
