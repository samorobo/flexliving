# FlexLiving Reviews Dashboard

A modern, full-featured reviews management system for FlexLiving properties built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Manager Dashboard**: Comprehensive review management interface
  - Approve/reject reviews
  - Toggle visibility on public pages
  - Advanced filtering and sorting
  - Export to CSV
  - Real-time analytics charts

- **Public Property Pages**: Beautifully designed property listing and detail pages
  - Property search and filtering
  - Interactive image galleries
  - Integrated review sections
  - Booking widgets

- **Review System**: 
  - Normalized review data from Hostaway API
  - Multi-channel support (Airbnb, Booking.com, Vrbo, Direct)
  - Category-based ratings
  - Guest information management

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Step 1: Clone and Install
```bash
# Navigate to your project directory
cd flexliving-reviews

# Install dependencies
npm install
```

### Step 2: Verify File Structure

Ensure all files are in the correct locations as shown in the project structure.

### Step 3: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure
```
flexliving-reviews/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Homepage (property listing)
│   │   ├── globals.css                # Global styles
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Manager dashboard
│   │   ├── properties/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Property detail page
│   │   └── api/
│   │       └── reviews/
│   │           ├── hostaway/route.ts  # Main API endpoint
│   │           ├── public/route.ts    # Public reviews API
│   │           └── [id]/route.ts      # Update review API
│   ├── components/
│   │   ├── property/                  # Property components
│   │   ├── dashboard/                 # Dashboard components
│   │   ├── ui/                        # Reusable UI components
│   │   └── layout/                    # Layout components
│   ├── lib/
│   │   ├── utils.ts                   # Utility functions
│   │   └── data/
│   │       ├── mockReviews.json       # Mock review data
│   │       └── properties.json        # Property data
│   └── types/
│       └── index.ts                   # TypeScript types
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎯 Key Routes

- `/` - Property listing (homepage)
- `/properties/[id]` - Individual property detail page
- `/dashboard` - Manager dashboard (review management)

## 📡 API Endpoints

### GET /api/reviews/hostaway
Fetches and normalizes all reviews from Hostaway (mocked data).

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 10,
    "averageRating": 8.5,
    "pending": 3,
    "approved": 7
  }
}
```

### GET /api/reviews/public
Fetches only approved and visible reviews for public display.

**Query Parameters:**
- `property` (optional): Filter by property ID

### PATCH /api/reviews/[id]
Updates review approval status or visibility.

**Body:**
```json
{
  "isApproved": true,
  "isVisible": true
}
```

## 🎨 Design System

### Colors
- Primary: Indigo (600)
- Secondary: Purple (600)
- Accent: Pink (500)
- Success: Green (600)
- Warning: Yellow (600)
- Danger: Red (600)

### Components
All UI components are built with Tailwind CSS and support:
- Dark mode ready
- Responsive design
- Accessibility features
- Smooth animations

## 🔧 Customization

### Adding New Properties
Edit `src/lib/data/properties.json` and add new property objects.

### Adding More Reviews
Edit `src/lib/data/mockReviews.json` to add more review data.

### Connecting Real Hostaway API
In `src/app/api/reviews/hostaway/route.ts`, uncomment the fetch call and add your API credentials:
```typescript
const response = await fetch('https://api.hostaway.com/v1/reviews', {
  headers: {
    'Authorization': `Bearer ${process.env.HOSTAWAY_API_KEY}`,
  }
});
```

Add to `.env.local`:
```
HOSTAWAY_API_KEY=your_api_key_here
HOSTAWAY_ACCOUNT_ID=your_account_id_here
```

## 📊 Dashboard Features

- **Stats Overview**: Total reviews, average rating, pending approvals
- **Filtering**: By property, channel, date range, status, search
- **Sorting**: Click column headers to sort
- **Actions**: Approve, visibility toggle, view details
- **Analytics**: Charts for rating distribution, channel breakdown, trends
- **Export**: Download filtered reviews as CSV

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
```

Deploy to Vercel with one click or via CLI:
```bash
vercel
```

### Other Platforms
Build the production bundle:
```bash
npm run build
npm start
```

## 📝 Google Reviews Integration Notes

**Findings:**
- Google Places API requires business ownership verification
- Limited to 5 most recent reviews without Business API
- No programmatic approval/visibility control
- Recommendation: Manual import or third-party aggregator

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📄 License

MIT License - FlexLiving Reviews Dashboard

## 👨‍💻 Development

For development questions or issues, please check the inline code comments or create an issue in the repository.

---

**Built with ❤️ for FlexLiving**