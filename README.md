# Sentilizer

Sentilizer is a SaaS platform that allows users to perform sentiment analysis on YouTube videos. Users can log in, receive 2 free credits daily, and use these credits to analyze the sentiment of YouTube videos. Each video analysis costs 1 credit.

## Features

- **User Authentication**: Secure login and registration.
- **Daily Credits**: Users receive 2 free credits every day.
- **Sentiment Analysis**: Analyze the sentiment of YouTube video comments.
- **Credit Management**: Each video analysis costs 1 credit.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm 
- PostgreSQL 

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sentilizer.git
   cd sentilizer
   ```
2. **Setup environment variables:**
   ```bash
   DATABASE_URL=your_database_url
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
3. **Run db migrations:**
  ```bash
  npx prisma migrate dev
  ```
4.  **Start the development server:**
  ```bash
  npm run dev
  ```
## Contributing
### Contributions are welcome! Please open an issue or submit a pull request for any changes.
