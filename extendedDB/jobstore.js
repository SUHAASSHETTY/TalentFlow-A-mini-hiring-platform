import Dexie from 'dexie'

const databaseName = 'talentmania'

export const db = new Dexie(databaseName);

db.version(1).stores({
    jobs: '++jobid,title'
})

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
        if(await db.jobs.count()==0){
            await db.jobs.bulkAdd(jobs)
        }
    }catch(err){
        console.log("error when seeding job ", err)
    }
}
