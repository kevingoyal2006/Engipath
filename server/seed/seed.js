const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const CareerPath = require('../models/CareerPath');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const QuizQuestion = require('../models/QuizQuestion');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old database collections...');
    await User.deleteMany({});
    await CareerPath.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await QuizQuestion.deleteMany({});
    await Progress.deleteMany({});

    console.log('Seeding Skills...');

    // 1. HTML & CSS
    const htmlCss = await Skill.create({
      name: 'HTML & CSS',
      description: 'Foundations of web structure, semantic markup, CSS Flexbox/Grid, and responsive layout design.',
      category: 'Frontend',
      prerequisites: [],
      estimatedHours: 12,
      resources: [
        { title: 'MDN Web Docs - HTML & CSS', url: 'https://developer.mozilla.org', type: 'docs' },
        { title: 'FreeCodeCamp Responsive Web Design', url: 'https://www.freecodecamp.org', type: 'course' }
      ],
      miniTask: {
        title: 'Build a Product Card Component',
        description: 'Create a responsive pricing card using modern CSS Grid & Flexbox with hover transitions.',
        instructions: ['Use semantic section and article tags', 'Apply flexbox layout for price tags', 'Add CSS transitions on hover']
      }
    });

    // 2. JavaScript Fundamentals
    const jsFund = await Skill.create({
      name: 'JavaScript Fundamentals',
      description: 'ES6+ syntax, functions, scopes, closures, DOM manipulation, promises, and fetch API.',
      category: 'Frontend',
      prerequisites: [htmlCss._id],
      estimatedHours: 20,
      resources: [
        { title: 'javascript.info - Modern JS', url: 'https://javascript.info', type: 'article' },
        { title: 'JS Async & Promises Explained', url: 'https://youtube.com', type: 'video' }
      ],
      miniTask: {
        title: 'Interactive Weather Widget',
        description: 'Fetch real-time weather data using Fetch API and render modern UI elements dynamically.',
        instructions: ['Use async/await with fetch', 'Handle loading and error UI states', 'Manipulate DOM elements safely']
      }
    });

    // 3. Git & GitHub
    const gitGithub = await Skill.create({
      name: 'Git & GitHub',
      description: 'Version control basics, branching, commits, pull requests, merge conflict resolution, and teamwork.',
      category: 'DevOps',
      prerequisites: [],
      estimatedHours: 6,
      resources: [
        { title: 'Git Official Handbook', url: 'https://git-scm.com/book', type: 'docs' },
        { title: 'GitHub Skills Interactive', url: 'https://skills.github.com', type: 'course' }
      ],
      miniTask: {
        title: 'Initialize Git & Create PR',
        description: 'Create a local repository, create a feature branch, resolve a merge conflict, and push to GitHub.',
        instructions: ['Initialize git repo', 'Create feature branch and make commits', 'Simulate merge conflict and resolve it']
      }
    });

    // 4. React Fundamentals
    const reactFund = await Skill.create({
      name: 'React Fundamentals',
      description: 'JSX, Functional Components, Props, State management (useState, useEffect), and hooks.',
      category: 'Frontend',
      prerequisites: [jsFund._id],
      estimatedHours: 20,
      resources: [
        { title: 'Official React Documentation', url: 'https://react.dev', type: 'docs' },
        { title: 'React Crash Course 2026', url: 'https://youtube.com', type: 'video' }
      ],
      miniTask: {
        title: 'Interactive Task Manager',
        description: 'Build a React app managing complex component state with filter tags and persistent storage.',
        instructions: ['Implement useState for task list', 'Use useEffect for localStorage persistence', 'Componentize UI into reusable cards']
      }
    });

    // 5. Node.js & Express
    const nodeExpress = await Skill.create({
      name: 'Node.js & Express',
      description: 'Server-side JS execution, REST API routing, middleware execution, error handling, and JSON parsing.',
      category: 'Backend',
      prerequisites: [jsFund._id],
      estimatedHours: 18,
      resources: [
        { title: 'Express.js Guide', url: 'https://expressjs.com', type: 'docs' },
        { title: 'Node.js Event Loop Deep Dive', url: 'https://nodejs.org', type: 'article' }
      ],
      miniTask: {
        title: 'Build RESTful API Endpoint',
        description: 'Create Express routes handling GET, POST, PUT, DELETE requests with body validation.',
        instructions: ['Set up express router', 'Implement input validation middleware', 'Return standardized JSON error responses']
      }
    });

    // 6. MongoDB & Mongoose
    const mongoDB = await Skill.create({
      name: 'MongoDB & Mongoose',
      description: 'NoSQL document databases, collections, Mongoose schemas, queries, indexing, and aggregations.',
      category: 'Database',
      prerequisites: [nodeExpress._id],
      estimatedHours: 12,
      resources: [
        { title: 'MongoDB University', url: 'https://university.mongodb.com', type: 'course' },
        { title: 'Mongoose ODM Docs', url: 'https://mongoosejs.com', type: 'docs' }
      ],
      miniTask: {
        title: 'Model Engineering Student Schema',
        description: 'Design Mongoose schema with schema validation, custom virtuals, and populated subdocuments.',
        instructions: ['Create Mongoose model', 'Add validation rules for fields', 'Perform populated query with error handling']
      }
    });

    // 7. JWT Authentication
    const jwtAuth = await Skill.create({
      name: 'JWT Authentication',
      description: 'Token-based authentication, password hashing with bcrypt, auth headers, and authorization middleware.',
      category: 'Security',
      prerequisites: [nodeExpress._id, mongoDB._id],
      estimatedHours: 10,
      resources: [
        { title: 'JWT.io Introduction', url: 'https://jwt.io', type: 'docs' },
        { title: 'Securing Web Applications with JWT', url: 'https://owasp.org', type: 'article' }
      ],
      miniTask: {
        title: 'Auth & Protected Route Middleware',
        description: 'Implement JWT sign/verify logic with role-based authorization check middleware.',
        instructions: ['Hash passwords using bcryptjs', 'Sign JWT tokens upon login', 'Protect administrative endpoints with middleware']
      }
    });

    // 8. DSA Basics
    const dsaBasics = await Skill.create({
      name: 'DSA Basics',
      description: 'Arrays, Linked Lists, Stacks, Queues, Hash Tables, Sorting, Binary Search, and Big-O Time Complexity.',
      category: 'Core Engineering',
      prerequisites: [jsFund._id],
      estimatedHours: 20,
      resources: [
        { title: 'LeetCode Problem Set', url: 'https://leetcode.com', type: 'course' },
        { title: 'JavaScript Data Structures Guide', url: 'https://geeksforgeeks.org', type: 'article' }
      ],
      miniTask: {
        title: 'Implement Two Sum & Binary Search',
        description: 'Write optimized O(N) hash map lookup algorithm and O(log N) binary search function in JS.',
        instructions: ['Implement hash map search', 'Write binary search algorithm', 'Analyze time and space complexity']
      }
    });

    // 9. MERN Capstone
    const mernCapstone = await Skill.create({
      name: 'MERN Capstone',
      description: 'Full-stack application integration combining React frontend, Express API, MongoDB database, and JWT security.',
      category: 'Frontend',
      prerequisites: [reactFund._id, nodeExpress._id, mongoDB._id],
      estimatedHours: 30,
      resources: [
        { title: 'MERN Stack Architectural Patterns', url: 'https://fullstackopen.com', type: 'course' }
      ],
      miniTask: {
        title: 'Deploy Full-Stack Application',
        description: 'Connect React client with Express backend API, configure CORS, and manage state end-to-end.',
        instructions: ['Connect Axios client to API', 'Manage global state with Auth Context', 'Deploy client & server seamlessly']
      }
    });

    console.log('Seeding Full-Stack Web Developer Career Path...');
    const fullStackCareer = await CareerPath.create({
      name: 'Full-Stack Web Developer',
      description: 'Build modern end-to-end web applications using React, Node.js, Express, and MongoDB.',
      requiredSkills: [
        { skillId: htmlCss._id, priority: 1, minimumLevel: 'intermediate' },
        { skillId: jsFund._id, priority: 2, minimumLevel: 'intermediate' },
        { skillId: gitGithub._id, priority: 3, minimumLevel: 'beginner' },
        { skillId: reactFund._id, priority: 4, minimumLevel: 'intermediate' },
        { skillId: nodeExpress._id, priority: 5, minimumLevel: 'intermediate' },
        { skillId: mongoDB._id, priority: 6, minimumLevel: 'intermediate' },
        { skillId: jwtAuth._id, priority: 7, minimumLevel: 'advanced' },
        { skillId: dsaBasics._id, priority: 8, minimumLevel: 'beginner' },
        { skillId: mernCapstone._id, priority: 9, minimumLevel: 'advanced' }
      ]
    });

    console.log('Seeding Projects Ladder...');
    const project1 = await Project.create({
      title: 'Portfolio Website',
      description: 'Personal responsive developer portfolio showcasing bio, skills, projects, and contact form.',
      difficulty: 'beginner',
      requiredSkills: [htmlCss._id],
      estimatedHours: 10,
      checklist: [
        'Semantic HTML layout structure',
        'Responsive layout with CSS Flexbox / Grid',
        'Mobile navigation menu',
        'Deploy project to GitHub Pages or Netlify'
      ]
    });

    const project2 = await Project.create({
      title: 'Interactive To-Do App',
      description: 'Dynamic JavaScript web app with local storage persistence, filtering, and event handling.',
      difficulty: 'beginner',
      requiredSkills: [htmlCss._id, jsFund._id],
      estimatedHours: 12,
      checklist: [
        'DOM manipulation for item creation',
        'Persist items in localStorage',
        'Filter tasks by All, Active, Completed',
        'Add smooth CSS transition animations'
      ]
    });

    const project3 = await Project.create({
      title: 'Expense Tracker Dashboard',
      description: 'React SPA for tracking incomes and expenses with dynamic chart analytics and category filtering.',
      difficulty: 'intermediate',
      requiredSkills: [jsFund._id, reactFund._id],
      estimatedHours: 20,
      checklist: [
        'React state management with useState & useReducer',
        'Data visualization using Chart.js / Recharts',
        'Category breakdown calculation',
        'Export data to CSV feature'
      ]
    });

    const project4 = await Project.create({
      title: 'Blog API Engine',
      description: 'Express REST API with MongoDB database for blog posts, categories, tags, and comment threads.',
      difficulty: 'intermediate',
      requiredSkills: [jsFund._id, nodeExpress._id, mongoDB._id],
      estimatedHours: 18,
      checklist: [
        'Express Router setup for CRUD operations',
        'Mongoose Schema design with validation',
        'Pagination and search filtering',
        'Standardized error handling middleware'
      ]
    });

    const project5 = await Project.create({
      title: 'EngiPath-style Capstone',
      description: 'Full-stack MERN career roadmap platform with JWT authentication, role management, and analytics.',
      difficulty: 'advanced',
      requiredSkills: [reactFund._id, nodeExpress._id, mongoDB._id, jwtAuth._id, mernCapstone._id],
      estimatedHours: 40,
      checklist: [
        'User registration and JWT session management',
        'Topological sort roadmap generator algorithm',
        'Explainable readiness score calculator',
        'Interactive Quiz assessment suite and Admin panel'
      ]
    });

    console.log('Seeding Quiz Questions...');
    const questions = [
      // HTML & CSS
      {
        skillId: htmlCss._id,
        question: 'Which CSS property defines a flexible container and enables Flexbox layout?',
        options: ['display: grid', 'display: flex', 'position: relative', 'float: left'],
        correctAnswer: 1,
        explanation: 'display: flex turns an element into a flex container and enables flex layout for all direct children.',
        difficulty: 'easy'
      },
      {
        skillId: htmlCss._id,
        question: 'Which HTML5 semantic element should be used for main navigation links?',
        options: ['<section>', '<nav>', '<aside>', '<header>'],
        correctAnswer: 1,
        explanation: 'The <nav> element represents a section of a page whose purpose is to provide navigation links.',
        difficulty: 'easy'
      },
      // JS Fundamentals
      {
        skillId: jsFund._id,
        question: 'What is the output of `typeof null` in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"number"'],
        correctAnswer: 2,
        explanation: 'In JS, `typeof null` returns "object" due to a historical legacy implementation bug in early JS versions.',
        difficulty: 'medium'
      },
      {
        skillId: jsFund._id,
        question: 'Which method creates a new array populated with the results of calling a function on every element?',
        options: ['forEach()', 'filter()', 'map()', 'reduce()'],
        correctAnswer: 2,
        explanation: 'map() creates a new array by executing a callback on each element without mutating the original array.',
        difficulty: 'easy'
      },
      // Git & GitHub
      {
        skillId: gitGithub._id,
        question: 'Which Git command creates a new branch and switches to it immediately?',
        options: ['git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git commit -b <name>'],
        correctAnswer: 1,
        explanation: 'git checkout -b <name> creates a new branch and checks out that branch into your workspace.',
        difficulty: 'easy'
      },
      // React Fundamentals
      {
        skillId: reactFund._id,
        question: 'Why must React state never be mutated directly (e.g. `state.count = 5`)?',
        options: [
          'It throws a syntax error immediately',
          'React relies on immutability to trigger component re-renders',
          'Direct mutation deletes the state object',
          'React converts state into immutable strings'
        ],
        correctAnswer: 1,
        explanation: 'React compares state references to decide when to re-render. Direct mutation bypasses re-rendering mechanisms.',
        difficulty: 'medium'
      },
      {
        skillId: reactFund._id,
        question: 'Which Hook is used to perform side effects in functional components?',
        options: ['useState', 'useContext', 'useEffect', 'useMemo'],
        correctAnswer: 2,
        explanation: 'useEffect handles side effects such as data fetching, subscriptions, and DOM updates in functional components.',
        difficulty: 'easy'
      },
      // Node.js & Express
      {
        skillId: nodeExpress._id,
        question: 'In Express middleware, what parameter must be invoked to pass control to the next handler?',
        options: ['res.send()', 'next()', 'res.json()', 'return true'],
        correctAnswer: 1,
        explanation: 'Invoking next() transfers control to the next middleware function in the stack.',
        difficulty: 'easy'
      },
      // MongoDB & Mongoose
      {
        skillId: mongoDB._id,
        question: 'Which Mongoose method populates referenced documents from another collection?',
        options: ['populate()', 'lookup()', 'join()', 'embed()'],
        correctAnswer: 0,
        explanation: 'Mongoose `populate()` replaces specified paths in documents with documents from other collections.',
        difficulty: 'medium'
      },
      // JWT Authentication
      {
        skillId: jwtAuth._id,
        question: 'Which standard HTTP header is typically used to send a JWT token in client requests?',
        options: ['Content-Type', 'Authorization', 'Accept-Encoding', 'X-Token-Id'],
        correctAnswer: 1,
        explanation: 'JWT tokens are passed in the `Authorization` header using the `Bearer <token>` scheme.',
        difficulty: 'easy'
      }
    ];

    await QuizQuestion.insertMany(questions);

    console.log('Seeding Demo Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@engipath.com',
      passwordHash: adminPassword,
      role: 'admin',
      branch: 'Computer Science',
      year: 'Graduated'
    });

    const demoStudent = await User.create({
      name: 'Alex Rivera',
      email: 'student@engipath.com',
      passwordHash: studentPassword,
      role: 'student',
      branch: 'Computer Science',
      year: '3rd Year',
      targetCareer: fullStackCareer._id,
      weeklyStudyHours: 12,
      learningPreference: 'hands-on',
      skills: [
        { skillId: htmlCss._id, level: 'advanced', score: 85, status: 'Known' },
        { skillId: jsFund._id, level: 'intermediate', score: 65, status: 'Developing' }
      ]
    });

    // Seed Progress for demo student
    await Progress.create({
      userId: demoStudent._id,
      skillId: htmlCss._id,
      status: 'completed',
      completedAt: new Date()
    });

    await Progress.create({
      userId: demoStudent._id,
      skillId: jsFund._id,
      status: 'in-progress',
      completedAt: null
    });

    console.log('--- SEED COMPLETED SUCCESSFULLY ---');
    console.log(`Admin Account: admin@engipath.com / admin123`);
    console.log(`Student Account: student@engipath.com / student123`);

    process.exit(0);
  } catch (error) {
    console.error('Seed process failed:', error);
    process.exit(1);
  }
};

seedData();
