# Frontend Backend Integration

## Configuration

The frontend is configured to connect to the Flask backend. Set the backend URL using:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This is set in `.env.local` (create if needed) or passed as an environment variable.

## Running the Stack

### 1. Start the Backend (Flask)
```bash
# From project root
python3 app.py
# Runs on http://localhost:5000
```

### 2. Start the Frontend (Next.js)
```bash
# From /web directory
npm run dev
# Runs on http://localhost:3000
```

## API Integration

The frontend now integrates with the backend:

- **Buy Page** (`/buy`) - Connects to `/predict_api` endpoint
  - Accepts all 13 Boston Housing features
  - Sends POST request with feature values
  - Displays predicted price or error message
  - Handles loading states and error handling

- **API Client** (`/lib/api.ts`)
  - `predictPrice()` - Main prediction function
  - `checkBackendHealth()` - Health check utility
  - Type-safe request/response interfaces

## Features

✅ Real-time predictions from Flask backend
✅ Error handling with user-friendly messages  
✅ Loading states during API calls
✅ Day/Night theme support
✅ All 13 Boston Housing features
✅ Formatted price output (in dollars)

## Expected Request/Response

**Request to `/predict_api`:**
```json
{
  "data": {
    "CRIM": 0.00632,
    "ZN": 18.0,
    "INDUS": 2.31,
    "CHAS": 0,
    "NOX": 0.538,
    "RM": 6.575,
    "Age": 65.2,
    "DIS": 4.09,
    "RAD": 1,
    "TAX": 296,
    "PTRATIO": 15.3,
    "B": 396.9,
    "LSTAT": 4.98
  }
}
```

**Response:**
```json
{
  "prediction": 24.0
}
```

(Price is in thousands, so 24.0 = $24,000)
