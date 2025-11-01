# Talent Flow - ATS & Recruitment Management System

A comprehensive **Applicant Tracking System (ATS)** built with **React**, featuring job management, candidate tracking, and a dynamic assessment builder.

---

## Features

### Job Management
- **CRUD Operations:** Create, read, update, and archive job postings  
- **Drag & Drop Reordering:** Intuitive job prioritization with `@dnd-kit`  
- **Advanced Filtering:** Filter by status, tags, and custom criteria  
- **Pagination:** Efficient navigation through large job listings  
- **Tag System:** Categorize jobs with 50+ predefined technical skills  

### Candidate Tracking
- **Visual Pipeline:** Drag-and-drop candidates through hiring stages  
- **Timeline View:** Track candidate progression from application to hire  
- **Real-time Updates:** Automatic status synchronization  
- **Notes System:** Collaborative notes with `@mention` functionality for HR teams  
- **Stage Management:** Applied → Screen → Tech → Offer → Hired/Rejected  

### Dynamic Assessment Builder
- **Visual Form Builder:** Create custom assessments with live preview  
- **Multiple Question Types:**
  - Short & Long text responses  
  - Single & Multiple choice  
  - Numeric inputs 
  - File uploads *(stub implementation)*  
- **Custom Validation:** Min/max values, required fields, length limits  
- **Real-time Preview:** See exactly how candidates will experience the assessment  

### Role-Based Access
- **Recruiter Role:** Full CRUD access to jobs and assessments  
- **Job Seeker Role:** View-only access to job listings  
- **Candidate Management:** Dedicated interface for HR teams  

---

## Tech Stack

### Frontend
- **React 19.2** - UI framework  
- **React Router 7.9** - Client-side routing  
- **Tailwind CSS 4.1** - Utility-first styling  
- **@dnd-kit** - Drag and drop functionality  
- **Axios** - HTTP client  
- **React Window** - Virtualized list rendering  

### Data Management
- **Dexie.js** - IndexedDB wrapper for local storage  
- **MirageJS** - Mock API server for development  
- **@faker-js/faker** - Realistic test data generation  

### Development Tools
- **Vite 7.1** - Build tool and dev server  
- **ESLint** - Code linting  
- **UUID** - Unique identifier generation  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/talent-flow.git

# Navigate to project directory
cd talent-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```
npm run preview
```

### Run linter
```
npm run lint
```

The application will be available at `http://localhost:5173`

## Project Structure
```bash 
talent-flow/
├── src/
│   ├── components/
│   │   ├── assessment/         # Assessment builder components
│   │   ├── candidates/         # Candidate management components
│   │   └── jobs/               # Job listing components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route pages
│   │   ├── assessment/
│   │   ├── candidate/
│   │   └── jobs/
│   └── utils/                  # Utility functions
├── extendedDB/                 # Dexie database configuration
├── mirage/                     # Mock API routes
└── public/                     # Static assets
```

## Key Components

### Assessment Builder
- **`AssessmentBuilder.jsx`** — Main builder interface with drag-and-drop sections  
- **`AssessmentPreview.jsx`** — Real-time preview of assessment forms  
- **`AssessmentForm.jsx`** — Runtime form for candidates to fill  

---

### Candidate Management
- **`candidateTimeline.jsx`** — Visual pipeline with drag-and-drop stages  
- **`draggableProfile.jsx`** — Draggable candidate card  
- **`droppableStage.jsx`** — Drop zones for pipeline stages  

---

### Job Management
- **`jobs.jsx`** — Main job listing with filters and pagination  
- **`jobRow.jsx`** — Individual job card with sortable functionality  
- **`jobedit.jsx`** — Job editing interface  


## Database Schema

### Jobs Table
```javascript
{
  jobid: number,         // auto-increment
  title: string,
  status: 'active' | 'archived',
  tags: array,
  order: number
}
```

### Candidates 
```
{
  id: number,            // auto-increment
  name: string,
  email: string,
  phone: string,
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected',
  timeline: object,
  notes: string
}
```

### Assessments Table
```
{
  id: number,            // auto-increment
  jobId: number,
  title: string,
  sections: array,
  updatedAt: timestamp
}
```

### Configuration 

1. Fork the repository

2. Create a feature branch
```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes 
```bash
git commit -m 'Add some AmazingFeature'
```

4. Push to your branch 
```bash
git push origin feature/AmazingFeature
```

5. Open pull request

---

## Future Enhancements
future_enhancements:
  - Email notifications for stage changes
  - Advanced analytics dashboard
  - Resume parsing with AI
  - Calendar integration for interviews
  - Multi-language support
  - Export candidate data to CSV
  - Video interview integration
  - Automated candidate scoring


## Acknowledgments
acknowledgments:
  - name: Faker.js
    purpose: Realistic test data
  - name: dnd-kit
    purpose: Smooth drag-and-drop experience
  - name: Tailwind CSS
    purpose: Rapid UI development
  - name: React community
    purpose: Excellent documentation

---

### Built with ❤️ using React and modern web technologies
