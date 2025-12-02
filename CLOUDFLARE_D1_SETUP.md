# Cloudflare D1 Database Setup for Newsletter

This guide will help you set up Cloudflare D1 database to store newsletter subscriptions directly in Cloudflare, without needing external services like Resend.

## What is Cloudflare D1?

Cloudflare D1 is a serverless SQLite database that runs on Cloudflare's global network. It's perfect for storing newsletter subscriptions and is completely free for reasonable usage.

## Step 1: Create a D1 Database

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. In the left sidebar, click **Workers & Pages**
4. Click on the **D1** tab
5. Click **Create database**
6. Enter a database name: `galion-newsletter` (or any name you prefer)
7. Select a location (choose closest to your users)
8. Click **Create**

## Step 2: Create the Database Schema

1. In your D1 database page, click **Open Console**
2. Copy and paste the SQL from `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TEXT NOT NULL,
  ip_address TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  unsubscribed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribed_at ON newsletter_subscribers(subscribed_at);
```

3. Click **Run** to execute the SQL
4. Verify the table was created by running: `SELECT * FROM newsletter_subscribers LIMIT 1;`

## Step 3: Bind D1 Database to Your Pages Project

1. Go to your Cloudflare Pages project
2. Click **Settings** → **Functions**
3. Scroll down to **D1 database bindings**
4. Click **Add binding**
5. Enter:
   - **Variable name**: `DB` (must match the code)
   - **D1 database**: Select your database (e.g., `galion-newsletter`)
6. Click **Save**

## Step 4: Deploy Your Changes

1. Commit and push your code changes to GitHub
2. Cloudflare Pages will automatically rebuild
3. The newsletter function will now use D1 to store subscriptions

## Step 5: Test the Newsletter Subscription

1. Visit your website
2. Scroll to the newsletter section
3. Enter an email and subscribe
4. Go back to Cloudflare Dashboard → D1 → Your database → **Open Console**
5. Run: `SELECT * FROM newsletter_subscribers;`
6. You should see your test email in the database!

## Viewing Subscribers

### Via Cloudflare Dashboard

1. Go to **Workers & Pages** → **D1**
2. Click on your database
3. Click **Open Console**
4. Run queries like:
   - `SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC;`
   - `SELECT COUNT(*) as total FROM newsletter_subscribers;`
   - `SELECT email, subscribed_at FROM newsletter_subscribers WHERE consent = 1;`

### Export Subscribers

To export all subscribers as CSV:

1. In D1 Console, run: `SELECT email, subscribed_at, consent FROM newsletter_subscribers;`
2. Copy the results
3. Paste into a spreadsheet or CSV file

## Database Schema

The `newsletter_subscribers` table has the following columns:

- **id**: Auto-incrementing primary key
- **email**: Subscriber's email address (unique, indexed)
- **subscribed_at**: ISO timestamp when they subscribed
- **ip_address**: IP address of subscriber (for analytics/security)
- **consent**: Boolean (0 or 1) - whether they gave GDPR consent
- **unsubscribed_at**: ISO timestamp if they unsubscribe (NULL if active)
- **created_at**: Auto-generated timestamp

## Unsubscribe Feature (Future)

To add unsubscribe functionality later, you can:

1. Create an unsubscribe endpoint that sets `unsubscribed_at`
2. Filter out unsubscribed emails when exporting: `SELECT * FROM newsletter_subscribers WHERE unsubscribed_at IS NULL;`

## Rate Limiting

The current implementation includes basic rate limiting by IP address. For production, consider:

- Using Cloudflare Rate Limiting rules
- Implementing more sophisticated rate limiting in the function
- Using Cloudflare KV for distributed rate limiting

## Security Notes

- Email addresses are stored in plain text (normal for newsletter lists)
- IP addresses are stored for security/analytics purposes
- The database is only accessible through your Cloudflare Functions
- All queries are parameterized to prevent SQL injection

## Cost

Cloudflare D1 is **free** for:
- 5 million reads per month
- 100,000 writes per month
- 5 GB storage

This is more than enough for most newsletter use cases!

## Troubleshooting

### "DB is not defined" error

- Make sure you've bound the D1 database to your Pages project
- The binding name must be exactly `DB` (case-sensitive)
- Redeploy your Pages project after adding the binding

### "Table doesn't exist" error

- Make sure you've run the SQL schema in the D1 Console
- Check that the table name is exactly `newsletter_subscribers`

### Can't see subscribers

- Check the D1 Console to verify data is being inserted
- Check Cloudflare Pages Function logs for errors
- Verify the function is being called (check network tab in browser)

---

For more information, see [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)

