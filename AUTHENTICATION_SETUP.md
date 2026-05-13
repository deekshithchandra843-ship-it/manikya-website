# Passwordless Authentication Setup

This project includes a complete passwordless authentication system using OTP (One-Time Password) and Magic Links for both email and phone authentication.

## Features Implemented

### 1. **User Authentication**
- ✅ Email login with OTP or Magic Link
- ✅ Phone login with OTP
- ✅ 6-digit OTP verification page
- ✅ Resend OTP functionality with 60-second countdown
- ✅ Login/Logout state management
- ✅ Usage analytics tracking

### 2. **Login Analytics Dashboard**
- ✅ Total login attempts
- ✅ Success rate calculation
- ✅ Email vs Phone login breakdown
- ✅ Detailed login history table
- ✅ Real-time tracking

## Demo Usage

### For Users:
1. Navigate to `/login` or click "Login" button in header
2. Choose email or phone authentication
3. For email: Toggle magic link or OTP option
4. Enter your email/phone and click send
5. For OTP: Enter code **123456** (demo)
6. For Magic Link: Check email (simulated)

### For Admin:
1. Login to admin at `/admin`
2. Navigate to Dashboard
3. Click "View Analytics" to see login tracking

## Production Setup with Supabase

### Step 1: Enable Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** and **Phone** providers

### Step 2: Configure Email Templates

In Supabase Dashboard → Authentication → Email Templates:

**Magic Link Template:**
```html
<h2>Magic Link</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
```

**OTP Template:**
```html
<h2>Your verification code</h2>
<p>Enter this code to sign in: <strong>{{ .Token }}</strong></p>
<p>This code expires in 60 seconds.</p>
```

### Step 3: Create Analytics Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE login_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT CHECK (method IN ('email', 'phone')) NOT NULL,
  type TEXT CHECK (type IN ('otp', 'magic_link')) NOT NULL,
  identifier TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Add index for faster queries
CREATE INDEX idx_login_analytics_timestamp ON login_analytics(timestamp DESC);
CREATE INDEX idx_login_analytics_user_id ON login_analytics(user_id);

-- Enable Row Level Security
ALTER TABLE login_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all analytics
CREATE POLICY "Admins can view all login analytics"
ON login_analytics FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  )
);
```

### Step 4: Update Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Install Supabase Client

```bash
pnpm install @supabase/supabase-js
```

### Step 6: Activate Real Authentication

The code already has TODO comments showing where to integrate Supabase. Simply:

1. Uncomment the Supabase code blocks in:
   - `/src/app/pages/auth/Login.tsx`
   - `/src/app/pages/auth/VerifyOTP.tsx`
   - `/src/app/pages/admin/LoginAnalytics.tsx`

2. Create Supabase client at `/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Analytics Tracking

### Tracked Data Points:
- Login method (email/phone)
- Login type (OTP/magic link)
- User identifier (email/phone number)
- Status (success/failed/pending)
- Timestamp
- User ID (after successful login)

### Viewing Analytics:
Navigate to `/admin/analytics` to view:
- Total login attempts
- Success rate percentage
- Email vs Phone breakdown
- Detailed attempt history

## Security Features

1. **OTP Expiry**: 60 seconds for resend countdown
2. **Magic Link Security**: One-time use links
3. **Rate Limiting**: Implement in Supabase Edge Functions
4. **Row Level Security**: Enabled on analytics table
5. **No Password Storage**: Completely passwordless

## Phone Authentication Setup

For production phone authentication:

1. Enable Phone auth in Supabase
2. Configure Twilio integration in Supabase Dashboard
3. Add your Twilio credentials
4. Test with real phone numbers

## Testing

### Demo Credentials:
- Email: any valid email format
- Phone: +91 followed by 10 digits
- OTP Code: **123456**

### Production Testing:
1. Use your real email/phone
2. Check email inbox or SMS
3. Enter received OTP or click magic link
4. Verify login analytics are tracked

## Best Practices

1. **Rate Limiting**: Add Supabase Edge Functions to limit attempts
2. **Email Verification**: Ensure email is verified before sensitive operations
3. **Session Management**: Use Supabase session handling
4. **Analytics Privacy**: Don't store sensitive PII unnecessarily
5. **Error Handling**: Implement proper error messages

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs/guides/auth
- Email: manikyaservicespvtltd@gmail.com
