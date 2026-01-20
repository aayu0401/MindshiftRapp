# Mindshiftr - Mental Health Literacy Platform

A comprehensive, production-ready mental health web application for schools featuring evidence-based CBT/SLT content, interactive assessments, and real-time analytics.

## 🚀 Live Demo

**URL:** [Coming Soon - Deploy to Vercel/Netlify]

## ✨ Features

- 🔐 **Multi-Role Authentication** - Student, Teacher, School Admin, Parent
- 📚 **Interactive Stories** - 4 therapeutic stories with embedded CBT/SLT questions
- 🎓 **Course Catalog** - 6 mental health literacy courses
- 📊 **CBT/PBCT Assessments** - Professional screening tools with risk classification
- 📈 **Analytics Dashboard** - Recharts visualizations for progress tracking
- 🆘 **Crisis Resources** - Emergency support with hotlines and immediate help
- 🤖 **AI Story Creator** - Generate custom therapeutic stories
- 👨‍👩‍👧 **Parent Portal** - Track child progress and wellbeing insights

## 🎨 Design

- Modern glassmorphism UI
- Smooth Framer Motion animations
- Responsive design for all devices
- Accessibility features (ARIA labels, keyboard navigation)
- Professional color palette with teal accents

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router DOM
- Framer Motion (animations)
- Recharts (data visualization)
- React Hook Form + Zod (form validation)
- React Hot Toast (notifications)

**Styling:**
- Custom CSS with design tokens
- Glassmorphism effects
- Gradient backgrounds
- Responsive grid layouts

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/aayu0401/MindshiftR-app.git
cd MindshiftR-app

# Install dependencies
cd web
npm install

# Start development server
npm run dev
```

## 🚀 Quick Start

1. Navigate to `http://localhost:5173/login`
2. Use demo accounts:
   - Teacher: `teacher@demo.com` / `password`
   - Student: `student@demo.com` / `password`
   - School: `school@demo.com` / `password`

## 📱 Pages

### Public Pages
- `/login` - Beautiful login with role selection
- `/signup` - Multi-step signup process
- `/stories` - Story library with filters
- `/courses` - Course catalog
- `/assessments` - Assessment list
- `/crisis-support` - Emergency resources
- `/about` - Behind the science
- `/faqs` - Frequently asked questions

### Protected Pages
- `/dashboard` - Analytics dashboard (Teacher/School)
- `/ai-creator` - AI story generator (Teacher/School)
- `/parent-portal` - Parent dashboard

## 🎯 Key Features

### Authentication
- Multi-role system (Student, Teacher, School, Parent)
- Beautiful split-screen login
- 4-step guided signup
- Protected routes with role-based access

### Stories
- 4 therapeutic stories with CBT/SLT principles
- Interactive reader with progress tracking
- Embedded therapeutic questions
- Filter by category and age group

### Assessments
- Anxiety Screening (8 questions)
- Mood & Depression Screening (6 questions)
- Social Skills Assessment (5 questions)
- Behavioral Regulation (4 questions)
- Risk classification: Low/Moderate/High
- Automated recommendations

### Analytics
- Recharts visualizations (line, bar, pie charts)
- Student progress tracking
- High-risk student alerts
- Class completion rates
- Export reports

### Crisis Support
- National Suicide Prevention Lifeline (988)
- Crisis Text Line
- SAMHSA Helpline
- Immediate action steps
- Warning signs checklist

## 🏗️ Project Structure

```
web/src/
├── pages/          # 13 application pages
├── components/     # 10 reusable components
├── context/        # Authentication context
├── data/           # Sample data (stories, courses, assessments)
└── styles.css      # Global design system
```

## 🎨 Design System

**Colors:**
- Primary: #00d4aa (Teal)
- Background: #0a1628 (Midnight Blue)
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

**Typography:**
- Headings: Montserrat
- Body: Montserrat
- Stories: PT Serif

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📝 Environment Variables

Currently using mock authentication. For production:

```env
VITE_API_URL=your_backend_api_url
VITE_AUTH_DOMAIN=your_auth_domain
```

## 🤝 Contributing

This is a school mental health platform. Contributions welcome!

## 📄 License

MIT License

## 🙏 Acknowledgments

- Inspired by evidence-based mental health practices
- Built with React and modern web technologies
- Designed for student wellbeing

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for student mental health and wellbeing**
