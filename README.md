This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

TO DO:

# Royalty-Free Sound Search Web App

## Team Members

- Nicholas Graham
- Anne Marie Ala

## Project Name

**Royalty-Free Sound Search**

## Project Description

This web application allows users to search for royalty-free sounds using descriptive terms such as genre, tempo, mood (e.g., "ambient"), instrument, and more. The app leverages AI to enhance search accuracy and provides a clean, intuitive interface for browsing, favoriting, and downloading tracks.

## Planned Features

### Must-Have Features

- ✅ AI-powered search bar for descriptive audio lookup
- ✅ Result cards displaying title, tags, description, and artist
- ✅ Download link for each sound
- ✅ Playback functionality
- ✅ Cloud-hosted sound data (S3)

### Nice-to-Have Features

- ⭐ Customizable favorites playlists (multiple allowed)
- ⭐ Upload functionality
- ⭐ User login system
- ⭐ Dark mode toggle
- ⭐ Server-side hosting (e.g., AWS, ngrok)
- ⭐ Web scraping for additional sounds

## Technologies Used

- **Cloud Firestore**: User authentication
- **OpenAI API**: AI-powered search parsing
- **Amazon S3**: Sound storage and retrieval
- **React.js / Tailwind CSS**: Frontend (assumed)
- **Node.js / Express**: Backend (assumed)
- **Ngrok / AWS EC2**: Hosting (optional)

## Architectural Overview

### Pages

- **Search Page** (Home): Contains the AI search bar and displays results
- **Favorites Page**: Shows saved playlists and links to specific favorite sets
- **Playlist Page**: Displays sounds saved in a particular playlist
- **Settings Page**: Options to toggle dark mode and update user info
- **Login Page**: For user authentication

### Key Components

- **Search Bar**: AI-powered input field to interpret natural language queries
- **Search Result Card**: Displays a single sound’s metadata
- **Playback Bar**: Play, pause, and control audio output
- **Favorites Dropdown**: Quickly access saved playlists
- **Upload Form** _(optional)_: Add your own sounds
- **Dark Mode Toggle**: Switch between light and dark themes

## Use Case Diagram
