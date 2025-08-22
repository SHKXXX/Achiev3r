# Achiev3r 🎯

**Track habits, set goals, achieve together.**

Achiev3r is a comprehensive habit tracking and goal achievement app built on Base with MiniKit integration. It combines daily habit tracking, goal setting with optional staking, community engagement, and blockchain-based achievements.

## ✨ Features

### 🏠 Landing / Home Screen
- App logo and branding with "Achiev3r" identity
- Quick access to main features
- Conditional authentication (Farcaster MiniKit / Wallet connection)
- Feature highlights and navigation

### 📊 Personal Tracking Dashboard
- **Daily Log Section:**
  - Food intake tracking (Coffee, Tea, Meat, Veggies)
  - Exercise duration and type
  - Sleep hours
  - Energy level slider (1-10)
- **Charts & Summary:**
  - Energy vs Time of Day visualization
  - Food categories per week breakdown
- **Save & Track:** On-chain logging capabilities

### 🎯 Goal Setting Flow
- **Step 1: Define Goal**
  - Category selection (Fitness, Study, Sleep, Wellness, Nutrition, Productivity)
  - Description and timeline
  - Start/end dates
- **Step 2: Visibility**
  - Private or public community sharing
- **Step 3: Optional Staking**
  - USDC stake amount input
  - Base Pay integration for transactions
- **Step 4: Confirmation**
  - Goal summary review
  - Community publication

### 🌍 Community Feed
- Shared goals showcase
- User avatars and basenames
- Progress bars and status indicators
- Support and participation features
- Filter by status (All, Ongoing, Achieved, Failed)

### 📈 Goal Progress & Verification
- Timeline view with milestones
- Progress check-ins and evidence submission
- On-chain progress updates
- Community feed integration

### 🏆 Achievement Screen
- Trophy and badge visuals
- Prize claiming (stake + profit withdrawal)
- NFT badge minting via OnchainKit
- Farcaster social sharing via MiniKit
- Achievement statistics and motivation

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS with custom theme
- **Blockchain:** Base network integration
- **Authentication:** MiniKit (Farcaster) + OnchainKit (Wallet)
- **Data Management:** React Query + Upstash Redis
- **State Management:** React hooks + local state

### Key Dependencies
- `@coinbase/onchainkit` - Wallet connections and blockchain interactions
- `@farcaster/frame-sdk` - Farcaster integration
- `@tanstack/react-query` - Data fetching and caching
- `viem` + `wagmi` - Ethereum interactions
- `@upstash/redis` - Data persistence

### Component Structure
```
app/
├── components/
│   ├── LandingScreen.tsx      # Home screen with main actions
│   ├── Dashboard.tsx          # Daily habit tracking
│   ├── GoalCreation.tsx       # Multi-step goal creation
│   ├── CommunityFeed.tsx      # Community goals showcase
│   ├── GoalProgress.tsx       # Progress tracking & milestones
│   ├── AchievementScreen.tsx  # Goal completion celebration
│   └── DemoComponents.tsx     # Reusable UI components
├── page.tsx                   # Main app with screen routing
├── layout.tsx                 # App layout and metadata
└── providers.tsx              # MiniKit provider setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn or npm
- Base network wallet (for staking features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd achiev3r
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
   NEXT_PUBLIC_URL=your_app_url
   NEXT_PUBLIC_APP_HERO_IMAGE=your_hero_image_url
   NEXT_PUBLIC_SPLASH_IMAGE=your_splash_image_url
   NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#ffffff
   NEXT_PUBLIC_ICON_URL=your_icon_url
   ```

4. **Run the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### MiniKit Setup
The app is configured to work with MiniKit for Farcaster integration and OnchainKit for wallet connections. Ensure your API keys and configuration are properly set in the environment variables.

### Base Network
The app is configured to work on Base network. For production, ensure you have the correct RPC endpoints and contract addresses configured.

## 📱 Usage

### For Users
1. **Start Tracking:** Begin with daily habit logging
2. **Set Goals:** Create personal or community goals
3. **Track Progress:** Update milestones and evidence
4. **Achieve & Celebrate:** Complete goals and claim rewards
5. **Community Engagement:** Support and participate in shared goals

### For Developers
- All components are fully typed with TypeScript
- Modular architecture for easy feature additions
- Mock data included for demonstration
- TODO comments indicate blockchain integration points

## 🔮 Future Enhancements

- **Smart Contract Integration:** On-chain goal verification
- **DeFi Features:** Yield farming on staked amounts
- **Social Features:** Goal challenges and competitions
- **Analytics:** Advanced progress tracking and insights
- **Mobile App:** React Native version
- **Multi-chain Support:** Ethereum, Polygon, and more

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Base](https://base.org/) network
- Powered by [MiniKit](https://minikit.com/) for Farcaster integration
- UI components from [OnchainKit](https://onchainkit.com/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

---

**Achiev3r** - Where goals become achievements, and habits become success stories. 🚀
