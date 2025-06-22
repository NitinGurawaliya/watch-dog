# Who's Viewing Me - Privacy-First Analytics Platform

A real-time, privacy-first analytics platform for developers. See who's visiting your website right now with a simple one-line script.

## 🚀 Features

- **Real-time Live Feed** - See active visitors in real-time
- **One-line Integration** - Simple script tag to add to any website
- **Privacy-First** - No cookies, GDPR compliant
- **OAuth Authentication** - Google, GitHub, and Twitter login
- **Project Management** - Create multiple projects for different sites
- **Analytics Dashboard** - 7-day charts, country breakdown, referrer analysis
- **Developer-Friendly** - Clean API for custom integrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with OAuth providers
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd whos-viewing-me
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/whosviewingme"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # App URL (for production)
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   TWITTER_CLIENT_ID="your-twitter-client-id"
   TWITTER_CLIENT_SECRET="your-twitter-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set homepage URL to `http://localhost:3000`
4. Set callback URL to `http://localhost:3000/api/auth/callback/github`

### Twitter OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set callback URL to `http://localhost:3000/api/auth/callback/twitter`

## 🧪 Testing the Tracking System

### Quick Test Setup
1. **Start the development server**
```bash
npm run dev
   ```

2. **Create a test project**
   - Go to `http://localhost:3000/auth` and sign in
   - Create a new project in the dashboard
   - Go to the "Setup" tab and copy the tracking script

3. **Test with the built-in test page**
   - Visit `http://localhost:3000/test`
   - Open browser dev tools and add the tracking script to the page:
   ```javascript
   // In browser console, paste your tracking script
   // Example: <script src="http://localhost:3000/track.js" data-site="your-project-id"></script>
   ```

4. **Verify tracking is working**
   - Go back to your dashboard
   - Check the "Live Feed" tab
   - You should see your visit appear in real-time

### Manual Testing
1. **Create a simple HTML file** for testing:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Test Page</title>
       <!-- Add your tracking script here -->
       <script src="http://localhost:3000/track.js" data-site="your-project-id"></script>
   </head>
   <body>
       <h1>Test Page</h1>
       <p>This page is being tracked!</p>
   </body>
   </html>
   ```

2. **Open the HTML file** in your browser
3. **Check your dashboard** - the visit should appear in the live feed

### Production Testing
1. **Deploy to Vercel** (or your preferred platform)
2. **Update environment variables** with your production domain
3. **Test with the production URL** in the tracking script

## 📊 Usage

### 1. Create a Project
- Sign in with your OAuth provider
- Click "New Project" in the dashboard
- Give your project a name

### 2. Add Tracking Script
- Go to the "Setup" tab
- Copy the provided script tag
- Add it to your website's `<head>` section

### 3. View Analytics
- **Overview**: See live visitors, 7-day traffic, countries, and referrers
- **Live Feed**: Real-time list of active visitors
- **Setup**: Get your tracking script and project details

## 🔌 API Endpoints

### Tracking
- `POST /api/track` - Accept visitor data from tracking script

### Projects
- `GET /api/project` - Get user's projects
- `POST /api/project` - Create new project

### Analytics
- `GET /api/stats/project/[id]/realtime` - Live visitors (last minute)
- `GET /api/stats/project/[id]/7days` - 7-day visitor counts
- `GET /api/stats/project/[id]/countries` - Country breakdown
- `GET /api/stats/project/[id]/referrers` - Referrer breakdown

## 🎯 Tracking Script

The tracking script automatically collects:
- Page URL
- Referrer information
- User agent
- IP address (server-side)
- Country and city (via Cloudflare headers)

### Production Deployment
For production, set the `NEXT_PUBLIC_APP_URL` environment variable:
```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

This ensures the tracking script uses your production domain instead of localhost.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Deploy!

### Other Platforms
- Set up PostgreSQL database
- Configure environment variables
- Set `NEXT_PUBLIC_APP_URL` to your domain
- Build and deploy with `npm run build`

## 🔒 Privacy & Compliance

- **No Cookies**: Tracking script doesn't set any cookies
- **GDPR Compliant**: Minimal data collection, user consent ready
- **CCPA Ready**: California privacy law compliant
- **Server-Side Processing**: IP detection happens server-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the documentation for common questions
- Join our community discussions

---

Built with ❤️ for developers who care about privacy and simplicity.
