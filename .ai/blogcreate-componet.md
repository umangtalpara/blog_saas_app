# BLOGERP — Blog Create/Update Component Specification

Project: BlogERP
Tech:
- React + TypeScript + Vite
- TailwindCSS
- NestJS Backend
- MongoDB
- AWS S3 for media storage

---

# Goal

Replace current simple popup editor:

Current:
- Title
- Slug
- Status
- Content textarea

New Professional Version:

Create a production-ready modern blog editor similar to:

- Medium
- Dev.to
- Notion
- Hashnode

Support:

- Rich Text Editor
- Images
- Videos
- Drag & Drop Upload
- S3 Upload
- SEO
- Tags
- Categories
- Emoji
- Cover Image
- Draft Auto-save
- Scheduling
- Blog Status
- Publish workflow
- Responsive Design
- Dark Mode

---

# UI STRUCTURE

Layout:

------------------------------------------------

Navbar

[Back]

Create Blog

[Save Draft]
[Preview]
[Publish]

------------------------------------------------

Left Sidebar

Content tools:

- Cover image
- Media upload
- Tags
- Categories
- SEO
- Schedule
- Settings

------------------------------------------------

Main Editor

[Cover Image]

Title Input

Subtitle Input

Rich Text Editor

------------------------------------------------

Right Sidebar

SEO Preview

Publishing Status

Reading Time

Word Count

Slug

Author

Last Saved

------------------------------------------------

# COMPONENT BREAKDOWN

src/

shared/

components/

BlogEditor/

BlogEditor.tsx

components/

TitleInput.tsx
SubtitleInput.tsx
CoverUploader.tsx
MediaUploader.tsx
RichEditor.tsx
TagSelector.tsx
CategorySelector.tsx
SEOSection.tsx
PublishSection.tsx
ScheduleSection.tsx
PreviewPanel.tsx
SettingsPanel.tsx

hooks/

useBlogEditor.ts
useAutosave.ts
useMediaUpload.ts

services/

blog.service.ts
media.service.ts

types/

blog.types.ts

---

# BLOG FORM MODEL

interface BlogForm {

title:string

subtitle:string

slug:string

content:string

coverImage:string

media:string[]

videos:string[]

tags:string[]

categories:string[]

status:

| "draft"
| "published"
| "scheduled"

seo:{

metaTitle:string

metaDescription:string

keywords:string[]

ogImage:string

}

scheduleAt?:Date

allowComments:boolean

featured:boolean

visibility:

| "public"
| "private"

}

---

# RICH TEXT EDITOR FEATURES

Use:

Tiptap editor

Required support:

Headings

Paragraph

Bold

Italic

Underline

Strike

Lists

Checklist

Code block

Block quote

Tables

Link

Emoji

Mentions

Image insert

Video embed

Youtube embed

Markdown support

Syntax highlighting

Text alignment

Horizontal divider

Undo

Redo

Drag-drop media

Slash command menu:

/

Examples:

/heading
/image
/video
/code
/table
/emoji

---

# COVER IMAGE COMPONENT

Features:

- Upload image
- Drag drop
- Crop image
- Preview image
- Remove image
- Replace image

Accepted:

jpg
jpeg
png
webp

Max:

5MB

Upload flow:

Frontend
→ presigned URL API
→ upload to S3
→ save returned URL

---

# MEDIA UPLOAD COMPONENT

Support:

Images:

jpg
jpeg
png
webp
gif

Videos:

mp4
webm
mov

Max:

Image:
10MB

Video:
100MB

Features:

- Multiple upload
- Progress bar
- Preview
- Retry
- Cancel upload
- Remove upload
- Drag/drop support

---

# AWS S3 ARCHITECTURE

Create:

MediaModule

Backend:

src/

media/

media.module.ts
media.controller.ts
media.service.ts
dto/

create-upload.dto.ts

---

# API ENDPOINTS

POST

/api/media/upload-url

Request:

{

fileName:"hero.jpg",

contentType:"image/jpeg",

folder:"blogs"

}

Response:

{

uploadUrl:"",

fileUrl:""

}

---

POST

/api/blogs

PUT

/api/blogs/:id

GET

/api/blogs/:id

POST

/api/blogs/autosave

---

# NestJS Service Example

Use:

AWS SDK v3

Packages:

npm install

@aws-sdk/client-s3
@aws-sdk/s3-request-presigner

Create:

S3Service

Methods:

generateUploadUrl()

deleteMedia()

---

# S3 Folder Structure

bucket/

blogs/

tenantId/

images/

videos/

cover/

---

Example:

blogs/

tenant123/

images/

hero.jpg

---

# AUTOSAVE

Save every:

5 seconds

Conditions:

Only if changes exist

Store:

draft version

Show:

"Saved just now"

---

# PUBLISH WORKFLOW

Draft

↓

Review

↓

Scheduled

↓

Published

---

# SEO PANEL

Fields:

Meta Title

Meta Description

Keywords

OG image

Slug

Preview:

Google search style preview

---

# VALIDATION

Title:

required
min:5
max:150

Slug:

required

Tags:

max:10

Cover:

required

Meta Description:

max:160

Videos:

100MB max

---

# SECURITY

Validate:

mime type

file size

tenant ownership

JWT

RBAC

Rate limit upload API

Sanitize editor HTML

Prevent XSS

Prevent malicious upload

Use Helmet

---

# PERFORMANCE

Use:

React.lazy()

Debounce autosave

Virtual rendering

Memoization

Chunk upload for videos

Lazy load images

---

# RESPONSIVE

Desktop:

3-column layout

Tablet:

2-column

Mobile:

Single-column

Bottom action bar

---

# UPDATE COMPONENT

Reuse same editor component.

Modes:

create
edit

if edit:

Load existing data

Populate fields

Show update button

Keep autosave

---

# AI AGENT RULES

Generate:

Production-ready code

No placeholder code

Use TypeScript only

Reusable components only

Follow BlogERP architecture

Use hooks

Use Tailwind

Use clean architecture

Do not break existing modules

Generate complete implementation
