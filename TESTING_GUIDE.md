# MindshiftR - Testing Guide

## 🧪 Complete Testing Checklist

This guide will help you test all features of the MindshiftR application.

---

## Prerequisites

### 1. Install Docker Desktop (Required for Database)

**Windows:**
1. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Install and restart your computer
3. Start Docker Desktop
4. Verify installation: `docker --version`

### 2. Start Backend Services

```bash
# Terminal 1: Start database services
cd c:\Users\44743\Downloads\mindshiftr-monorepo-updated
docker compose up -d db redis

# Terminal 2: Setup and start backend
cd api
npm install
npx prisma generate
npx prisma migrate dev --name initial_schema
npm run prisma:seed
npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Start Frontend

```bash
# Terminal 3: Start frontend (already running)
cd web
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔍 Feature Testing

### Test 1: Stories Feature ✅ UPDATED

**What Was Fixed:**
- ✅ Updated to use real API instead of mock data
- ✅ Added loading spinner while fetching stories
- ✅ Added error handling with retry button
- ✅ Proper filtering by category and age group

**Test Steps:**
1. Navigate to `http://localhost:5173/stories`
2. **Expected:** Loading spinner appears briefly
3. **Expected:** Stories load from backend API
4. Click on different category filters (Anxiety Management, Social Skills, etc.)
5. **Expected:** Stories filter correctly
6. Click on age group filters (6-8, 8-10, etc.)
7. **Expected:** Stories filter by age
8. Click on a story card
9. **Expected:** Navigate to story reader page

**If Backend Not Running:**
- **Expected:** Error message appears: "Failed to load stories. Please try again."
- **Expected:** "Try Again" button is visible
- Click "Try Again" to retry

---

### Test 2: Story Reader

**Test Steps:**
1. Open a story from the library
2. **Expected:** Story content loads with chapters
3. Read through sections
4. **Expected:** Embedded questions appear between text sections
5. Answer reflection questions
6. **Expected:** Responses are saved to backend
7. Complete the story
8. **Expected:** Assessment appears at the end

---

### Test 3: Assessments

**Test Steps:**
1. Navigate to `/assessments` or complete a story
2. **Expected:** List of available assessments
3. Start "Anxiety Screening - Story Based"
4. Answer all 8 questions on the scale
5. Submit assessment
6. **Expected:** Results page shows:
   - Total score
   - Risk level (Low/Moderate/High)
   - Personalized recommendations
   - Option to view detailed results

---

### Test 4: Analytics Dashboard (Teacher/Admin)

**Test Steps:**
1. Login as teacher: `teacher@demo.com` / `password`
2. Navigate to `/dashboard`
3. **Expected:** Class analytics display:
   - Total students count
   - Active students
   - High-risk student alerts
   - Completion rates
   - Risk distribution chart
4. Click on "High-Risk Students" section
5. **Expected:** List of students requiring attention
6. Click "Generate Report" for a student
7. **Expected:** Comprehensive progress report

---

### Test 5: AI Story Generator (Teacher/Admin)

**Test Steps:**
1. Login as teacher
2. Navigate to `/ai-creator`
3. Fill in story criteria:
   - Age Group: 8-10
   - Category: Anxiety Management
   - Therapeutic Goals: Reduce Anxiety, Develop Coping Skills
   - Custom Prompt: "Story about a child learning to manage test anxiety"
4. Click "Generate Story"
5. **Expected:** Success message with generation ID
6. Navigate to "Pending Approval" tab
7. **Expected:** Generated story appears
8. Review story content
9. Click "Approve" or "Reject" with notes
10. **Expected:** If approved, story appears in library

---

### Test 6: Authentication

**Test Steps:**
1. Logout if logged in
2. Navigate to `/login`
3. Try invalid credentials
4. **Expected:** Error message
5. Login with valid credentials: `student@demo.com` / `password`
6. **Expected:** Redirect to dashboard
7. **Expected:** JWT token stored in localStorage
8. Refresh page
9. **Expected:** Still logged in (token persists)
10. Logout
11. **Expected:** Token cleared, redirect to login

