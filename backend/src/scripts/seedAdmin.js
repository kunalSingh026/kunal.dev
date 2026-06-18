const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

const sequelize = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Experience = require('../models/Experience');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

async function seed() {
  console.log('--- Initializing Portfolio Database Seeding ---');
  
  // Sync the database
  await sequelize.sync({ force: true });
  console.log('Database synchronized (tables cleared).');

  // 1. Seed Admin User
  let username = process.env.ADMIN_USER;
  let password = process.env.ADMIN_PASS;

  if (!username || !password) {
    if (process.stdin.isTTY) {
      console.log('No admin credentials found in environment. Please enter credentials:');
      username = await askQuestion('Admin Username: ');
      password = await askQuestion('Admin Password: ');
    } else {
      console.error('Error: Stdin is not a TTY and ADMIN_USER/ADMIN_PASS are not set. Exiting.');
      process.exit(1);
    }
  }

  if (!username || !password) {
    console.error('Username and Password cannot be empty.');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.create({
    username,
    password: passwordHash,
  });
  console.log(`Admin user "${username}" successfully seeded.`);

  // 2. Seed Projects
  const defaultProjects = [
    {
      title: 'HackFlow',
      description: 'A cybersecurity workflow automation and orchestration dashboard featuring zero-trust design, HttpOnly cookie rotation, and Sentry APM implementation details. Proudly showcases native MongoDB pipeline skills for high-throughput security event aggregation and real-time incident auditing.',
      tags: ['Next.js', 'Express', 'MongoDB', 'JWT', 'Sentry', 'Tailwind CSS'],
      githubUrl: 'https://github.com/kunal-dev/hackflow',
      liveUrl: 'https://hackflow.kunal.dev',
      imagePath: '/projects/hackflow.jpg',
      order: 1
    },
    {
      title: 'CineBook',
      description: 'A full-stack movie ticket configuration and booking platform. Features interactive seating grid layout management, real-time transaction holding mechanisms, session-based checkout structures, and an administrative dashboard to manage screenings and cinema layouts.',
      tags: ['React', 'Node.js', 'Express', 'SQL', 'Redux'],
      githubUrl: 'https://github.com/kunal-dev/cinebook',
      liveUrl: 'https://cinebook.kunal.dev',
      imagePath: '/projects/cinebook.jpg',
      order: 2
    },
    {
      title: 'Attendance Tracker',
      description: 'A robust attendance management system built for educational institutions. Employs a robust Django backend architecture, role-based access control, automatic PDF report generation, and cron-scheduled email alerts for low attendance triggers.',
      tags: ['Python', 'Django', 'PostgreSQL', 'HTML5/CSS3', 'JS'],
      githubUrl: 'https://github.com/kunal-dev/attendance-tracker',
      liveUrl: 'https://attendance.kunal.dev',
      imagePath: '/projects/attendance.jpg',
      order: 3
    },
    {
      title: 'FleetEase',
      description: 'An enterprise logistics and fleet tracking software engineered using pure object-oriented Java. Features route optimization algorithms, driver performance analytics, fuel consumption logging, and structured design patterns ensuring clean scaling.',
      tags: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'ThymeLeaf'],
      githubUrl: 'https://github.com/kunal-dev/fleetease',
      liveUrl: 'https://fleetease.kunal.dev',
      imagePath: '/projects/fleetease.jpg',
      order: 4
    }
  ];

  await Project.bulkCreate(defaultProjects);
  console.log(`${defaultProjects.length} projects successfully seeded.`);

  // 3. Seed Experiences
  const defaultExperiences = [
    {
      role: 'Web Designing Intern',
      company: 'PaulTech Software Services',
      period: 'June 2025 - Present',
      description: 'Driving responsive frontend updates and interactive layout modules. Built cross-browser compatible single-page web applications utilizing React and advanced CSS architectures. Collaborated on refactoring client dashboards, boosting page load performance by 25%.',
      location: 'Ranchi, India',
      order: 1
    },
    {
      role: 'Open Source Contributor',
      company: 'GirlScript Summer of Code',
      period: '2023 - 2025',
      description: 'Achieved a consecutive 3x participation streak within the GSSoC ecosystem. Contributed high-quality pull requests optimizing frontend rendering pipelines, writing unit tests for core utilities, and standardizing component APIs across multiple repositories.',
      location: 'Remote',
      order: 2
    },
    {
      role: 'Hackathon Competitor',
      company: 'Hackathons & Sprints',
      period: '2024 - 2025',
      description: 'Competed at high-velocity environments including the Hack8on Coding Sprint, DevFest Ranchi, and achieved a finalist position in the Supermind Hackathon round layout. Designed and pitched working full-stack prototypes within 36-hour timelines.',
      location: 'Various',
      order: 3
    }
  ];

  await Experience.bulkCreate(defaultExperiences);
  console.log(`${defaultExperiences.length} experiences successfully seeded.`);

  console.log('--- Seeding Completed Successfully ---');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
