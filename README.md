# Canvas XP 🎓⚡

### Gamifying the Canvas Learning Experience

Canvas XP is a student engagement platform designed to make completing assignments more interactive and rewarding. By combining Canvas LMS integration with a points-based reward system, Canvas XP encourages students to stay organized, complete assignments on time, and earn virtual rewards for their academic progress.

The project includes a web application, a Chrome browser extension, and a Supabase database structure. Together, these components are intended to provide students with assignment tracking, experience points (XP), customizable profiles, and a virtual item store.

**Project Status:** In Development

**GitHub Repository:** https://github.com/Nicosmith43/canvas-xp

---

## Project Purpose

The purpose of Canvas XP is to improve student motivation and engagement by introducing gamification into the academic experience.

Traditional learning management systems focus primarily on assignments, deadlines, and grades. Canvas XP builds on this experience by allowing students to earn virtual points for completing academic tasks and use those points to unlock rewards.

The project is designed to encourage positive academic habits without affecting students' actual grades.

### Project Goals

- Encourage students to complete assignments before their deadlines.
- Help students stay organized by tracking upcoming assignments.
- Reward consistent academic participation through an XP system.
- Provide customizable avatars, themes, and virtual items.
- Create an engaging and user-friendly student dashboard.
- Integrate securely with Canvas LMS.
- Protect student information and maintain academic privacy.

---

## Key Features

### 1. Student Dashboard

Canvas XP includes a student dashboard that provides an overview of academic rewards and progress.

The current dashboard displays:

- **Current XP:** Total experience points earned.
- **Student Rank:** A ranking representing student progress.
- **Items Owned:** Number of virtual items collected.
- **Recent Activity:** A section intended to display XP transactions and assignment-related activity.

The dashboard currently uses sample values while database integration and XP tracking functionality are being developed.

### 2. Canvas Assignment Tracking

The project includes a Chrome browser extension that retrieves upcoming assignment information directly from Canvas LMS.

The extension uses the Canvas API to retrieve assignment names and due dates from the authenticated student's Canvas session.

Current functionality includes:

- Retrieving upcoming assignments.
- Displaying assignment names and deadlines.
- Calculating the time remaining before each deadline.
- Identifying overdue assignments.
- Displaying the first six retrieved assignments in a floating widget.
- Using color-coded deadline indicators.

**Deadline Indicators:**

- Green: More than three days remaining.
- Yellow: Less than three days remaining.
- Orange: Less than 24 hours remaining.
- Red: Assignment is overdue.

The extension currently targets the University of Northern Colorado Canvas domain:

`https://unco.instructure.com/`

### 3. XP and Rewards System

Canvas XP is designed to reward students for completing assignments early or within an established submission window.

The planned XP system will:

- Award tokens for eligible assignment submissions.
- Track earned and spent XP.
- Maintain a history of transactions.
- Calculate balances from recorded transactions.
- Allow students to spend tokens on virtual rewards.

The database includes a `token_ledger` table designed to record positive and negative XP transactions.

The complete automated XP-awarding functionality is still under development.

### 4. Virtual Item Store

The web application includes an item store where students will eventually be able to redeem earned XP for customization options.

Planned rewards include:

- Profile avatars
- Custom themes
- Virtual accessories
- Additional personalization items

The current store interface displays sample products, prices, and purchase buttons.

Future development will connect the store to the database and implement actual purchases, inventory updates, and XP deductions.

### 5. Student Profile

Canvas XP includes a profile page where students can view account information and manage preferences.

The current interface includes:

- Student profile information
- Total XP and ranking
- Canvas LMS connection section
- Profile editing interface
- XP notification preference
- Leaderboard visibility preference

The Canvas connection and profile management features require additional backend functionality before they can be fully operational.

### 6. Canvas Customization

One of the long-term goals of Canvas XP is to allow students to personalize their Canvas experience using earned rewards.

Students will eventually be able to unlock and select themes or avatars that change supported visual elements.

These features are planned and are not yet fully implemented.

---

## Technologies Used

Canvas XP uses the following technologies:

