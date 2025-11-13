# FlexLiving Reviews Dashboard - User Guide

## 🎯 How to Use the System

### For Managers (Review Management)

#### 1. Access the Dashboard
- Navigate to: `http://localhost:3000/dashboard`
- This is the main control center for managing reviews

#### 2. Approve/Reject Reviews
- **View All Reviews**: See all reviews in the table
- **Approve**: Click the ✓ (green checkmark) button
- **Unapprove**: Click the ✗ (red X) button
- **Make Visible**: Click the 👁️ (eye) icon to show on public pages
- **Hide**: Click the 👁️‍🗨️ (eye-off) icon to hide from public

#### 3. Filter Reviews
Use the filter bar to:
- Search by guest name, property, or comment
- Filter by property
- Filter by approval status (All/Approved/Pending/Visible)
- Filter by date range
- Filter by channel (Airbnb, Booking.com, etc.)

#### 4. View Analytics
Scroll down to see:
- Rating distribution chart
- Reviews by channel (pie chart)
- Reviews by property (bar chart)
- Monthly trends (line chart)

#### 5. Export Data
- Click "Export CSV" button to download all filtered reviews

### For Guests (Public View)

#### 1. Browse Properties
- Go to: `http://localhost:3000`
- Search for properties by name or location
- Filter by location using dropdown

#### 2. View Property Details
- Click any property card
- Scroll down to see the **"Guest Reviews"** section
- Only APPROVED and VISIBLE reviews appear here

#### 3. See Review Details
Each review shows:
- Guest name and avatar
- Rating (out of 10)
- Review comment
- Date submitted
- Booking channel
- Category ratings (cleanliness, communication, etc.)

## 📍 Key URLs

1. **Homepage (Property Listing)**: http://localhost:3000
2. **Manager Dashboard**: http://localhost:3000/dashboard
3. **Property Detail Example**: http://localhost:3000/properties/2b-n1-a-29-shoreditch-heights

## 🔄 Workflow Example

### Manager Approval Process:
1. Go to `/dashboard`
2. See new reviews marked as "Pending"
3. Click on a review to see full details
4. Click ✓ to approve
5. Click 👁️ to make visible on public page
6. Review now appears on property page

### Guest View Process:
1. Visit homepage
2. Browse properties
3. Click on a property
4. Scroll to "Guest Reviews" section
5. See only approved + visible reviews

## 🔑 API Endpoints

All endpoints are working at:

- `GET /api/reviews/hostaway` - Get all reviews (for dashboard)
- `GET /api/reviews/public?property=ID` - Get public reviews
- `PATCH /api/reviews/[id]` - Update review status
- `GET /api/reviews/[id]` - Get single review

## ⚙️ Using Real Hostaway API

To switch from mock data to real Hostaway API:

1. Create `.env.local` file:
```
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148
```

2. In `src/app/api/reviews/hostaway/route.ts`, uncomment the API fetch code

3. Restart server

**Note**: The sandbox API returns empty results, so mock data is used for demonstration.