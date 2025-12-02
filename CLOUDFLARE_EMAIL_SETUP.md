# Cloudflare Email Routing Setup Guide

This guide will help you set up email forwarding for all email addresses used on The Galion Initiative website to forward to `info@Galion.studio`.

## Email Addresses Found on Website

Based on scanning the entire codebase, here are all the direct communication email addresses that need to be set up:

### Public Contact Emails:
1. **contact@galioninitiative.org** - General inquiries (Footer, Privacy Policy)
2. **grants@galioninitiative.org** - Donations & partnerships (Footer, Donate section)
3. **press@galioninitiative.org** - Media inquiries (Footer)

### Team Member Emails (Team Page):
4. **maciej@galioninitiative.org** - Maciej Grajczyk (Director & Founder)
5. **aiden@galioninitiative.org** - Dr. Aiden Thompson (Research Director)
6. **sofia@galioninitiative.org** - Dr. Sofia Martinez (Chief Architect)
7. **amara@galioninitiative.org** - Dr. Amara Patel (Ethics & Governance Lead)

---

## Step-by-Step Setup Instructions

### Step 1: Access Cloudflare Email Routing

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: **galioninitiative.org**
3. In the left sidebar, click **Email**
4. Click **Email Routing**

### Step 2: Enable Email Routing (First Time Only)

If you haven't enabled Email Routing yet:

1. Click **Get Started**
2. Cloudflare will prompt you to add DNS records
3. Click **Add records and enable**
   - This automatically adds the necessary MX records to your DNS
   - No manual DNS configuration needed!

### Step 3: Add Destination Address

1. Go to the **Destination addresses** tab
2. Click **Add destination address**
3. Enter: `info@Galion.studio`
4. Click **Send verification email**
5. **IMPORTANT**: Check the inbox for `info@Galion.studio`
6. Open the verification email from Cloudflare
7. Click the **Verify** link in the email
8. The destination address status should change to "Verified" ✅

**Note**: Email forwarding will NOT work until you verify the destination address!

### Step 4: Create Routing Rules

You have two options:

#### Option A: Catch-All (Recommended - Easiest)

This forwards **all emails** sent to `*@galioninitiative.org` to your destination:

1. Go to the **Routing rules** tab
2. Look for **Catch-all address** section
3. Click **Enable catch-all**
4. Set **Action** to: **Send to**
5. Select destination: **info@Galion.studio**
6. Click **Save**

**Benefits:**
- Automatically handles all current and future email addresses
- No need to create individual rules for each address
- Catches typos (e.g., `contat@galioninitiative.org` will still work)

#### Option B: Individual Rules (More Control)

If you prefer to set up each email address individually:

1. Go to the **Routing rules** tab
2. Click **Create address**
3. For each email address:
   - **Custom address**: Enter the part before `@` (e.g., `contact`, `grants`, `press`, `maciej`, etc.)
   - **Action**: Select **Send to**
   - **Destination address**: Select `info@Galion.studio`
   - Click **Create**
4. Repeat for all 7 email addresses listed above

---

## Verification & Testing

After setup, test that forwarding works:

1. Send a test email to `contact@galioninitiative.org` from an external email address
2. Check `info@Galion.studio` inbox - you should receive the forwarded email
3. The email will appear to come from the original sender, but will be forwarded through Cloudflare

**Email Format**: Forwarded emails will show:
- **From**: Original sender's email
- **To**: The address they sent to (e.g., `contact@galioninitiative.org`)
- **Subject**: Original subject line
- **Body**: Original message

---

## Troubleshooting

### Emails Not Arriving?

1. **Check destination verification**: Make sure `info@Galion.studio` is verified (green checkmark)
2. **Check routing rules**: Verify rules are active and pointing to the correct destination
3. **Check spam folder**: Forwarded emails might end up in spam initially
4. **Wait a few minutes**: DNS changes can take up to 24 hours (usually much faster)
5. **Check Cloudflare logs**: Go to Email Routing → Logs to see delivery status

### Need to Change Destination?

1. Go to **Destination addresses** tab
2. Click the three dots (⋯) next to the address
3. Select **Edit** or **Delete**
4. Add a new destination and verify it
5. Update routing rules to use the new destination

### Want to Reply from the Alias?

Cloudflare Email Routing only forwards emails - it doesn't allow you to send emails FROM the alias. To send emails that appear to come from `contact@galioninitiative.org`, you'll need:

1. A full email service (like Google Workspace, Microsoft 365, or Cloudflare Email)
2. Or use your email client's "Send As" feature with SMTP configuration

---

## Additional Notes

- **Free**: Cloudflare Email Routing is completely free
- **No storage**: Cloudflare doesn't store emails - they just forward them
- **Reliable**: Uses Cloudflare's global network for fast delivery
- **Privacy**: Cloudflare doesn't read or scan email content

---

## Quick Reference

**Destination Address**: `info@Galion.studio` (must be verified)

**Email Addresses to Forward**:
- contact@galioninitiative.org
- grants@galioninitiative.org
- press@galioninitiative.org
- maciej@galioninitiative.org
- aiden@galioninitiative.org
- sofia@galioninitiative.org
- amara@galioninitiative.org

**Recommended Setup**: Use Catch-All to forward all `*@galioninitiative.org` emails to `info@Galion.studio`

---

For more information, visit [Cloudflare Email Routing Documentation](https://developers.cloudflare.com/email-routing/)

