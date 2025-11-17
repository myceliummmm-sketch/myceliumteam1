import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  inviteToken: string;
  invitedEmail: string;
  invitedBy: string;
  accessLevel: string;
  sessionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inviteToken, invitedEmail, invitedBy, accessLevel, sessionId }: InviteEmailRequest = await req.json();

    console.log('send-invite-email payload', { invitedEmail, invitedBy, accessLevel, sessionId });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get inviter's username
    const { data: inviter } = await supabase
      .from('players')
      .select('username, email')
      .eq('id', invitedBy)
      .single();

    const inviterName = inviter?.username || inviter?.email?.split('@')[0] || 'A team member';
    const acceptUrl = `${req.headers.get('origin') || 'http://localhost:5173'}/accept-invite?token=${inviteToken}`;

    const emailResponse = await resend.emails.send({
      from: "ShipIt <invites@mycelium.gg>",
      to: [invitedEmail.trim()],
      subject: `${inviterName} invited you to collaborate on ShipIt`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🚀 You're Invited!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${inviterName}</strong> has invited you to collaborate on their ShipIt session as a <strong>${accessLevel}</strong>.
              </p>
              
              <p style="color: #666; margin-bottom: 25px;">
                ShipIt is a gamified project management tool that helps teams ship faster with AI-powered assistance.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${acceptUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 32px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block; 
                          font-weight: 600;
                          font-size: 16px;">
                  Accept Invitation
                </a>
              </div>
              
              <p style="color: #888; font-size: 14px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                Or copy and paste this link: <br/>
                <span style="color: #667eea; word-break: break-all;">${acceptUrl}</span>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse && (emailResponse as any).error) {
      const err = (emailResponse as any).error;
      console.error("Resend error while sending invite:", err);
      return new Response(
        JSON.stringify({ success: false, error: err.message || 'Email send failed', details: emailResponse }),
        {
          status: err.statusCode || 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Invite email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: (emailResponse as any).data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invite-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
