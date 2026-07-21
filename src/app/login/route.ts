import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateAvatarUrl } from "@/lib/avatar";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session) {
      const user = data.session.user;
      
      // Auto-sync Profile to Database
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
        const email = user.email || "";
        // ALWAYS use generated avatar
        const avatar_url = generateAvatarUrl(email);
        
        // Read first to avoid overwriting user's manual changes if they already exist
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("avatar_url, name")
          .eq("id", user.id)
          .single();

        // Only sync if the DB is empty
        if (!existingProfile?.avatar_url || !existingProfile?.name) {
          await supabase.from("profiles").upsert({
            id: user.id,
            name: existingProfile?.name || name,
            avatar_url: existingProfile?.avatar_url || avatar_url,
            updated_at: new Date().toISOString()
          });
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/`);
}
