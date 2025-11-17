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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <!-- Header with Mycelium Branding -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="margin-bottom: 16px;">
                <span style="font-size: 48px; display: inline-block; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">🍄</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Mycelium</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">ShipIt Collaboration</p>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #10b981; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">🚀 You're Invited!</h2>
                <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #10b981, #059669); margin: 0 auto; border-radius: 2px;"></div>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #1a1a1a; line-height: 1.8;">
                <strong style="color: #10b981;">${inviterName}</strong> has invited you to collaborate on their ShipIt session as a <strong style="color: #059669;">${accessLevel}</strong>.
              </p>
              
              <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
                <p style="color: #065f46; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>ShipIt</strong> is a gamified project management tool that helps teams ship faster with AI-powered assistance. Join the network and start collaborating!
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${acceptUrl}" 
                   style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                          color: white; 
                          padding: 16px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block; 
                          font-weight: 600;
                          font-size: 16px;
                          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                          transition: all 0.3s ease;">
                  Accept Invitation →
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0; text-align: center;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="color: #10b981; font-size: 12px; margin: 0; word-break: break-all; text-align: center; font-family: monospace;">
                  ${acceptUrl}
                </p>
              </div>
              
              <!-- Footer Info -->
              <div style="border-top: 2px solid #e5e7eb; margin-top: 35px; padding-top: 25px;">
                <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0; text-align: center; line-height: 1.6;">
                  This invitation will expire in 7 days.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
            </div>
            
            <!-- Email Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Sent with 🍄 from <strong style="color: #10b981;">Mycelium</strong>
              </p>
              <p style="color: #d1d5db; font-size: 11px; margin: 8px 0 0 0;">
                © ${new Date().getFullYear()} Mycelium.gg • All rights reserved
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