| Technology | Purpose |
|---|---|
| React | Building the web application interface |
| JavaScript | Application logic and functionality |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Styling and responsive interface design |
| React Router | Navigation between application pages |
| Supabase | Database and authentication infrastructure |
| PostgreSQL | Relational database used by Supabase |
| Lucide React | Icons and visual interface elements |
| Chrome Extension Manifest V3 | Browser extension configuration |
| Canvas LMS API | Retrieving assignment information |
| Vercel | Web application deployment configuration |
| GitHub | Version control and project collaboration |

---

## Project Structure

The repository is organized into separate application, database, and documentation directories.

```text
canvas-xp/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── user_story.md
│   └── pull_request_template.md
│
├── apps/
│   ├── extension/
│   │   ├── content.js
│   │   └── manifest.json
│   │
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   └── Navbar.jsx
│       │   ├── lib/
│       │   │   └── supabase.js
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Profile.jsx
│       │   │   └── Store.jsx
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       │
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── postcss.config.js
│       ├── vite.config.js
│       └── vercel.json
│
├── docs/
│   ├── architecture.md
│   ├── privacy-security.md
│   └── user-stories.md
│
├── supabase/
│   └── migrations/
│       └── 20261019000000_initial_schema.sql
│
├── .gitignore
└── README.md
```

### Directory Descriptions

