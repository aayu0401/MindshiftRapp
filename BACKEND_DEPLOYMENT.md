# MindshiftR - Production Deployment Guide

## 🎉 Your Production-Ready Backend is Complete!

This guide will help you deploy the complete MindshiftR platform with integrated backend.

---

## 📋 What's Been Built

### Backend Features
✅ **Comprehensive Database Schema** - 20+ Prisma models  
✅ **Story System** - Multi-chapter stories with embedded MCQ questions  
✅ **Assessment System** - CBT/PBCT assessments with risk classification  
✅ **Analytics Dashboard** - User/class/school analytics with high-risk tracking  
✅ **AI Story Generator** - Criteria-based story generation with approval workflow  
✅ **Role-Based Access Control** - Student, Teacher, School Admin, Parent roles  
✅ **Progress Tracking** - Story reading and assessment completion tracking  

### API Endpoints
- `/api/stories` - Story CRUD, progress tracking, question responses
- `/api/assessments` - Assessment submission, scoring, results
- `/api/analytics` - User/class/school analytics, high-risk alerts
- `/api/ai` - AI story generation, template management, approval workflow
- `/auth` - Login, signup, token refresh
- `/user` - User profile management

---

## 🚀 Quick Start (Local Development)

### 1. Start Database Services

```bash
# Start PostgreSQL and Redis with Docker Compose
docker-compose up -d db redis
```

### 2. Setup Backend

```bash
cd api

# Install dependencies (already done)
npm install

# Generate Prisma client (already done)
npx prisma generate

# Run database migrations
npx prisma migrate dev --name initial_schema

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Setup Frontend

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Test the Application

**Demo Accounts:**
- Student: `student@demo.com` / `password`
- Teacher: `teacher@demo.com` / `password`
- School Admin: `school@demo.com` / `password`
- Parent: `parent@demo.com` / `password`

---

## 🌐 Production Deployment

### Option 1: Railway (Recommended for Full Stack)

**Deploy Backend:**

1. Create Railway account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add Redis service
5. Add backend service:
   ```bash
   # Connect GitHub repo
   # Set root directory: api
   # Railway will auto-detect Node.js
   ```

6. Set environment variables:
   ```
   DATABASE_URL=(auto-set by Railway)
   REDIS_URL=(auto-set by Railway)
   JWT_ACCESS_TOKEN_SECRET=your-secret-key-here
   JWT_REFRESH_TOKEN_SECRET=your-refresh-secret-here
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

7. Add build command:
   ```
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```

8. Add start command:
   ```
   npm start
   ```

**Deploy Frontend:**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory: `web`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy!

### Option 2: Separate Services

**Backend → Railway/Render/Heroku**  
**Frontend → Vercel/Netlify**  
**Database → Railway/Supabase/Neon**

---

## 🗄️ Database Management

### View Database (Prisma Studio)

```bash
cd api
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Run Migrations

```bash
cd api
npx prisma migrate dev
```

### Reset Database

```bash
cd api
npx prisma migrate reset
npm run prisma:seed
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mindshiftr
REDIS_URL=redis://localhost:6379
JWT_ACCESS_TOKEN_SECRET=your-secret-key-minimum-32-characters
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret-minimum-32-characters
FRONTEND_URL=http://localhost:5173
API_PORT=4000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000
VITE_ENV=development
```

---

## 📊 API Documentation

### Stories API

```bash
# Get all stories
GET /api/stories?category=ANXIETY_MANAGEMENT&ageGroup=AGE_8_10

# Get story by ID
GET /api/stories/:id?userId=user-id

# Update progress
POST /api/stories/:id/progress
{
  "currentChapter": 1,
  "currentSection": 3,
  "completed": false
}

# Submit question response
POST /api/stories/:storyId/questions/:questionId/response
{
  "textResponse": "My answer here"
}
```

### Assessments API

```bash
# Get assessments
GET /api/assessments?type=CBT&ageGroup=AGE_8_10

# Submit assessment
POST /api/assessments/:id/submit
{
  "responses": {
    "question-id-1": 2,
    "question-id-2": 3
  }
}

# Get results
GET /api/assessments/:id/results
```

### Analytics API

```bash
# Get user analytics
GET /api/analytics/me

# Get class analytics (teacher)
GET /api/analytics/class

# Get high-risk students (teacher/admin)
GET /api/analytics/high-risk

# Generate student report
GET /api/analytics/report/:userId
```

### AI Generator API

```bash
# Generate story
POST /api/ai/generate-story
{
  "ageGroup": "AGE_8_10",
  "category": "ANXIETY_MANAGEMENT",
  "therapeuticGoals": ["REDUCE_ANXIETY", "DEVELOP_COPING_SKILLS"],
  "customPrompt": "Story about a child learning to manage test anxiety"
}

# Get pending approval
GET /api/ai/pending-approval

# Approve story
POST /api/ai/approve/:storyId
{
  "reviewNotes": "Great story, approved for publication"
}
```

---

## 🧪 Testing

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:4000/health

# Get stories
curl http://localhost:4000/api/stories

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"password"}'
```

### Run Frontend

```bash
cd web
npm run dev
```

Test complete user flows:
1. Login → Browse Stories → Read Story → Answer Questions → Complete Assessment
2. Teacher Dashboard → View Analytics → Generate AI Story → Approve Story

---

## 📝 Next Steps

1. **Integrate OpenAI API** - Replace placeholder AI generation with real OpenAI calls
2. **Add Email Notifications** - Alert teachers about high-risk students
3. **Export Reports** - PDF/CSV export for analytics
4. **Mobile App** - React Native app using same backend
5. **Advanced Analytics** - More detailed charts and insights

---

## 🆘 Troubleshooting

**Database connection error:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart services
docker-compose restart db
```

**Prisma client not found:**
```bash
cd api
npx prisma generate
```

**CORS errors:**
- Check `FRONTEND_URL` in backend .env matches frontend URL
- Ensure `withCredentials: true` in API client

**Migration errors:**
```bash
cd api
npx prisma migrate reset
npm run prisma:seed
```

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f api`
2. View Prisma Studio: `npm run prisma:studio`
3. Review API responses in browser DevTools

---

**🎊 Congratulations! Your production-ready MindshiftR backend is complete!**
