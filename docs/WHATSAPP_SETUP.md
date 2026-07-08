# WhatsApp Business Cloud API Setup

WhatsApp is used only as an admin alert channel for the MVP.

Customers stay inside the website. Admin replies from the admin dashboard. Two-way WhatsApp replies are future scope.

## Required Variables

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_AGENT_NUMBER=
WHATSAPP_API_VERSION=v20.0
```

`WHATSAPP_AGENT_NUMBER` should be the admin/agent WhatsApp number in international format, for example `919876543210`.

## Behavior

When an enquiry is submitted:

1. The database row is saved first.
2. The backend attempts a WhatsApp alert.
3. The result is written to `whatsapp_logs`.
4. The enquiry is updated with `whatsapp_status`.

If WhatsApp is missing or fails, the API still returns success for the saved enquiry/chat.

Possible statuses:

- `sent`
- `failed`
- `not_configured`
