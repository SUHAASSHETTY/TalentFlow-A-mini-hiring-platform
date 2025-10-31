// extendedDB/jobstore.js
import Dexie from 'dexie';
import { faker } from '@faker-js/faker';

const databaseName = 'talentmania';

export const db = new Dexie(databaseName);

db.version(1).stores({
  jobs: '++jobid,title,status,order,*tags',
  candidates: '++id,name,email,stage',
  hrs: '++id,name',
  assessments: '++id,jobId,title,updatedAt', // builder definitions
  assessmentResponses: '++id,jobId,candidateId,submittedAt' // responses
});

export async function seedAssessments() {
  try {
    if (await db.assessments.count() > 0) {
      console.log('assessments already seeded');
      return;
    }

    // Create some example assessments for a few job IDs (1..5). Real seed: create for job.jobid
    const sampleAssessments = [];
    const now = new Date().toISOString();

    for (let jobId = 1; jobId <= 5; jobId++) {
      const sections = [
        {
          id: `sec-${jobId}-1`,
          title: 'General',
          questions: [
            {
              id: `q-${jobId}-1-1`,
              type: 'single', // single-choice
              label: 'Do you have prior experience in this role?',
              options: ['Yes', 'No'],
              required: true
            },
            {
              id: `q-${jobId}-1-2`,
              type: 'short',
              label: 'If yes, how many years?',
              required: false,
              showIf: { questionId: `q-${jobId}-1-1`, operator: '===', value: 'Yes' },
              validators: { numeric: true, min: 0, max: 50 }
            }
          ]
        },
        {
          id: `sec-${jobId}-2`,
          title: 'Technical',
          questions: [
            {
              id: `q-${jobId}-2-1`,
              type: 'multi',
              label: 'Which of these technologies do you know?',
              options: ['React', 'Node.js', 'Docker', 'Kubernetes'],
              required: true
            },
            {
              id: `q-${jobId}-2-2`,
              type: 'long',
              label: 'Describe a problem you solved recently.',
              required: false,
              validators: { maxLength: 500 }
            }
          ]
        }
      ];

      sampleAssessments.push({
        jobId,
        title: `Assessment for job ${jobId}`,
        sections,
        updatedAt: now
      });
    }

    await db.assessments.bulkAdd(sampleAssessments);
    console.log('seeded assessments');
  } catch (err) {
    console.error('error seeding assessments', err);
  }
}

export const jobs = [
  { title: "Frontend Developer", slug: "frontend-developer", status: "active", tags: ["React", "JavaScript", "UI", "CSS"], order: 1 },
  { title: "Backend Engineer", slug: "backend-engineer", status: "active", tags: ["Node.js", "API", "Databases", "Go"], order: 2 },
  { title: "Data Analyst", slug: "data-analyst", status: "active", tags: ["SQL", "Python", "Visualization", "Excel"], order: 3 },
  { title: "Machine Learning Engineer", slug: "ml-engineer", status: "active", tags: ["Python", "TensorFlow", "AI", "Data"], order: 4 },
  { title: "Full Stack Developer", slug: "fullstack-developer", status: "active", tags: ["React", "Node.js", "MongoDB", "API"], order: 5 },
  { title: "Cloud Architect", slug: "cloud-architect", status: "active", tags: ["AWS", "Kubernetes", "DevOps", "Networking"], order: 6 },
  { title: "DevOps Engineer", slug: "devops-engineer", status: "active", tags: ["Docker", "Kubernetes", "CI/CD", "Linux"], order: 7 },
  { title: "Software Engineer Intern", slug: "software-intern", status: "active", tags: ["JavaScript", "HTML", "CSS", "Teamwork"], order: 8 },
  { title: "QA Tester", slug: "qa-tester", status: "active", tags: ["Testing", "Automation", "Selenium", "API"], order: 9 },
  { title: "Product Manager", slug: "product-manager", status: "active", tags: ["Agile", "Roadmap", "Leadership", "Communication"], order: 10 },
  { title: "Data Engineer", slug: "data-engineer", status: "active", tags: ["ETL", "Python", "SQL", "Pipelines"], order: 11 },
  { title: "UI/UX Designer", slug: "ui-ux-designer", status: "active", tags: ["Figma", "UI", "Prototyping", "Accessibility"], order: 12 },
  { title: "Mobile App Developer", slug: "mobile-developer", status: "active", tags: ["React Native", "Android", "iOS", "JavaScript"], order: 13 },
  { title: "System Administrator", slug: "system-admin", status: "active", tags: ["Linux", "Networking", "Security", "Monitoring"], order: 14 },
  { title: "Security Analyst", slug: "security-analyst", status: "active", tags: ["Security", "Network", "Monitoring", "Threat Detection"], order: 15 },
  { title: "Senior Frontend Developer", slug: "senior-frontend-developer", status: "active", tags: ["React", "TypeScript", "Performance", "UI"], order: 16 },
  { title: "Senior Backend Developer", slug: "senior-backend-developer", status: "active", tags: ["Go", "PostgreSQL", "Microservices", "API"], order: 17 },
  { title: "Senior Backend Engineer", slug: "senior-backend-engineer", status: "active", tags: ["Go", "Architecture", "Scalability", "PostgreSQL"], order: 18 },
  { title: "Senior Frontend Engineer", slug: "senior-frontend-engineer", status: "active", tags: ["React", "TypeScript", "UI", "Performance"], order: 19 },
  { title: "AI Researcher", slug: "ai-researcher", status: "active", tags: ["AI", "Deep Learning", "Python", "Research"], order: 20 },
  { title: "Network Engineer", slug: "network-engineer", status: "active", tags: ["Networking", "Routers", "TCP/IP", "Security"], order: 21 },
  { title: "Senior DevOps Engineer", slug: "senior-devops-engineer", status: "active", tags: ["AWS", "Terraform", "CI/CD", "Monitoring"], order: 22 },
  { title: "Database Administrator", slug: "database-admin", status: "active", tags: ["MySQL", "PostgreSQL", "Backup", "Performance"], order: 23 },
  { title: "Technical Writer", slug: "technical-writer", status: "archived", tags: ["Documentation", "Writing", "API", "Editing"], order: 24 },
  { title: "Game Developer", slug: "game-developer", status: "active", tags: ["Unity", "C#", "3D", "Graphics"], order: 25 },
  { title: "Support Engineer", slug: "support-engineer", status: "archived", tags: ["Customer Support", "Troubleshooting", "Communication", "Teamwork"], order: 26 },
  { title: "Senior Data Scientist", slug: "senior-data-scientist", status: "active", tags: ["Python", "ML", "AI", "Statistics"], order: 27 },
  { title: "Project Coordinator", slug: "project-coordinator", status: "archived", tags: ["Planning", "Leadership", "Communication", "Agile"], order: 28 },
  { title: "Blockchain Developer", slug: "blockchain-developer", status: "active", tags: ["Solidity", "Ethereum", "Smart Contracts", "Web3"], order: 29 },
  { title: "Embedded Systems Engineer", slug: "embedded-engineer", status: "active", tags: ["C++", "IoT", "Microcontrollers", "Hardware"], order: 30 },
  { title: "Automation Engineer", slug: "automation-engineer", status: "active", tags: ["Selenium", "Python", "CI/CD", "Testing"], order: 31 },
  { title: "Senior Software Architect", slug: "senior-software-architect", status: "active", tags: ["Architecture", "Scalability", "Cloud", "Leadership"], order: 32 },
  { title: "Data Analyst", slug: "data-analyst-2", status: "active", tags: ["SQL", "Python", "Visualization", "Pandas"], order: 33 },
  { title: "Cloud Support Engineer", slug: "cloud-support-engineer", status: "active", tags: ["AWS", "Linux", "Networking", "Support"], order: 34 },
  { title: "Senior Cloud Engineer", slug: "senior-cloud-engineer", status: "active", tags: ["Kubernetes", "AWS", "Terraform", "Security"], order: 35 }
];

