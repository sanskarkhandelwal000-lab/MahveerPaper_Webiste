# WhatsApp Inbox — setup & operations

The inbox lives at **`/inbox`** on the website. It is a full team inbox for your WhatsApp Business number:
live chats, manual replies, media, templates, bulk campaigns, contacts, notes, labels, sample requests,
analytics and team logins — plus the AI product bot (moved here from Make.com).

## Try it locally (no accounts needed)

```bash
npm run dev            # then open http://localhost:3000/inbox
```

Sign in with `admin@mahaveer.local` / `admin123` (development only). With no WhatsApp credentials it runs in
**Test mode**: everything works, but nothing is sent to WhatsApp. To load sample chats, set `INBOX_DEMO=1`
(or `POST /api/inbox/dev/seed` while signed in). In Test mode you can inject a customer message with
`POST /api/inbox/dev/simulate {"from":"919800000001","name":"Test","text":"Hi"}`.

## Going live — checklist

### 1. Database + file storage (Supabase, free tier is enough to start)
1. Create a project at supabase.com.
2. **Project Settings → Database → Connection string → URI** (use the *Transaction pooler*) → `DATABASE_URL`.
3. **Project Settings → API** → `SUPABASE_URL` and the `service_role` key → `SUPABASE_SERVICE_KEY`.
   The private `inbox-media` bucket is created automatically. Never expose the service key to the browser.
4. Tables are created automatically on first start. Nothing to run.

### 2. Website environment variables (Vercel → Settings → Environment Variables)
`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `INBOX_SESSION_SECRET` (32+ random characters),
`INBOX_ADMIN_EMAIL`, `INBOX_ADMIN_PASSWORD`, `ANTHROPIC_API_KEY` (already set for the site chatbot).
Then redeploy and sign in at `/inbox`; change the password from the account menu.

### 3. Meta (WhatsApp) credentials — `developers.facebook.com`
| Variable | Where to find it |
|---|---|
| `WA_ACCESS_TOKEN` | Use a **permanent System User token** (Business Settings → System users → Generate token, permissions `whatsapp_business_messaging` + `whatsapp_business_management`). Temporary tokens expire in 24h. |
| `WA_PHONE_NUMBER_ID` | WhatsApp → API Setup |
| `WA_WABA_ID` | WhatsApp → API Setup ("WhatsApp Business Account ID") — needed for templates |
| `WA_APP_SECRET` | App settings → Basic → App secret — used to verify webhooks are really from Meta |
| `WA_VERIFY_TOKEN` | Any random string you choose |

### 4. Point Meta's webhook at the website — **do this last, and only when ready to switch**
Meta allows **one** webhook URL per app. Today it points at Make.com. Switching moves *all* incoming
messages to the website:

1. In the inbox go to **Settings**, switch the bot **ON**, and confirm every item in the connection checklist is ticked.
2. Meta → WhatsApp → Configuration → Webhook: set **Callback URL** to `https://<your-domain>/api/whatsapp/webhook`
   and **Verify token** to your `WA_VERIFY_TOKEN`, click Verify and Save, and subscribe to **messages**.
3. Turn the Make.com scenario **off** (otherwise it would no longer receive anything anyway, and its
   Google-Sheet log stops).
4. Send "Hi" from your phone: you should see the chat appear in the inbox and the bot reply.

**Rollback:** set the callback URL back to the Make.com webhook and turn the Make scenario on. Nothing else
needs undoing. Chats already stored stay in the inbox.

### 5. Scheduled campaigns (optional)
Campaigns started with **Send now** run immediately. **Scheduled** campaigns start when someone has the
Campaigns page open, or automatically if you add a scheduled job that calls `GET /api/cron/campaigns` with the
header `Authorization: Bearer $CRON_SECRET` every minute (Vercel Cron on a paid plan, or any external pinger).

## Things WhatsApp itself does not allow (true of every provider, including WATI/Interakt)
* **24-hour window:** free-form replies only within 24h of the customer's last message; otherwise use an approved template.
* **Bulk/marketing messages** must use approved templates, only to people who opted in, and are billed by Meta.
* No group chats, calls, Status, channels, or disappearing messages via the API; no "typing…"/online indicator.
* History from before you connected the webhook can't be imported — only new messages are stored.
* Voice notes can be received and played, but recording in the browser isn't supported (WhatsApp needs OGG/Opus).

## Operations notes
* **Roles:** *Admin* manages team, labels, templates, settings, and can delete. *Agent* chats, notes, campaigns.
* **Bot vs human:** replying manually pauses the bot for that chat; "Hand back to bot" resumes it. Customers who
  ask for a person (or you flag a chat) show under **Needs a human**.
* **Opt-out:** customers replying `STOP` are opted out of promotions automatically (`START` opts back in).
* **Media** is stored in Supabase Storage; WhatsApp only keeps inbound media for ~30 days, so it's saved on arrival.
* Everything is behind login; `/inbox` and `/api/` are excluded from search engines in `robots.txt`.
