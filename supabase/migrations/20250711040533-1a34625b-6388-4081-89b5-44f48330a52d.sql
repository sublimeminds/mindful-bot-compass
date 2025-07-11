-- Insert sample email templates for the comprehensive notification system

-- Subscription expiration warning templates
INSERT INTO email_templates (template_key, language_code, subject, html_content, text_content, category, variables) VALUES
('subscription_expiration_warning', 'en', '⚠️ Your subscription expires in {{daysRemaining}} days', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Subscription Expiration Warning</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">TherapySync AI</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your wellness companion</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #dc2626; margin-top: 0;">⚠️ Subscription Expiring Soon</h2>
    <p>Hi {{userName}},</p>
    <p>Your {{planName}} subscription will expire in <strong>{{daysRemaining}} days</strong> on {{expirationDate}}.</p>
    <p>To continue enjoying unlimited access to your AI therapy sessions, progress tracking, and premium features, please renew your subscription.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{renewUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🔄 Renew Subscription
      </a>
    </div>
    <p>Need help? Our support team is here for you.</p>
    <p>Best regards,<br>The TherapySync AI Team</p>
  </div>
</body>
</html>', 'Your subscription expires in {{daysRemaining}} days. Renew at {{renewUrl}}', 'subscription', '["userName", "daysRemaining", "expirationDate", "renewUrl", "planName"]'),

('trial_expiration_warning', 'en', '🎯 {{daysRemaining}} days left in your free trial', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Trial Expiration Warning</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">TherapySync AI</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your wellness companion</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #059669; margin-top: 0;">🎯 Free Trial Ending Soon</h2>
    <p>Hi {{userName}},</p>
    <p>You have <strong>{{daysRemaining}} days</strong> left in your free trial, ending on {{trialEndDate}}.</p>
    <p>Don''t lose access to your progress and premium features! Upgrade now to continue your wellness journey.</p>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #374151;">Premium Features Include:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Unlimited therapy sessions</li>
        <li>Advanced progress analytics</li>
        <li>Priority support</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{upgradeUrl}}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        ⬆️ Upgrade Now
      </a>
    </div>
    <p>Questions? We''re here to help!</p>
    <p>Best regards,<br>The TherapySync AI Team</p>
  </div>
</body>
</html>', 'Your free trial ends in {{daysRemaining}} days. Upgrade at {{upgradeUrl}}', 'trial', '["userName", "daysRemaining", "trialEndDate", "upgradeUrl", "features"]'),

('payment_failed_immediate', 'en', '🚨 Payment Failed - Action Required', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Failed</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Payment Issue</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Immediate attention required</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #dc2626; margin-top: 0;">🚨 Payment Failed</h2>
    <p>Hi {{userName}},</p>
    <p>We were unable to process your payment for your {{planName}} subscription. Your account access may be limited until this is resolved.</p>
    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold;">What you need to do:</p>
      <ol style="margin: 10px 0; padding-left: 20px;">
        <li>Update your payment method</li>
        <li>Ensure sufficient funds are available</li>
        <li>Contact your bank if needed</li>
      </ol>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{updatePaymentUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        💳 Update Payment Method
      </a>
    </div>
    <p>Need assistance? <a href="{{supportUrl}}">Contact our support team</a></p>
    <p>Best regards,<br>The TherapySync AI Team</p>
  </div>
</body>
</html>', 'Payment failed for your subscription. Update payment method at {{updatePaymentUrl}}', 'billing', '["userName", "planName", "updatePaymentUrl", "supportUrl"]'),

('newsletter_welcome', 'en', '🌟 Welcome to TherapySync AI Newsletter', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Newsletter Welcome</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">TherapySync AI Newsletter</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your weekly dose of wellness insights</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #059669; margin-top: 0;">🌟 Welcome to Our Community!</h2>
    <p>Hi {{userName}},</p>
    <p>Welcome to the TherapySync AI newsletter! We''re excited to share valuable mental health insights, tips, and updates with you.</p>
    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #059669;">What to Expect:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>🧠 Evidence-based mental health tips</li>
        <li>📊 Progress tracking strategies</li>
        <li>🎯 Goal-setting techniques</li>
        <li>🆕 New feature announcements</li>
        <li>🤝 Community success stories</li>
      </ul>
    </div>
    <p>We''ll send you valuable content weekly, and you can unsubscribe at any time.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🎯 Visit Your Dashboard
      </a>
    </div>
    <p>Here''s to your wellness journey!</p>
    <p>Best regards,<br>The TherapySync AI Team</p>
    <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a> | 
      <a href="{{preferencesUrl}}" style="color: #6b7280;">Manage Preferences</a>
    </p>
  </div>
</body>
</html>', 'Welcome to TherapySync AI newsletter! Visit {{dashboardUrl}} to get started.', 'newsletter', '["userName", "dashboardUrl", "unsubscribeUrl", "preferencesUrl"]'),

('upsell_premium_features', 'en', '🚀 Unlock Premium Features - {{discount}}% Off!', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Premium Upsell</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Upgrade Available</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Limited time offer</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #7c3aed; margin-top: 0;">Unlock Your Full Potential</h2>
    <p>Hi {{userName}},</p>
    <p>Ready to take your wellness journey to the next level? Upgrade to {{targetPlan}} and unlock powerful features that will accelerate your progress.</p>
    <div style="background: #faf5ff; border: 2px solid #a855f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #7c3aed;">🎯 {{targetPlan}} Features:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>✨ Unlimited therapy sessions</li>
        <li>📊 Advanced progress analytics</li>
        <li>🎯 Custom goal templates</li>
        <li>📤 Export your data</li>
        <li>🚀 Priority support</li>
      </ul>
    </div>
    <div style="text-align: center; padding: 20px; background: #f59e0b; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0; color: white;">⚡ Special Offer: {{discount}}% OFF</h3>
      <p style="margin: 10px 0 0 0; color: white; font-size: 14px;">Limited time - upgrade now!</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{upgradeUrl}}" style="background-color: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        🚀 Upgrade to {{targetPlan}}
      </a>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Offer valid until {{validUntil}}</p>
    <p>Questions? Reply to this email!</p>
    <p>Best regards,<br>The TherapySync AI Team</p>
  </div>
</body>
</html>', 'Upgrade to {{targetPlan}} with {{discount}}% off! {{upgradeUrl}}', 'upsell', '["userName", "targetPlan", "discount", "upgradeUrl", "validUntil", "features"]');

-- Insert Spanish translations
INSERT INTO email_templates (template_key, language_code, subject, html_content, text_content, category, variables) VALUES
('subscription_expiration_warning', 'es', '⚠️ Tu suscripción expira en {{daysRemaining}} días', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Advertencia de Expiración</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">TherapySync AI</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu compañero de bienestar</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #dc2626; margin-top: 0;">⚠️ Suscripción Expirando Pronto</h2>
    <p>Hola {{userName}},</p>
    <p>Tu suscripción {{planName}} expirará en <strong>{{daysRemaining}} días</strong> el {{expirationDate}}.</p>
    <p>Para continuar disfrutando del acceso ilimitado a tus sesiones de terapia con IA, seguimiento de progreso y funciones premium, renueva tu suscripción.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{renewUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🔄 Renovar Suscripción
      </a>
    </div>
    <p>¿Necesitas ayuda? Nuestro equipo de soporte está aquí para ti.</p>
    <p>Saludos cordiales,<br>El Equipo de TherapySync AI</p>
  </div>
</body>
</html>', 'Tu suscripción expira en {{daysRemaining}} días. Renueva en {{renewUrl}}', 'subscription', '["userName", "daysRemaining", "expirationDate", "renewUrl", "planName"]'),

('newsletter_welcome', 'es', '🌟 Bienvenido al Boletín de TherapySync AI', '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bienvenida al Boletín</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Boletín de TherapySync AI</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu dosis semanal de perspicacia sobre bienestar</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <h2 style="color: #059669; margin-top: 0;">🌟 ¡Bienvenido a Nuestra Comunidad!</h2>
    <p>Hola {{userName}},</p>
    <p>¡Bienvenido al boletín de TherapySync AI! Estamos emocionados de compartir contigo perspicacias valiosas sobre salud mental, consejos y actualizaciones.</p>
    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #059669;">Qué Esperar:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>🧠 Consejos de salud mental basados en evidencia</li>
        <li>📊 Estrategias de seguimiento de progreso</li>
        <li>🎯 Técnicas para establecer metas</li>
        <li>🆕 Anuncios de nuevas funciones</li>
        <li>🤝 Historias de éxito de la comunidad</li>
      </ul>
    </div>
    <p>Te enviaremos contenido valioso semanalmente, y puedes cancelar la suscripción en cualquier momento.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🎯 Visita Tu Panel
      </a>
    </div>
    <p>¡Por tu viaje de bienestar!</p>
    <p>Saludos cordiales,<br>El Equipo de TherapySync AI</p>
    <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
      <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Cancelar suscripción</a> | 
      <a href="{{preferencesUrl}}" style="color: #6b7280;">Gestionar preferencias</a>
    </p>
  </div>
</body>
</html>', 'Bienvenido al boletín de TherapySync AI! Visita {{dashboardUrl}} para comenzar.', 'newsletter', '["userName", "dashboardUrl", "unsubscribeUrl", "preferencesUrl"]');