**apps/web/**

Contains the React frontend application, including the dashboard, item store, student profile, navigation components, and Supabase client configuration.

**apps/extension/**

Contains the Chrome extension that retrieves assignment information from Canvas LMS and displays upcoming deadlines.

**supabase/**

Contains the SQL migration used to create the project's database tables, relationships, and Row Level Security policies.

**docs/**

Contains project documentation describing the system architecture, user stories, privacy requirements, and security considerations.

**.github/**

Contains templates for reporting bugs, documenting user stories, and submitting pull requests.

---

## Installation and Setup

### Prerequisites

Before running Canvas XP locally, make sure you have:

- Node.js and npm installed.
- Git installed.
- A code editor such as Visual Studio Code.
- A modern web browser.
- A Supabase project for database-connected functionality.

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Nicosmith43/canvas-xp.git
```

Navigate into the project directory:

```bash
cd canvas-xp
```

### Step 2: Navigate to the Web Application

```bash
cd apps/web
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs the dependencies listed in the application's `package.json` file.

### Step 4: Configure Environment Variables

Create a `.env` file inside the `apps/web` directory.

Add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with the appropriate credentials from your Supabase project.

Do not commit sensitive credentials or private environment files to GitHub.

The current Supabase client requires these environment variables to initialize successfully.

### Step 5: Start the Development Server

Run:

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

Open that URL in your browser to view the application.

### Step 6: Build the Application

To generate a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Chrome Extension Setup

Canvas XP includes a Chrome extension for tracking assignment deadlines.

### Installation

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the `apps/extension` folder from the cloned repository.
6. Open the University of Northern Colorado Canvas website while signed in.

The extension is configured to run on:

`https://unco.instructure.com/*`

When the content script runs, it requests upcoming assignment information from the Canvas API and displays a floating deadline tracker.

### How the Extension Works

The extension requests data from the Canvas endpoint:

```text
/api/v1/users/self/todo
```

It extracts assignment titles and due dates, calculates the remaining time, and displays the information in a floating widget.

The current implementation reads assignment information from the student's active Canvas session.

It does not yet provide the complete OAuth-based account connection planned for the broader Canvas XP platform.

---

## Database Design

Canvas XP uses Supabase with a PostgreSQL database.

The initial database migration defines five primary tables.

### 1. profiles

Stores basic student account information, including:

- User ID
- Username
- Full name
- Avatar URL
- Last updated timestamp

### 2. canvas_connections

Stores information associated with a student's Canvas account connection.

Fields include:

- Connection ID
- User ID
- Canvas user ID
- Encrypted access token field
- Encrypted refresh token field
- Creation timestamp

### 3. store_items

Stores available virtual rewards.

Fields include:

- Item ID
- Item name
- Description
- XP price
- Item type
- Image URL

### 4. token_ledger

Records XP transactions.

Each transaction includes:

- Transaction ID
- Student ID
- XP amount
- Transaction reason
- Timestamp

Positive values represent XP earned, while negative values represent XP spent.

This design allows the application to calculate balances from transaction history rather than storing only a single changing balance.

### 5. user_inventory

Tracks items owned by students.

Fields include:

- Inventory ID
- Student ID
- Item ID
- Selection status
- Creation timestamp

The database migration also enables Row Level Security on all five tables and defines initial access policies.

Additional backend functionality and security review are required before production deployment.

---

## Application Routes

The React application currently contains three main routes.

| Route | Page | Description |
|---|---|---|
| `/` | Home | Student dashboard showing XP, rank, items, and activity section |
| `/store` | Store | Virtual rewards and customization item interface |
| `/profile` | Profile | Student account information, Canvas connection section, and settings |

Navigation between these pages is handled using React Router.

---

## Privacy and Security

Canvas XP is intended to operate without modifying students' grades or assignment submissions.

The project's security design includes:

- Read-only Canvas integration as the intended approach.
- Secure authentication and authorization.
- Row Level Security for student database records.
- Protected storage of Canvas connection credentials.
- Separation of frontend and backend responsibilities.
- Optional student participation.
- Student account disconnection and data removal as planned functionality.

Sensitive information such as Canvas client secrets, Supabase service-role keys, database passwords, and OAuth tokens must not be exposed in frontend code or committed to GitHub.

Before production deployment, the project will need approved Canvas API access, a secure OAuth implementation, and verified data protection policies.

---

## Current Development Status

Canvas XP is actively being developed.

### Implemented or Scaffolded

- [x] React web application structure
- [x] Navigation between Home, Store, and Profile
- [x] Student dashboard interface
- [x] Virtual store interface with sample items
- [x] Student profile interface
- [x] Chrome extension configuration
- [x] Canvas assignment due-date retrieval
- [x] Floating assignment deadline widget
- [x] Supabase database migration
- [x] Initial database security policies
- [x] GitHub issue and pull request templates

### In Progress / Planned

- [ ] Complete Canvas OAuth integration
- [ ] Connect student profiles to live database records
- [ ] Implement automatic XP awards
- [ ] Connect XP transaction history to the dashboard
- [ ] Implement virtual item purchases
- [ ] Track student-owned items
- [ ] Implement avatar and theme selection
- [ ] Apply unlocked customizations to Canvas
- [ ] Implement account disconnection and data deletion
- [ ] Replace sample dashboard values with real data
- [ ] Complete application testing and security review
- [ ] Conduct a student pilot

---

## Future Development

The long-term goal of Canvas XP is to create a complete gamified learning experience that integrates with Canvas LMS.

Future improvements may include:

**Automated XP Tracking**

Automatically evaluate eligible assignment submissions and award XP according to established rules.

**Expanded Virtual Store**

Introduce additional themes, avatars, and customization options.

**Achievements and Badges**

Reward students for milestones such as consistent early submissions or completing multiple assignments.

**Personalized Dashboard**

Provide students with more detailed information about their XP history, rewards, and academic progress.

**Improved Canvas Integration**

Support secure account connections and approved Canvas environments.

**Mobile-Friendly Experience**

Improve accessibility and usability across desktop and mobile devices.

---

## Contributing

Canvas XP is a collaborative development project, and team contributions are encouraged.

To contribute:

1. Clone the repository.
2. Create a new branch for your changes.
3. Implement your feature or bug fix.
4. Test your changes locally.
5. Commit your changes with a descriptive message.
6. Push your branch to GitHub.
7. Open a pull request for review.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

Contributors should use the existing GitHub issue templates to document bugs and user stories.

---

## Project Documentation

Additional information can be found in the repository's documentation directory.

- **architecture.md:** Database structure and system design decisions.
- **privacy-security.md:** Canvas integration requirements and security considerations.
- **user-stories.md:** Planned student functionality and user requirements.

---

## Project Vision

Canvas XP aims to make academic responsibility more engaging by turning everyday assignment completion into an opportunity for progress and rewards.

Through a combination of assignment tracking, experience points, virtual incentives, and personalization, the platform is intended to help students develop stronger academic habits while enjoying a more interactive Canvas experience.

As development continues, the team plans to expand the platform into a functional, secure, and student-friendly system that can be tested in a real academic environment.

---

**Canvas XP — Complete assignments. Earn XP. Unlock rewards.**
