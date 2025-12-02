# D1 Database Query Commands

Useful commands to check and manage newsletter subscribers in your D1 database.

## Prerequisites

Make sure you're logged into Wrangler:
```bash
npx wrangler login
```

## Check All Subscribers

View all newsletter subscribers:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC;"
```

## View Recent Subscribers (Last 10)

View the 10 most recent subscribers:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT email, subscribed_at, consent FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 10;"
```

## Count Total Subscribers

Get the total number of subscribers:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT COUNT(*) as total FROM newsletter_subscribers;"
```

## View Subscribers from Last 7 Days

View subscribers from the last week:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT email, subscribed_at, ip_address FROM newsletter_subscribers WHERE subscribed_at > datetime('now', '-7 days') ORDER BY subscribed_at DESC;"
```

## View Active Subscribers Only

View only active subscribers (not unsubscribed):
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT email, subscribed_at FROM newsletter_subscribers WHERE unsubscribed_at IS NULL ORDER BY subscribed_at DESC;"
```

## Export Subscribers (CSV format)

Export all active subscribers:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT email, subscribed_at, consent FROM newsletter_subscribers WHERE unsubscribed_at IS NULL ORDER BY subscribed_at DESC;" --output=json > subscribers.json
```

## Check Specific Email

Check if a specific email is subscribed:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="SELECT * FROM newsletter_subscribers WHERE email = 'example@email.com';"
```

## View Table Structure

Check the table structure:
```bash
npx wrangler d1 execute galion-newsletter2 --remote --command="PRAGMA table_info(newsletter_subscribers);"
```

## Alternative: Use Cloudflare Dashboard

You can also query the database directly in the Cloudflare Dashboard:

1. Go to **Workers & Pages** → **D1**
2. Click on `galion-newsletter2`
3. Click **Open Console**
4. Run any of the SQL queries above

