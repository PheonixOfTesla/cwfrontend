 Coastal Fitness & Correction - Frontend

Revolutionary Health Platform for Medical Fitness Facilities

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ (for local development)
- Modern web browser

### Installation
```bash
# Clone repository
git clone [your-repo-url]
cd coastal-fitness-frontend

# Install dependencies (for local dev server)
npm install

# Start local server
npm start
Deployment
Deploy to Vercel
bashnpx vercel --prod
Deploy to Netlify

Connect your GitHub repo
Build command: (leave empty)
Publish directory: public

🔧 Configuration
Update the backend URL in public/index.html:
javascriptwindow.BACKEND_URL = 'your-backend-url';
📱 Features

✅ Responsive design
✅ PWA ready
✅ Offline support
✅ Real-time chat
✅ Client & Professional views
✅ Complete workout tracking
✅ Nutrition management
✅ Goal tracking
✅ Measurement logging

🏗️ File Structure
coastal-fitness-frontend/
├── public/
│   ├── index.html (Main app - 7614 lines)
│   ├── js/
│   │   ├── api-service.js
│   │   ├── services/
│   │   │   ├── connectionManager.js
│   │   │   └── dataSync.js
│   │   ├── hooks/
│   │   │   └── useApiData.js
│   │   └── migrate-component.js
│   └── manifest.json
├── package.json
├── vercel.json
├── .gitignore
└── README.md
📝 Default Accounts (Development)

Client: john.client@example.com / password123
Specialist: sarah.specialist@coastal.com / specialist123
Admin: admin@coastal.com / admin123
Owner: owner@coastal.com / owner123

🔗 Backend Integration
Ensure your backend is running at the configured URL with:

MongoDB connected
JWT authentication enabled
CORS allowing your frontend domain

📄 License
MIT
👨‍⚕️ Author
Dr. Josh Lerner - Coastal Fitness & Correction

## 6. **Environment Variable Update**

In your `index.html`, make sure this line at the top points to your actual backend:

```javascript
window.BACKEND_URL = 'https://coastal-fitness-backend-production.up.railway.app';
📋 Deployment Steps:
For Vercel:
bash# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts, select:
# - Link to existing project? No
# - Project name: coastal-fitness
# - Directory: ./public
# - Override settings? No
For Netlify:

Push to GitHub
Go to netlify.com
"New site from Git"
Connect repo
Deploy settings:

Build command: (leave empty)
Publish directory: public