export async function seedJobs(){
    try{
        // await db.jobs.clear();
        if(await db.jobs.count()==0){
            await db.jobs.bulkAdd(jobs)
        }else{
            console.log("already seeded the jobs db");
        }
    }catch(err){
        console.log("error when seeding job ", err)
    }
}

export async function seedHRs(){
    try{
        if(await db.hrs.count()==0){
            let hrList = [];
            for(let i=1;i<=50;i++){
                hrList.push({
                    name: faker.person.fullName(),
                })
            }
            await db.hrs.bulkAdd(hrList);
        }else{
            console.log("Already seeded the hrs DB");
        }
    }catch(err){
        console.log("error when seeding HRs ", err);
    }
}

export async function seedCandidates() {
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const noteTemplates = [
        "Please look into this candidate @",
        "Do you think we should hire @",
        "Let’s move forward with this one, @",
        "Need a quick feedback from @",
        "Can you review this profile, @",
        "Looks promising, check with @",
        "Pending decision, discuss with @"
    ];

    try {
        // await db.candidates.clear();
        if (await db.candidates.count() === 0) {
            const hrs = await db.hrs.toArray();

            if (hrs.length === 0) {
                console.warn("No HRs found in db.hrs — please seed HRs before seeding candidates.");
                return;
            }

            const users = [];
            const now = new Date();

            const formatDate = (date) => {
                const d = String(date.getDate()).padStart(2, "0");
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const y = date.getFullYear();
                return `${d}-${m}-${y}`;
            };

            for (let i = 0; i < 1000; i++) {
                const stage = stages[Math.floor(Math.random() * stages.length)];
                const timeline = {};

                let date = new Date(now.getTime() - faker.number.int({ min: 20, max: 90 }) * 24 * 60 * 60 * 1000);

                const advanceDate = () => {
                    date = new Date(date.getTime() + faker.number.int({ min: 2, max: 7 }) * 24 * 60 * 60 * 1000);
                    return formatDate(date);
                };

                if (stage === "rejected") {
                    const progressStages = ["applied", "screen", "tech", "offer"];
                    const reachedIndex = faker.number.int({ min: 0, max: progressStages.length - 1 });

                    for (let j = 0; j <= reachedIndex; j++) {
                        timeline[progressStages[j]] = advanceDate();
                    }

                    timeline["rejected"] = advanceDate();
                } else {
                    const reachedIndex = stages.indexOf(stage);
                    for (let j = 0; j <= reachedIndex; j++) {
                        timeline[stages[j]] = advanceDate();
                    }
                }

                
                const hr = faker.helpers.arrayElement(hrs);
                const noteTemplate = faker.helpers.arrayElement(noteTemplates);
                let notes;
                if(Math.random() < 0.3) {
                    notes = `${noteTemplate}${hr.name}`;
                }else{
                    notes = '';
                }

                users.push({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    stage,
                    timeline,
                    notes
                });
            }

            await db.candidates.bulkAdd(users);
            console.log("Candidates seeded with notes containing @HRName and chronologically ordered timelines (dd-mm-yyyy)");
        } else {
            console.log("Already seeded the candidates DB");
        }
    } catch (err) {
        console.error("Error while seeding the DB:", err);
    }
}

