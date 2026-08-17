const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CareerPath = require('../models/CareerPath');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const QuizQuestion = require('../models/QuizQuestion');
const Progress = require('../models/Progress');

const autoSeedIfEmpty = async () => {
  try {
    const questionCount = await QuizQuestion.countDocuments();
    if (questionCount >= 90) {
      console.log(`Database already populated (${questionCount} quiz questions found).`);
      return;
    }

    console.log('🌱 Populating database with 90 comprehensive technical quiz questions (10 per topic)...');
    
    // Clear old data if upgrading
    await QuizQuestion.deleteMany({});
    await Skill.deleteMany({});
    await CareerPath.deleteMany({});
    await Project.deleteMany({});

    // 1. Seed Skills DAG
    const htmlCss = await Skill.create({
      name: 'HTML & CSS',
      description: 'Foundations of web structure, semantic markup, CSS Flexbox/Grid, and responsive layout design.',
      category: 'Frontend',
      prerequisites: [],
      estimatedHours: 12,
      resources: [
        { title: 'MDN Web Docs - HTML & CSS', url: 'https://developer.mozilla.org', type: 'docs' },
        { title: 'FreeCodeCamp Responsive Web Design', url: 'https://www.freecodecamp.org', type: 'video' }
      ],
      miniTask: {
        title: 'Build a Responsive Component',
        description: 'Create a responsive pricing card using modern CSS Grid & Flexbox with hover transitions.',
        instructions: ['Use semantic section and article tags', 'Apply flexbox layout for price tags', 'Add CSS transitions on hover']
      }
    });

    const jsFund = await Skill.create({
      name: 'JavaScript Fundamentals',
      description: 'ES6+ syntax, functions, scopes, closures, DOM manipulation, promises, and fetch API.',
      category: 'Frontend',
      prerequisites: [htmlCss._id],
      estimatedHours: 20,
      resources: [
        { title: 'javascript.info - Modern JS', url: 'https://javascript.info', type: 'docs' },
        { title: 'JS Async & Promises Explained', url: 'https://youtube.com', type: 'video' }
      ],
      miniTask: {
        title: 'Interactive Fetch Widget',
        description: 'Fetch real-time weather data using Fetch API and render modern UI elements dynamically.',
        instructions: ['Use async/await with fetch', 'Handle loading and error UI states', 'Manipulate DOM elements safely']
      }
    });

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
        title: 'Initialize Git & Branching',
        description: 'Create a local repository, create a feature branch, resolve a merge conflict, and push to GitHub.',
        instructions: ['Initialize git repo', 'Create feature branch and make commits', 'Simulate merge conflict and resolve it']
      }
    });

    const reactFund = await Skill.create({
      name: 'React Fundamentals',
      description: 'JSX, Functional Components, Props, State management (useState, useEffect), and custom hooks.',
      category: 'Frontend',
      prerequisites: [jsFund._id],
      estimatedHours: 20,
      resources: [
        { title: 'Official React Documentation', url: 'https://react.dev', type: 'docs' },
        { title: 'React Masterclass Video', url: 'https://youtube.com', type: 'video' }
      ],
      miniTask: {
        title: 'Task Management SPA',
        description: 'Build a React app managing complex component state with filter tags and persistent storage.',
        instructions: ['Implement useState for task list', 'Use useEffect for localStorage persistence', 'Componentize UI into reusable cards']
      }
    });

    const nodeExpress = await Skill.create({
      name: 'Node.js & Express',
      description: 'Server-side JS execution, REST API routing, middleware execution, error handling, and JSON parsing.',
      category: 'Backend',
      prerequisites: [jsFund._id],
      estimatedHours: 18,
      resources: [
        { title: 'Express.js Guide', url: 'https://expressjs.com', type: 'docs' },
        { title: 'Node.js Event Loop Deep Dive', url: 'https://nodejs.org', type: 'docs' }
      ],
      miniTask: {
        title: 'Build RESTful Express API',
        description: 'Create Express routes handling GET, POST, PUT, DELETE requests with body validation.',
        instructions: ['Set up express router', 'Implement input validation middleware', 'Return standardized JSON error responses']
      }
    });

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
        title: 'Design Mongoose Schema',
        description: 'Design Mongoose schema with schema validation, custom virtuals, and populated subdocuments.',
        instructions: ['Create Mongoose model', 'Add validation rules for fields', 'Perform populated query with error handling']
      }
    });

    const jwtAuth = await Skill.create({
      name: 'JWT Authentication',
      description: 'Token-based authentication, password hashing with bcrypt, auth headers, and authorization middleware.',
      category: 'Security',
      prerequisites: [nodeExpress._id, mongoDB._id],
      estimatedHours: 10,
      resources: [
        { title: 'JWT.io Introduction', url: 'https://jwt.io', type: 'docs' },
        { title: 'Securing Web Applications with JWT', url: 'https://owasp.org', type: 'docs' }
      ],
      miniTask: {
        title: 'Auth & Role Protection Middleware',
        description: 'Implement JWT sign/verify logic with role-based authorization check middleware.',
        instructions: ['Hash passwords using bcryptjs', 'Sign JWT tokens upon login', 'Protect administrative endpoints with middleware']
      }
    });

    const dsaBasics = await Skill.create({
      name: 'DSA Basics',
      description: 'Arrays, Linked Lists, Stacks, Queues, Hash Tables, Sorting, Binary Search, and Big-O Time Complexity.',
      category: 'Core Engineering',
      prerequisites: [jsFund._id],
      estimatedHours: 20,
      resources: [
        { title: 'LeetCode Problem Set', url: 'https://leetcode.com', type: 'course' },
        { title: 'JavaScript Data Structures Guide', url: 'https://geeksforgeeks.org', type: 'docs' }
      ],
      miniTask: {
        title: 'Hash Map Lookup & Binary Search',
        description: 'Write optimized O(N) hash map lookup algorithm and O(log N) binary search function in JS.',
        instructions: ['Implement hash map search', 'Write binary search algorithm', 'Analyze time and space complexity']
      }
    });

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

    // 2. Seed Career Paths
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

    await CareerPath.create({
      name: 'Backend Systems Engineer',
      description: 'Specialize in server-side architecture, REST APIs, MongoDB data modeling, and security.',
      requiredSkills: [
        { skillId: jsFund._id, priority: 1, minimumLevel: 'intermediate' },
        { skillId: gitGithub._id, priority: 2, minimumLevel: 'beginner' },
        { skillId: nodeExpress._id, priority: 3, minimumLevel: 'advanced' },
        { skillId: mongoDB._id, priority: 4, minimumLevel: 'advanced' },
        { skillId: jwtAuth._id, priority: 5, minimumLevel: 'advanced' },
        { skillId: dsaBasics._id, priority: 6, minimumLevel: 'intermediate' }
      ]
    });

    await CareerPath.create({
      name: 'Frontend React Specialist',
      description: 'Focus on modern UI components, responsive web design, state management, and SPA architecture.',
      requiredSkills: [
        { skillId: htmlCss._id, priority: 1, minimumLevel: 'advanced' },
        { skillId: jsFund._id, priority: 2, minimumLevel: 'advanced' },
        { skillId: gitGithub._id, priority: 3, minimumLevel: 'beginner' },
        { skillId: reactFund._id, priority: 4, minimumLevel: 'advanced' },
        { skillId: mernCapstone._id, priority: 5, minimumLevel: 'intermediate' }
      ]
    });

    // 3. Seed Projects Ladder
    await Project.create({
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

    await Project.create({
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

    await Project.create({
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

    await Project.create({
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

    await Project.create({
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

    // 4. Seed 90 Comprehensive Technical Quiz Questions (10 per topic)
    const ninetyQuestions = [
      // TOPIC 1: HTML & CSS (10 questions)
      { skillId: htmlCss._id, question: 'Which CSS display property turns an element into a Flexbox container?', options: ['display: grid', 'display: flex', 'display: inline-block', 'display: table'], correctAnswer: 1, explanation: 'display: flex converts the container into a flex context for direct child elements.', difficulty: 'easy' },
      { skillId: htmlCss._id, question: 'Which HTML5 element represents an independent, self-contained article?', options: ['<section>', '<article>', '<aside>', '<div>'], correctAnswer: 1, explanation: '<article> specifies independent, self-contained content.', difficulty: 'easy' },
      { skillId: htmlCss._id, question: 'Which CSS property aligns Flexbox items along the main axis?', options: ['align-items', 'justify-content', 'align-content', 'flex-direction'], correctAnswer: 1, explanation: 'justify-content aligns items along the primary main axis.', difficulty: 'medium' },
      { skillId: htmlCss._id, question: 'What does the CSS `box-sizing: border-box` rule do?', options: ['Adds border outside padding', 'Includes padding and border in total width/height', 'Removes margins', 'Forces grid layout'], correctAnswer: 1, explanation: 'border-box includes padding and border in the element total calculated width.', difficulty: 'easy' },
      { skillId: htmlCss._id, question: 'Which CSS selector has the highest specificity rating?', options: ['Class selector (.btn)', 'Element selector (h1)', 'Inline style attribute', 'ID selector (#main)'], correctAnswer: 2, explanation: 'Inline style attributes (1000 pts) override ID selectors (100 pts) and class selectors (10 pts).', difficulty: 'hard' },
      { skillId: htmlCss._id, question: 'Which CSS property defines a 3-column equal grid layout?', options: ['grid-template-columns: repeat(3, 1fr)', 'flex-direction: 3-column', 'display: columns(3)', 'grid-columns: 3'], correctAnswer: 0, explanation: 'repeat(3, 1fr) creates three equal columns of 1 fraction each in CSS Grid.', difficulty: 'medium' },
      { skillId: htmlCss._id, question: 'Which media query targets screens narrower than 768px?', options: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media (device: 768px)', '@media screen and 768'], correctAnswer: 0, explanation: '@media (max-width: 768px) applies styles when viewport width is 768px or less.', difficulty: 'easy' },
      { skillId: htmlCss._id, question: 'An element with `position: absolute` is positioned relative to what?', options: ['The viewport always', 'Its nearest positioned ancestor', 'The body tag always', 'Its sibling element'], correctAnswer: 1, explanation: 'position: absolute anchors relative to its nearest ancestor with position relative/absolute/fixed.', difficulty: 'medium' },
      { skillId: htmlCss._id, question: 'Which HTML tag provides accessible alternative text for images?', options: ['title', 'alt', 'caption', 'description'], correctAnswer: 1, explanation: 'The alt attribute provides alternative text for screen readers and broken image fallbacks.', difficulty: 'easy' },
      { skillId: htmlCss._id, question: 'What CSS units are relative to the root html font-size?', options: ['em', 'rem', 'px', 'vw'], correctAnswer: 1, explanation: 'rem units are calculated relative to the root (<html>) font size.', difficulty: 'medium' },

      // TOPIC 2: JavaScript Fundamentals (10 questions)
      { skillId: jsFund._id, question: 'What is the evaluated output of `typeof null` in JavaScript?', options: ['"null"', '"undefined"', '"object"', '"number"'], correctAnswer: 2, explanation: 'typeof null returns "object" due to an early legacy JavaScript bug.', difficulty: 'easy' },
      { skillId: jsFund._id, question: 'Which method creates a new array by invoking a callback on every element?', options: ['forEach()', 'filter()', 'map()', 'reduce()'], correctAnswer: 2, explanation: 'map() creates a new transformed array without mutating the original array.', difficulty: 'easy' },
      { skillId: jsFund._id, question: 'What concept describes an inner function accessing variables from its outer enclosing scope?', options: ['Closure', 'Recursion', 'Hoisting', 'Polymorphism'], correctAnswer: 0, explanation: 'A closure is the combination of a function bundled together with references to its lexical environment.', difficulty: 'medium' },
      { skillId: jsFund._id, question: 'In the JavaScript Event Loop, which queue takes precedence for execution?', options: ['Macrotask Queue', 'Microtask Queue (Promises)', 'I/O Polling Queue', 'Timer Queue'], correctAnswer: 1, explanation: 'Microtasks (Promise callbacks, process.nextTick) execute immediately after the current script, before macrotasks.', difficulty: 'hard' },
      { skillId: jsFund._id, question: 'What error occurs when accessing a `let` variable before its initialization?', options: ['SyntaxError', 'ReferenceError (Temporal Dead Zone)', 'TypeError', 'URIError'], correctAnswer: 1, explanation: 'Accessing let/const variables in their Temporal Dead Zone throws a ReferenceError.', difficulty: 'medium' },
      { skillId: jsFund._id, question: 'Which operator checks both value equality and data type equality without coercion?', options: ['==', '===', '=', '!=  '], correctAnswer: 1, explanation: '=== performs strict equality without implicit type coercion.', difficulty: 'easy' },
      { skillId: jsFund._id, question: 'What is the return value of an `async` function in JavaScript?', options: ['The raw returned value', 'A Promise object', 'A callback function', 'undefined'], correctAnswer: 1, explanation: 'Async functions always implicitly wrap their return value in a Promise.', difficulty: 'medium' },
      { skillId: jsFund._id, question: 'Which Array method reduces an array down to a single accumulated output value?', options: ['reduce()', 'find()', 'some()', 'every()'], correctAnswer: 0, explanation: 'reduce() executes a reducer function on each element resulting in a single output value.', difficulty: 'medium' },
      { skillId: jsFund._id, question: 'How do Arrow functions handle the `this` keyword binding?', options: ['They bind `this` dynamically', 'They capture `this` lexically from parent scope', '`this` is always undefined', '`this` refers to window'], correctAnswer: 1, explanation: 'Arrow functions do not possess their own `this`; they inherit it lexically from enclosing scope.', difficulty: 'hard' },
      { skillId: jsFund._id, question: 'What feature allows unpacking values from arrays or properties from objects into distinct variables?', options: ['Destructuring', 'Spreading', 'Currying', 'Memoization'], correctAnswer: 0, explanation: 'Destructuring assignment syntax enables extracting data from arrays/objects into variables.', difficulty: 'easy' },

      // TOPIC 3: Git & GitHub (10 questions)
      { skillId: gitGithub._id, question: 'Which Git command creates a new branch and checks it out immediately?', options: ['git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git commit -b <name>'], correctAnswer: 1, explanation: 'git checkout -b <name> creates and switches to the new branch.', difficulty: 'easy' },
      { skillId: gitGithub._id, question: 'Which Git command saves uncommitted local changes to a temporary storage stack?', options: ['git stash', 'git save', 'git hold', 'git freeze'], correctAnswer: 0, explanation: 'git stash temporarily shelves uncommitted changes so you can work on something else.', difficulty: 'easy' },
      { skillId: gitGithub._id, question: 'What is the main difference between `git rebase` and `git merge`?', options: ['Rebase deletes history', 'Rebase rewrites commit history linearly; merge creates a merge commit', 'Merge is faster', 'Rebase only works locally'], correctAnswer: 1, explanation: 'Rebase reapplies commits on top of another base branch, creating a clean linear history.', difficulty: 'hard' },
      { skillId: gitGithub._id, question: 'Which command shows a simplified, single-line version of commit history?', options: ['git log --oneline', 'git history', 'git status -s', 'git show --short'], correctAnswer: 0, explanation: 'git log --oneline displays commit hash and commit message in a single line.', difficulty: 'medium' },
      { skillId: gitGithub._id, question: 'What file is used to specify intentionally untracked files that Git should ignore?', options: ['.gitconfig', '.gitignore', '.gitattributes', 'git.ignore'], correctAnswer: 1, explanation: '.gitignore tells Git which files or patterns to exclude from version control.', difficulty: 'easy' },
      { skillId: gitGithub._id, question: 'Which command applies the changes introduced by an existing commit from another branch?', options: ['git cherry-pick <commit-hash>', 'git apply <hash>', 'git fetch <hash>', 'git pull-commit <hash>'], correctAnswer: 0, explanation: 'git cherry-pick picks a specific commit from one branch and applies it to current branch.', difficulty: 'hard' },
      { skillId: gitGithub._id, question: 'What is the purpose of a GitHub Pull Request (PR)?', options: ['To download code to local PC', 'To propose changes and request review before merging into a target branch', 'To create a backup zip', 'To delete a remote branch'], correctAnswer: 1, explanation: 'A PR lets developers notify team members about completed features for code review.', difficulty: 'easy' },
      { skillId: gitGithub._id, question: 'Which command discards all uncommitted local modifications in the working directory?', options: ['git reset --hard', 'git clean -f', 'git revert', 'git checkout .'], correctAnswer: 0, explanation: 'git reset --hard resets index and working directory, discarding uncommitted changes.', difficulty: 'medium' },
      { skillId: gitGithub._id, question: 'Which command fetches updates from a remote repository and merges them into current branch?', options: ['git pull', 'git fetch', 'git clone', 'git push'], correctAnswer: 0, explanation: 'git pull runs git fetch followed automatically by git merge.', difficulty: 'easy' },
      { skillId: gitGithub._id, question: 'What GitHub mechanism makes a personal copy of another user project repository?', options: ['Forking', 'Cloning', 'Merging', 'Rebasing'], correctAnswer: 0, explanation: 'Forking creates a copy of a repository under your own GitHub account.', difficulty: 'medium' },

      // TOPIC 4: React Fundamentals (10 questions)
      { skillId: reactFund._id, question: 'Why must React state never be mutated directly (e.g., `state.val = 5`)?', options: ['It causes a syntax error', 'React relies on shallow state reference comparison to trigger re-renders', 'It corrupts memory', 'State is immutable string'], correctAnswer: 1, explanation: 'Direct state mutation bypasses React change detection and prevents UI re-rendering.', difficulty: 'medium' },
      { skillId: reactFund._id, question: 'Which Hook handles side effects (API calls, DOM updates) in React functional components?', options: ['useState', 'useContext', 'useEffect', 'useMemo'], correctAnswer: 2, explanation: 'useEffect performs side effects after component rendering.', difficulty: 'easy' },
      { skillId: reactFund._id, question: 'What is the purpose of the `key` prop when rendering lists in React?', options: ['Styles list items', 'Helps React identify which items have changed, added, or removed', 'Sets unique CSS class', 'Sorts array elements'], correctAnswer: 1, explanation: 'Keys give elements a stable identity for efficient Virtual DOM diffing.', difficulty: 'easy' },
      { skillId: reactFund._id, question: 'Which Hook memoizes calculated values between renders to optimize performance?', options: ['useMemo', 'useCallback', 'useRef', 'useReducer'], correctAnswer: 0, explanation: 'useMemo caches the result of a calculation between re-renders.', difficulty: 'medium' },
      { skillId: reactFund._id, question: 'Which Hook memoizes a callback function instance between renders?', options: ['useCallback', 'useMemo', 'useEffect', 'useState'], correctAnswer: 0, explanation: 'useCallback caches a function definition between renders.', difficulty: 'medium' },
      { skillId: reactFund._id, question: 'Which React Hook provides access to a mutable ref object that persists across renders without causing re-renders?', options: ['useRef', 'useState', 'useContext', 'useId'], correctAnswer: 0, explanation: 'useRef returns a mutable object whose .current property persists without triggering re-render.', difficulty: 'medium' },
      { skillId: reactFund._id, question: 'What feature solves the problem of "prop drilling" across deeply nested component trees?', options: ['React Context API / Redux', 'Higher Order Components', 'Portals', 'Fragments'], correctAnswer: 0, explanation: 'Context API passes data through component tree without manually passing props at every level.', difficulty: 'easy' },
      { skillId: reactFund._id, question: 'In `useEffect`, how do you register a cleanup function (e.g. to clear timers or subscriptions)?', options: ['Return a function from the useEffect callback', 'Pass cleanup as second argument', 'Call clear() inside useEffect', 'Use componentWillUnmount'], correctAnswer: 0, explanation: 'Returning a function from useEffect executes it when component unmounts or before re-running effect.', difficulty: 'hard' },
      { skillId: reactFund._id, question: 'What is the Virtual DOM in React?', options: ['A real HTML DOM copy', 'An in-memory lightweight JS object representation of the actual DOM', 'A browser extension', 'A server rendering engine'], correctAnswer: 1, explanation: 'The Virtual DOM is a JS representation of UI kept in memory and synced with real DOM via reconciliation.', difficulty: 'easy' },
      { skillId: reactFund._id, question: 'What naming convention MUST be followed when creating Custom React Hooks?', options: ['Must start with "use" (e.g. useFetch)', 'Must start with "React"', 'Must end with "Hook"', 'Capitalized names'], correctAnswer: 0, explanation: 'Custom hooks must start with "use" so React linter can enforce Hook rules.', difficulty: 'easy' },

      // TOPIC 5: Node.js & Express (10 questions)
      { skillId: nodeExpress._id, question: 'In Express middleware, what function must be called to pass control to the next handler?', options: ['res.send()', 'next()', 'res.json()', 'return true'], correctAnswer: 1, explanation: 'Invoking next() passes control to the next middleware function in stack.', difficulty: 'easy' },
      { skillId: nodeExpress._id, question: 'What architecture enables Node.js to handle thousands of concurrent connections efficiently?', options: ['Multi-threaded thread pool', 'Single-threaded Non-blocking Event Loop', 'Synchronous execution', 'Cluster fork only'], correctAnswer: 1, explanation: 'Node uses single-threaded non-blocking event-driven I/O loop for high concurrency.', difficulty: 'medium' },
      { skillId: nodeExpress._id, question: 'Which Express route parameter property accesses URL path parameters (e.g. `/users/:id`)?', options: ['req.params', 'req.query', 'req.body', 'req.headers'], correctAnswer: 0, explanation: 'req.params contains route parameters specified in the URL path pattern.', difficulty: 'easy' },
      { skillId: nodeExpress._id, question: 'Which middleware built into Express parses incoming requests with JSON payloads?', options: ['express.json()', 'express.urlencoded()', 'express.static()', 'body-parser-raw'], correctAnswer: 0, explanation: 'express.json() parses incoming JSON request bodies into req.body.', difficulty: 'easy' },
      { skillId: nodeExpress._id, question: 'What is the correct parameter signature for a centralized Express Error Handling middleware?', options: ['(err, req, res, next)', '(req, res, err)', '(req, res, next)', '(err, res)'], correctAnswer: 0, explanation: 'Express identifies error-handling middleware by accepting 4 arguments: (err, req, res, next).', difficulty: 'hard' },
      { skillId: nodeExpress._id, question: 'Which HTTP header handles Cross-Origin Resource Sharing (CORS)?', options: ['Access-Control-Allow-Origin', 'Content-Type', 'Authorization', 'X-Powered-By'], correctAnswer: 0, explanation: 'Access-Control-Allow-Origin dictates which origins can access backend API resources.', difficulty: 'medium' },
      { skillId: nodeExpress._id, question: 'How do you access environment variables loaded via `dotenv` in Node.js?', options: ['process.env.VARIABLE_NAME', 'env.get()', 'config.VARIABLE_NAME', 'global.env'], correctAnswer: 0, explanation: 'Node accesses environment variables on the process.env global object.', difficulty: 'easy' },
      { skillId: nodeExpress._id, question: 'Which core Node module provides asynchronous promise-based file system operations?', options: ['fs/promises', 'path', 'http', 'stream'], correctAnswer: 0, explanation: 'import fs from "fs/promises" provides promise-returning file system methods.', difficulty: 'medium' },
      { skillId: nodeExpress._id, question: 'Which Express class allows modularizing routes into separate mini-application files?', options: ['express.Router()', 'express.Application()', 'express.Module()', 'express.Path()'], correctAnswer: 0, explanation: 'express.Router creates modular, mountable route handlers.', difficulty: 'easy' },
      { skillId: nodeExpress._id, question: 'What happens if middleware does not call `next()` nor send a response?', options: ['It throws an immediate 500 error', 'The request hangs indefinitely until timeout', 'Express auto-closes request', 'The server restarts'], correctAnswer: 1, explanation: 'Without next() or res.end(), the client request is left hanging until browser timeout.', difficulty: 'medium' },

      // TOPIC 6: MongoDB & Mongoose (10 questions)
      { skillId: mongoDB._id, question: 'Which Mongoose method populates referenced documents from another collection?', options: ['populate()', 'lookup()', 'join()', 'embed()'], correctAnswer: 0, explanation: 'populate() replaces path references in documents with actual populated documents.', difficulty: 'easy' },
      { skillId: mongoDB._id, question: 'What is the primary storage unit in MongoDB collections?', options: ['BSON Documents', 'SQL Rows', 'CSV Lines', 'XML Tags'], correctAnswer: 0, explanation: 'MongoDB stores data records as BSON (Binary JSON) documents.', difficulty: 'easy' },
      { skillId: mongoDB._id, question: 'Why are indexes created on frequently queried fields in MongoDB?', options: ['To reduce disk space', 'To speed up query performance from O(N) scan to O(log N)', 'To format JSON output', 'To encrypt data'], correctAnswer: 1, explanation: 'Indexes allow MongoDB to locate documents without scanning every collection document.', difficulty: 'medium' },
      { skillId: mongoDB._id, question: 'Which option in `findOneAndUpdate()` returns the updated document instead of the original?', options: ['{ new: true }', '{ updated: true }', '{ returnNew: true }', '{ fetch: true }'], correctAnswer: 0, explanation: '{ new: true } instructs Mongoose to return the modified document.', difficulty: 'medium' },
      { skillId: mongoDB._id, question: 'Why is `user.markModified("skills")` required when mutating array items in Mongoose subdocuments?', options: ['To update timestamps', 'To inform Mongoose change tracking that an array element was modified in-place', 'To validate schemas', 'To clear index'], correctAnswer: 1, explanation: 'Mongoose cannot automatically detect deep in-place array element modifications without markModified.', difficulty: 'hard' },
      { skillId: mongoDB._id, question: 'What are Mongoose Virtuals?', options: ['Document properties that can be get/set but are not persisted to MongoDB', 'Remote database links', 'Encrypted fields', 'Temporary collections'], correctAnswer: 0, explanation: 'Virtuals are virtual fields that Mongoose computes dynamically without saving to DB.', difficulty: 'medium' },
      { skillId: mongoDB._id, question: 'Which MongoDB update operator replaces the value of a specified field?', options: ['$set', '$push', '$inc', '$put'], correctAnswer: 0, explanation: '$set updates specified field values in MongoDB documents.', difficulty: 'easy' },
      { skillId: mongoDB._id, question: 'What is the default unique primary key field name assigned by MongoDB to documents?', options: ['_id', 'id', 'uuid', 'pk'], correctAnswer: 0, explanation: 'MongoDB automatically generates a 12-byte BSON ObjectId stored in _id.', difficulty: 'easy' },
      { skillId: mongoDB._id, question: 'Which aggregation pipeline stage filters documents to pass only matching criteria?', options: ['$match', '$group', '$project', '$sort'], correctAnswer: 0, explanation: '$match filters documents similar to a find() query.', difficulty: 'medium' },
      { skillId: mongoDB._id, question: 'What schema option enforces that field values must be unique across a collection?', options: ['unique: true', 'primary: true', 'distinct: true', 'indexed: true'], correctAnswer: 0, explanation: 'unique: true creates a unique index ensuring no duplicate values exist.', difficulty: 'easy' },

      // TOPIC 7: JWT Authentication (10 questions)
      { skillId: jwtAuth._id, question: 'Which standard HTTP header format passes JWT tokens in REST API requests?', options: ['Authorization: Bearer <token>', 'Content-Type: application/jwt', 'X-Auth-Token: <token>', 'Cookie: token=<token>'], correctAnswer: 0, explanation: 'JWT is standardly sent in the Authorization header using Bearer scheme.', difficulty: 'easy' },
      { skillId: jwtAuth._id, question: 'What are the three parts of a JSON Web Token separated by dots?', options: ['Header, Payload, Signature', 'Key, Secret, Hash', 'User, Data, Token', 'Alg, Type, Key'], correctAnswer: 0, explanation: 'A JWT consists of Header (algorithm), Payload (claims), and Signature.', difficulty: 'easy' },
      { skillId: jwtAuth._id, question: 'Why should plain-text passwords never be saved in database records?', options: ['Increases storage size', 'Exposes credentials in case of a database breach; must be salted and hashed (bcrypt)', 'Fails JSON syntax', 'Slows down queries'], correctAnswer: 1, explanation: 'Passwords must be securely hashed with salt (bcrypt) to prevent exposure during breaches.', difficulty: 'easy' },
      { skillId: jwtAuth._id, question: 'What is a major architectural advantage of JWT token-based authentication?', options: ['It is completely unencrypted', 'It is stateless; servers verify signature without session DB lookups', 'It stores passwords on client', 'It removes CORS'], correctAnswer: 1, explanation: 'JWT payload is self-contained and cryptographically verified statelessly.', difficulty: 'medium' },
      { skillId: jwtAuth._id, question: 'Which `jsonwebtoken` library method verifies token authenticity and decodes claims?', options: ['jwt.verify(token, secret)', 'jwt.decode(token)', 'jwt.check(token)', 'jwt.parse(token)'], correctAnswer: 0, explanation: 'jwt.verify validates the token signature and expiration.', difficulty: 'easy' },
      { skillId: jwtAuth._id, question: 'Where is the most secure place to store JWT tokens on the browser client to prevent XSS attacks?', options: ['httpOnly, secure cookies', 'localStorage', 'sessionStorage', 'Global JS variables'], correctAnswer: 0, explanation: 'httpOnly cookies cannot be accessed by client-side JavaScript, protecting against XSS.', difficulty: 'hard' },
      { skillId: jwtAuth._id, question: 'What parameter sets JWT validity duration when signing tokens (e.g. `jwt.sign(...)`)?', options: ['expiresIn', 'duration', 'ttl', 'validUntil'], correctAnswer: 0, explanation: 'expiresIn configures token lifetime (e.g. "1d", "30d").', difficulty: 'easy' },
      { skillId: jwtAuth._id, question: 'What security approach restricts endpoint execution based on user roles (e.g. student vs admin)?', options: ['Role-Based Access Control (RBAC) middleware', 'Single Sign-On', 'Public CORS', 'Basic Auth'], correctAnswer: 0, explanation: 'RBAC middleware inspects user role claims before allowing route execution.', difficulty: 'medium' },
      { skillId: jwtAuth._id, question: 'What attack vector involves injecting malicious client scripts to read token from localStorage?', options: ['Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'SQL Injection', 'Man in the Middle'], correctAnswer: 0, explanation: 'XSS allows attackers to execute JS in victim browser and steal localStorage tokens.', difficulty: 'medium' },
      { skillId: jwtAuth._id, question: 'Why should sensitive data (like password hashes) NEVER be included in JWT payloads?', options: ['Payload is base64 encoded and publicly readable by anyone', 'Payload is deleted', 'Token becomes invalid', 'Server crashes'], correctAnswer: 0, explanation: 'JWT payload is readable by anyone who decodes the base64 string.', difficulty: 'hard' },

      // TOPIC 8: DSA Basics (10 questions)
      { skillId: dsaBasics._id, question: 'What is the Big-O Time Complexity of Binary Search on a sorted array?', options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'], correctAnswer: 1, explanation: 'Binary search halves the search space each step, achieving O(log N) time.', difficulty: 'easy' },
      { skillId: dsaBasics._id, question: 'What is the average time complexity for Hash Table lookup operations?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'], correctAnswer: 0, explanation: 'Hash tables offer average O(1) constant time lookups by hashing keys directly to indices.', difficulty: 'easy' },
      { skillId: dsaBasics._id, question: 'Which Data Structure operates on a Last-In, First-Out (LIFO) principle?', options: ['Stack', 'Queue', 'Array', 'Tree'], correctAnswer: 0, explanation: 'A Stack pushes and pops elements from top in LIFO order.', difficulty: 'easy' },
      { skillId: dsaBasics._id, question: 'Which Data Structure operates on a First-In, First-Out (FIFO) principle?', options: ['Queue', 'Stack', 'Heap', 'Graph'], correctAnswer: 0, explanation: 'A Queue enqueues at back and dequeues at front in FIFO order.', difficulty: 'easy' },
      { skillId: dsaBasics._id, question: 'What is the average time complexity of QuickSort?', options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'], correctAnswer: 0, explanation: 'QuickSort divides and conquers with an average O(N log N) performance.', difficulty: 'medium' },
      { skillId: dsaBasics._id, question: 'What memory layout advantage do Arrays have over Linked Lists?', options: ['Contiguous memory allocation for CPU cache friendliness', 'Dynamic sizing', 'O(1) insertion anywhere', 'No size limit'], correctAnswer: 0, explanation: 'Arrays occupy contiguous memory blocks, maximizing CPU cache locality.', difficulty: 'medium' },
      { skillId: dsaBasics._id, question: 'In a Singly Linked List, what reference does each node contain?', options: ['Pointer to next node only', 'Pointers to next and previous nodes', 'Array index', 'Parent node pointer'], correctAnswer: 0, explanation: 'Singly linked nodes contain data and a pointer to the next node.', difficulty: 'easy' },
      { skillId: dsaBasics._id, question: 'Which algorithmic pattern uses two pointers moving from opposite ends toward center?', options: ['Two Pointer Technique', 'Sliding Window', 'Dynamic Programming', 'Greedy Choice'], correctAnswer: 0, explanation: 'Two Pointers efficiently solves array/string palindrome and pair sum problems in O(N).', difficulty: 'medium' },
      { skillId: dsaBasics._id, question: 'Which graph traversal algorithm uses a Queue to visit nodes level-by-level?', options: ['Breadth First Search (BFS)', 'Depth First Search (DFS)', 'Dijkstra Algorithm', 'Kruskal Algorithm'], correctAnswer: 0, explanation: 'BFS uses a Queue to explore neighbors level by level.', difficulty: 'medium' },
      { skillId: dsaBasics._id, question: 'Which graph traversal algorithm uses a Stack or Recursion to explore deep paths first?', options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Binary Search', 'Radix Sort'], correctAnswer: 0, explanation: 'DFS uses stack/recursion to travel as deep as possible down each branch before backtracking.', difficulty: 'medium' },

      // TOPIC 9: MERN Capstone (10 questions)
      { skillId: mernCapstone._id, question: 'What is the end-to-end data flow order in a full-stack MERN application request?', options: ['React UI -> Axios -> Express Router -> Controller -> Mongoose Model -> MongoDB', 'MongoDB -> React -> Node', 'Express -> React -> Mongoose', 'Vite -> MongoDB -> Express'], correctAnswer: 0, explanation: 'Requests flow from React frontend via HTTP to Express server controllers, querying MongoDB via Mongoose.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'Why is a development proxy configured in `vite.config.js` (`/api` -> `http://localhost:5000`)?', options: ['Prevents CORS errors during local development', 'Speeds up database queries', 'Encrypted passwords', 'Minifies bundle'], correctAnswer: 0, explanation: 'Vite proxy forwards API requests to backend port 5000 without origin mismatch CORS issues.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'How is JWT authentication state shared globally across React pages?', options: ['React AuthContext Provider', 'Global window variable', 'Cookie script injection', 'CSS variables'], correctAnswer: 0, explanation: 'AuthContext provides user authentication state and login/logout methods across component tree.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'Which Axios feature automatically attaches `Authorization: Bearer <token>` to outgoing requests?', options: ['Axios Request Interceptor', 'Axios Reducer', 'Axios Middleware', 'Vite Plugin'], correctAnswer: 0, explanation: 'Request interceptors inspect requests and inject authorization headers before dispatching.', difficulty: 'medium' },
      { skillId: mernCapstone._id, question: 'How do Protected Routes in React Router v6 redirect unauthenticated users to `/login`?', options: ['By rendering `<Navigate to="/login" replace />` when user state is null', 'By window.close()', 'By throwing 404', 'By HTML meta refresh'], correctAnswer: 0, explanation: 'Protected route wrapper components check user state and render Navigate component if unauthenticated.', difficulty: 'medium' },
      { skillId: mernCapstone._id, question: 'What file holds sensitive production credentials like MONGO_URI and JWT_SECRET?', options: ['.env', 'package.json', 'index.html', 'main.jsx'], correctAnswer: 0, explanation: '.env stores secrets locally and is excluded from version control via .gitignore.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'What build tool compiles React Vite JSX code into production-ready static assets?', options: ['vite build (esbuild / rollup)', 'npm start', 'node server.js', 'mongoose CLI'], correctAnswer: 0, explanation: 'vite build bundles, minifies, and compiles JSX into dist/ production files.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'What is a best practice JSON response structure for MERN REST APIs?', options: ['{ success: true/false, message: "...", data/user: ... }', 'Raw text string', 'HTML template string', 'XML document'], correctAnswer: 0, explanation: 'Standardized JSON objects with success flags provide predictable client parsing.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'How should API loading states be handled in React UI components?', options: ['Set loading state true before API call, then false in finally block', 'Never show loading spinner', 'Block browser window', 'Use synchronous alerts'], correctAnswer: 0, explanation: 'Setting loading true before async call and false in finally block ensures smooth UX.', difficulty: 'easy' },
      { skillId: mernCapstone._id, question: 'How is full-stack monorepo code organized cleanly?', options: ['Separate /client (React) and /server (Express/MongoDB) directories with distinct package.json files', 'All files in root folder', 'Put backend inside public/', 'Mix React components in Express controller files'], correctAnswer: 0, explanation: 'Separating frontend (/client) and backend (/server) maintains modular separation of concerns.', difficulty: 'easy' }
    ];

    await QuizQuestion.insertMany(ninetyQuestions);

    // 5. Seed Demo Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    await User.create({
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

    console.log('🎉 90 Technical Quiz Questions (10 per topic) Successfully Populated!');
  } catch (error) {
    console.error('Auto seed error:', error.message);
  }
};

module.exports = autoSeedIfEmpty;