---

### Test 7: Role-Based Access Control

**Test as Student:**
- ✅ Can view stories
- ✅ Can take assessments
- ✅ Can view own analytics
- ❌ Cannot access class analytics
- ❌ Cannot create stories
- ❌ Cannot use AI generator

**Test as Teacher:**
- ✅ All student features
- ✅ Can view class analytics
- ✅ Can create stories/assessments
- ✅ Can use AI generator
- ✅ Can approve AI stories
- ❌ Cannot access school-wide analytics

**Test as School Admin:**
- ✅ All teacher features
- ✅ Can view school-wide analytics
- ✅ Can manage AI templates

---

## 🐛 Known Issues & Solutions

### Issue 1: "Failed to load stories"
**Cause:** Backend not running or database not initialized
**Solution:**
```bash
cd api
docker compose up -d db redis
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

### Issue 2: CORS errors in browser console
**Cause:** Frontend URL not in backend CORS whitelist
**Solution:** Check `FRONTEND_URL` in `api/.env` matches `http://localhost:5173`

### Issue 3: "Cannot find module 'axios'"
**Cause:** Dependencies not installed
**Solution:**
```bash
cd web
npm install
```

### Issue 4: Prisma client errors
**Cause:** Prisma client not generated
**Solution:**
```bash
cd api
npx prisma generate
```

---

## 📊 API Endpoint Testing (Manual)

### Test Backend Directly

```bash
# Health check
curl http://localhost:4000/health

# Get all stories
curl http://localhost:4000/api/stories

# Login to get token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@demo.com\",\"password\":\"password\"}"

# Use token for authenticated requests
curl http://localhost:4000/api/analytics/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ Testing Checklist

- [ ] Docker Desktop installed and running
- [ ] Database services started (PostgreSQL + Redis)
- [ ] Backend running on port 4000
- [ ] Frontend running on port 5173
- [ ] Database migrated and seeded
- [ ] Stories page loads and displays stories
- [ ] Story filtering works (category, age group)
- [ ] Story reader displays content correctly
- [ ] Embedded questions can be answered
- [ ] Assessments can be submitted
- [ ] Assessment results display correctly
- [ ] Analytics dashboard shows data (teacher)
- [ ] High-risk alerts appear
- [ ] AI story generator creates stories
- [ ] Approval workflow works
- [ ] Login/logout functions correctly
- [ ] Token refresh works
- [ ] Role-based access enforced
- [ ] Error messages display properly
- [ ] Loading states show during API calls

---

## 🎯 Success Criteria

**Frontend:**
- ✅ All pages load without errors
- ✅ Loading spinners appear during API calls
- ✅ Error messages display when backend unavailable
- ✅ Data updates in real-time from backend

**Backend:**
- ✅ All API endpoints respond correctly
- ✅ Database queries execute successfully
- ✅ Authentication works with JWT
- ✅ Role-based access control enforced

**Integration:**
- ✅ Frontend successfully calls backend APIs
- ✅ Data flows from database → backend → frontend
- ✅ User actions persist to database
- ✅ Analytics update automatically

---

## 📝 Test Data

**Demo Accounts:**
- Student: `student@demo.com` / `password`
- Teacher: `teacher@demo.com` / `password`
- School Admin: `school@demo.com` / `password`
- Parent: `parent@demo.com` / `password`

**Sample Stories:**
- "The Courage Tree" (Self-Esteem, Ages 8-10)
- "The Friendship Garden" (Social Skills, Ages 6-8)

**Sample Assessments:**
- Anxiety Screening (CBT, 8 questions)
- Social Skills Assessment (PBCT, 5 questions)

---

## 🚀 Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Deploy to production** (Railway + Vercel)
3. **Integrate OpenAI API** for real story generation
4. **Add email notifications** for high-risk alerts
5. **Implement PDF export** for reports
6. **Add more stories and assessments**

---

**Happy Testing! 🎉**
