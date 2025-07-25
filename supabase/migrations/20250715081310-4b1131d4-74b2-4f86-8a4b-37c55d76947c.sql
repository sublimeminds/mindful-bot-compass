-- Add more comprehensive country data
INSERT INTO countries (name, country_code, currency_code, currency_symbol, language_code, region, timezone, calling_code) VALUES
-- Major missing countries
('Germany', 'DE', 'EUR', '€', 'de', 'Europe', 'Europe/Berlin', '+49'),
('France', 'FR', 'EUR', '€', 'fr', 'Europe', 'Europe/Paris', '+33'),
('United Kingdom', 'GB', 'GBP', '£', 'en', 'Europe', 'Europe/London', '+44'),
('Italy', 'IT', 'EUR', '€', 'it', 'Europe', 'Europe/Rome', '+39'),
('Spain', 'ES', 'EUR', '€', 'es', 'Europe', 'Europe/Madrid', '+34'),
('Netherlands', 'NL', 'EUR', '€', 'nl', 'Europe', 'Europe/Amsterdam', '+31'),
('Sweden', 'SE', 'SEK', 'kr', 'sv', 'Europe', 'Europe/Stockholm', '+46'),
('Norway', 'NO', 'NOK', 'kr', 'no', 'Europe', 'Europe/Oslo', '+47'),
('Finland', 'FI', 'EUR', '€', 'fi', 'Europe', 'Europe/Helsinki', '+358'),
('Denmark', 'DK', 'DKK', 'kr', 'da', 'Europe', 'Europe/Copenhagen', '+45'),
('Poland', 'PL', 'PLN', 'zł', 'pl', 'Europe', 'Europe/Warsaw', '+48'),
('Czech Republic', 'CZ', 'CZK', 'Kč', 'cs', 'Europe', 'Europe/Prague', '+420'),
('Austria', 'AT', 'EUR', '€', 'de', 'Europe', 'Europe/Vienna', '+43'),
('Switzerland', 'CH', 'CHF', 'CHF', 'de', 'Europe', 'Europe/Zurich', '+41'),
('Belgium', 'BE', 'EUR', '€', 'fr', 'Europe', 'Europe/Brussels', '+32'),
('Portugal', 'PT', 'EUR', '€', 'pt', 'Europe', 'Europe/Lisbon', '+351'),
('Greece', 'GR', 'EUR', '€', 'el', 'Europe', 'Europe/Athens', '+30'),
('Russia', 'RU', 'RUB', '₽', 'ru', 'Europe', 'Europe/Moscow', '+7'),
('Turkey', 'TR', 'TRY', '₺', 'tr', 'Asia', 'Europe/Istanbul', '+90'),
('Japan', 'JP', 'JPY', '¥', 'ja', 'Asia', 'Asia/Tokyo', '+81'),
('South Korea', 'KR', 'KRW', '₩', 'ko', 'Asia', 'Asia/Seoul', '+82'),
('China', 'CN', 'CNY', '¥', 'zh', 'Asia', 'Asia/Shanghai', '+86'),
('India', 'IN', 'INR', '₹', 'hi', 'Asia', 'Asia/Kolkata', '+91'),
('Thailand', 'TH', 'THB', '฿', 'th', 'Asia', 'Asia/Bangkok', '+66'),
('Vietnam', 'VN', 'VND', '₫', 'vi', 'Asia', 'Asia/Ho_Chi_Minh', '+84'),
('Singapore', 'SG', 'SGD', 'S$', 'en', 'Asia', 'Asia/Singapore', '+65'),
('Malaysia', 'MY', 'MYR', 'RM', 'ms', 'Asia', 'Asia/Kuala_Lumpur', '+60'),
('Indonesia', 'ID', 'IDR', 'Rp', 'id', 'Asia', 'Asia/Jakarta', '+62'),
('Philippines', 'PH', 'PHP', '₱', 'en', 'Asia', 'Asia/Manila', '+63'),
('Israel', 'IL', 'ILS', '₪', 'he', 'Asia', 'Asia/Jerusalem', '+972'),
('United Arab Emirates', 'AE', 'AED', 'د.إ', 'ar', 'Asia', 'Asia/Dubai', '+971'),
('Saudi Arabia', 'SA', 'SAR', 'ر.س', 'ar', 'Asia', 'Asia/Riyadh', '+966'),
('Egypt', 'EG', 'EGP', 'ج.م', 'ar', 'Africa', 'Africa/Cairo', '+20'),
('South Africa', 'ZA', 'ZAR', 'R', 'en', 'Africa', 'Africa/Johannesburg', '+27'),
('Nigeria', 'NG', 'NGN', '₦', 'en', 'Africa', 'Africa/Lagos', '+234'),
('Kenya', 'KE', 'KES', 'KSh', 'en', 'Africa', 'Africa/Nairobi', '+254'),
('Morocco', 'MA', 'MAD', 'د.م.', 'ar', 'Africa', 'Africa/Casablanca', '+212'),
('Brazil', 'BR', 'BRL', 'R$', 'pt', 'South America', 'America/Sao_Paulo', '+55'),
('Argentina', 'AR', 'ARS', '$', 'es', 'South America', 'America/Argentina/Buenos_Aires', '+54'),
('Chile', 'CL', 'CLP', '$', 'es', 'South America', 'America/Santiago', '+56'),
('Colombia', 'CO', 'COP', '$', 'es', 'South America', 'America/Bogota', '+57'),
('Peru', 'PE', 'PEN', 'S/', 'es', 'South America', 'America/Lima', '+51'),
('Mexico', 'MX', 'MXN', '$', 'es', 'North America', 'America/Mexico_City', '+52'),
('Canada', 'CA', 'CAD', '$', 'en', 'North America', 'America/Toronto', '+1'),
('United States', 'US', 'USD', '$', 'en', 'North America', 'America/New_York', '+1'),
('Australia', 'AU', 'AUD', '$', 'en', 'Oceania', 'Australia/Sydney', '+61'),
('New Zealand', 'NZ', 'NZD', '$', 'en', 'Oceania', 'Pacific/Auckland', '+64')
ON CONFLICT (country_code) DO UPDATE SET
  name = EXCLUDED.name,
  currency_code = EXCLUDED.currency_code,
  currency_symbol = EXCLUDED.currency_symbol,
  language_code = EXCLUDED.language_code,
  region = EXCLUDED.region,
  timezone = EXCLUDED.timezone,
  calling_code = EXCLUDED.calling_code;