# API Documentation

Base URL locally: `http://localhost:3000/api`

## Health

`GET /api/health`

Returns:

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-05-29T00:00:00.000Z"
}
```

## Submit Enquiry

`POST /api/enquiries`

Required: `name`, `phone`, `service`, `message`

```json
{
  "name": "Rahul Kumar",
  "phone": "+919876543210",
  "email": "rahul@example.com",
  "service": "Education Loan",
  "message": "Need study abroad loan support",
  "sourcePage": "education-loan.html",
  "sourceForm": "quick_enquiry",
  "preferredLanguage": "en",
  "createdFrom": "website"
}
```

Success:

```json
{
  "success": true,
  "referenceId": "NP-ENQ-20260526-173012-A7K2",
  "message": "Enquiry submitted successfully",
  "whatsappStatus": "not_configured"
}
```

## Start Live Chat

`POST /api/chat/start`

Creates an enquiry, chat session, first customer message, and system message.

Returns `chatId` and `enquiryId`.

## Send Customer Chat Message

`POST /api/chat/message`

```json
{
  "chatId": "NP-CHAT-20260526-173045-X9P4",
  "message": "Can you explain education loan eligibility?"
}
```

## Fetch Customer Chat Messages

`GET /api/chat/messages/:chatId`

Returns messages in ascending `createdAt` order.

## Backward Compatibility

- `POST /api/agent-handoff` maps to chat start.
- `POST /api/live-chat` maps to chat message.
- `GET /api/live-chat/:chatId/messages` maps to chat messages.

## Admin Login

`POST /api/admin/login`

```json
{
  "email": "info@nidhipath.in",
  "password": "password"
}
```

Returns a Supabase access token when the user exists in `admin_profiles`.

Protected routes require:

```http
Authorization: Bearer <access_token>
```

## User Signup And Login

Normal customer accounts never use `admin_profiles`.

`POST /api/user/signup`

```json
{
  "name": "Dindi Narendra Kumar Madala",
  "email": "customer@example.com",
  "phone": "+918520846598",
  "password": "typed password"
}
```

Success:

```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email before signing in.",
  "user": {},
  "application": {}
}
```

`POST /api/user/login`

Returns a user token and profile. The frontend stores it separately as
`nidhi_user_token`.

Protected user APIs:

- `GET /api/user/me`
- `GET /api/user/dashboard`
- `GET /api/user/application`
- `GET /api/user/application/updates`
- `POST /api/user/logout`

`GET /api/user/dashboard` returns the user profile, the linked CRM application,
and user-visible CRM updates only.

## Protected Admin APIs

- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/enquiries`
- `GET /api/admin/enquiries/:id`
- `PATCH /api/admin/enquiries/:id`
- `GET /api/admin/chats`
- `GET /api/admin/chats/:chatId`
- `GET /api/admin/chats/:chatId/messages`
- `POST /api/admin/chats/:chatId/reply`
- `PATCH /api/admin/chats/:chatId`

## Protected Admin User And CRM APIs

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/crm/stats`
- `GET /api/admin/crm/applications`
- `GET /api/admin/crm/applications/:id`
- `PATCH /api/admin/crm/applications/:id`
- `POST /api/admin/crm/applications/:id/work-started`
- `GET /api/admin/crm/applications/:id/updates`
- `POST /api/admin/crm/applications/:id/updates`

When `work_started` is set, the backend generates an Application ID once:

```text
NP-APP-YYYYMMDD-0001
```

The same action creates a user-visible CRM update with the generated ID.

## Protected Site Management APIs

These are backend-ready for future admin dashboard screens. Public website pages
do not depend on them yet.

- `GET /api/admin/site/settings`
- `PATCH /api/admin/site/settings`
- `GET /api/admin/site/overview`
- `POST /api/admin/site/seed-defaults`
- `GET /api/admin/site/sections`
- `GET /api/admin/site/sections/:id`
- `PATCH /api/admin/site/sections/:id`
- `GET /api/admin/site/services`
- `POST /api/admin/site/services`
- `PATCH /api/admin/site/services/:id`
- `GET /api/admin/site/navigation`
- `POST /api/admin/site/navigation`
- `PATCH /api/admin/site/navigation/:id`
- `GET /api/admin/site/media`
- `POST /api/admin/site/media`
- `PATCH /api/admin/site/media/:id`
- `GET /api/admin/site/content-blocks`
- `PATCH /api/admin/site/content-blocks/:id`
- `GET /api/admin/site/audit-logs`

Only `super_admin` and `admin` can modify site settings/content. Other active
admin roles can authenticate, but cannot edit website-control data.

Errors always return:

```json
{
  "success": false,
  "message": "Human readable error"
}
```
