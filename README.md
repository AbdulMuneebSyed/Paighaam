
# Paighaam - Real-Time Multilingual Chat Application

Paighaam is a modern chat application built with Next.js that enables real-time communication across language barriers. Users can chat in their preferred language while messages are automatically translated for recipients.

## Features

- 🌐 Real-time translation across 20+ languages
- 💬 One-on-one messaging
- 👥 Group chat functionality
- 🔐 Secure authentication with phone number and MetaMask
- 🎨 Modern, responsive UI with dark mode support
- 📱 Mobile-friendly design
- 🔄 Real-time message updates using Supabase
- 🗣️ Automatic message transliteration for better pronunciation

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Web 3 Authentication
- **Translation**: Google Generative AI
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Real-time**: Supabase Real-time Subscriptions

## Prerequisites

- Node.js 18+
- NPM or Yarn
- Supabase account
- Google AI API key
- MetaMask wallet (for authentication)

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/AbdulMuneebSyed/Paighaam.git
cd paighaam
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a new Supabase project
2. Execute the following SQL to create required tables:

```sql
-- Users table
create table users (
  id uuid default uuid_generate_v4() primary key,
  phone_number text unique not null,
  name text,
  preferred_language text,
  profile_pic text
);

-- Chats table
create table chats (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references users(id),
  receiver_id uuid references users(id),
  message text not null,
  translated_message text,
  roman_translated_message text,
  language text,
  timestamp timestamptz default now()
);

-- Groups table
create table groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

-- Group members table
create table group_members (
  group_id uuid references groups(id),
  user_id uuid references users(id),
  primary key (group_id, user_id)
);

-- Group chats table
create table group_chats (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references groups(id),
  sender_id uuid references users(id),
  message text not null,
  translated_message text,
  roman_translated_message text,
  language text,
  timestamp timestamptz default now()
);
```

## Project Structure

```
paighaam/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── profile-setup/     # Profile setup pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── hooks/            # Custom hooks
├── lib/                   # Utility functions
└── public/               # Static assets
```

## Authentication Flow

1. MetaMask wallet connection
2. Profile setup (name, language preference)

## Features in Detail

### Translation

- Messages are automatically translated using Google's Generative AI
- Supports transliteration for non-Latin scripts
- Original message is preserved alongside translation

### Real-time Chat

- Instant message delivery
- Message status indicators
- Read receipts

### Group Chat

- Create and manage groups
- Add/remove members
- Group-wide translations
- Admin controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For the full license text, see the [LICENSE](LICENSE) file in the repository.

## Support

For support, email samuneeb786@gmail.com
