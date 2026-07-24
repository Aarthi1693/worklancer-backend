--
-- PostgreSQL database dump
--

\restrict kc0qJyKQLqqjLGQNdVyM034WmrvTmYijUrcolDO6pPV51DuIKHsfax0h48jsGp3

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2026-07-24 13:24:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 882 (class 1247 OID 25807)
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'APPLICATION',
    'CHAT',
    'PAYMENT',
    'PROJECT',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- TOC entry 891 (class 1247 OID 27750)
-- Name: PlanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PlanStatus" AS ENUM (
    'ACTIVE',
    'ARCHIVED',
    'IN_PROGRESS'
);


ALTER TYPE public."PlanStatus" OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 16681)
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'REVIEW',
    'COMPLETED'
);


ALTER TYPE public."ProjectStatus" OWNER TO postgres;

--
-- TOC entry 852 (class 1247 OID 16410)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'PROVIDER',
    'MASTER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 24893)
-- Name: SubmissionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubmissionStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'PENDING_REVIEW',
    'REVISION_REQUIRED'
);


ALTER TYPE public."SubmissionStatus" OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 25075)
-- Name: TaskType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskType" AS ENUM (
    'DIGITAL',
    'FIELD'
);


ALTER TYPE public."TaskType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 27730)
-- Name: AIProjectPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIProjectPlan" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text,
    "projectType" text,
    budget double precision,
    deadline timestamp(3) without time zone,
    "requiredSkills" text,
    "teamSize" integer,
    priority text,
    "planData" jsonb NOT NULL,
    "userId" text NOT NULL,
    "projectId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."PlanStatus" DEFAULT 'ACTIVE'::public."PlanStatus" NOT NULL
);


ALTER TABLE public."AIProjectPlan" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16564)
-- Name: Application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Application" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL,
    "matchScore" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Application" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25252)
-- Name: Conversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Conversation" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "providerId" text NOT NULL,
    "masterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Conversation" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25260)
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25817)
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 33661)
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "submissionId" text NOT NULL,
    "projectId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "releasedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16499)
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    budget double precision NOT NULL,
    "requiredSkills" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."ProjectStatus" DEFAULT 'OPEN'::public."ProjectStatus" NOT NULL,
    "taskType" public."TaskType" DEFAULT 'DIGITAL'::public."TaskType" NOT NULL,
    "providerId" text NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24899)
-- Name: Submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Submission" (
    id text NOT NULL,
    "applicationId" text NOT NULL,
    "githubLink" text,
    "deploymentLink" text,
    description text NOT NULL,
    status public."SubmissionStatus" DEFAULT 'PENDING'::public."SubmissionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completionDate" timestamp(3) without time zone,
    "imageUrls" text,
    location text,
    "reportFile" text,
    feedback text,
    "approvedAt" timestamp(3) without time zone,
    "reviewedAt" timestamp(3) without time zone,
    "reviewedBy" text
);


ALTER TABLE public."Submission" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16417)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" NOT NULL,
    skills text,
    experience integer,
    rating double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone,
    "kycAddress" text,
    "kycCity" text,
    "kycDob" text,
    "kycGender" text,
    "kycIdPhoto" text,
    "kycPanCard" text,
    "kycPhone" text,
    "kycPincode" text,
    "kycProfilePhoto" text,
    "kycScore" integer,
    "kycSelfie" text,
    "kycState" text,
    "kycStatus" text DEFAULT 'NOT_STARTED'::text,
    "kycVerificationReport" jsonb,
    "kycVerifiedAt" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 27730)
-- Dependencies: 223
-- Data for Name: AIProjectPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIProjectPlan" (id, title, description, category, "projectType", budget, deadline, "requiredSkills", "teamSize", priority, "planData", "userId", "projectId", "createdAt", "updatedAt", status) FROM stdin;
628dd7a8-0bc5-48dc-9975-16b85c4175c4	health care	monitor health like heart beat steps, calories etc	Mobile App	Digital	5000	2026-09-12 00:00:00	react	3	Medium	{"roles": [{"role": "Lead Mobile Developer / Project Coordinator", "responsibility": "Responsible for overall project architecture, React Native core development, integration with health APIs, technical leadership, and coordination of development tasks. Acts as the primary point of contact for project progress."}, {"role": "Frontend Developer / UI-UX Assistant", "responsibility": "Focuses on implementing the user interface based on design guidelines, developing reusable React Native components, ensuring responsiveness and cross-platform compatibility, and assisting with UI/UX refinement."}, {"role": "Integrations & QA Specialist", "responsibility": "Manages integration with external health platforms (e.g., Google Fit, Apple Health), handles sensor data acquisition, conducts comprehensive testing (unit, integration, functional), identifies bugs, and ensures overall application quality and performance."}], "roadmap": [{"phase": "Phase 1: Planning & Discovery (MVP Focus)", "tasks": ["Define precise MVP scope for health metrics (steps, calories via phone sensors/health kits; heart rate via manual input/basic integration if feasible).", "Conduct user story mapping for core functionalities.", "Research and select core technical stack (React Native, state management, local storage solution).", "Set up project repository and initial development environment.", "Perform basic wireframing for key user flows."], "duration": "2 weeks"}, {"phase": "Phase 2: Lean Design & Architecture", "tasks": ["Develop high-level application architecture focusing on modularity and extensibility for future updates.", "Design minimalist UI/UX based on wireframes, adhering to React Native best practices.", "Plan data flow for health metric collection (e.g., Google Fit/Apple Health integration, local storage).", "Outline component structure and API integration strategy (if external APIs used)."], "duration": "3 weeks"}, {"phase": "Phase 3: Core Development & Integration", "tasks": ["Set up React Native project, navigation, and state management.", "Implement user authentication (if in scope, otherwise basic user profile).", "Develop modules for tracking steps and calories (integrating with phone sensors/Google Fit/Apple Health).", "Implement module for heart rate input/display (start with manual input).", "Build UI components for data display (dashboards, charts).", "Ensure persistent local storage for health data.", "Conduct regular code reviews and enforce coding standards."], "duration": "12 weeks"}, {"phase": "Phase 4: Testing & Quality Assurance", "tasks": ["Perform unit testing for individual components and functions.", "Conduct integration testing to ensure seamless data flow and API interactions.", "Execute manual functional testing across target devices/emulators.", "Perform user acceptance testing (UAT) with a small group of internal stakeholders.", "Address and resolve identified bugs and performance issues.", "Basic security review of data storage and access."], "duration": "4 weeks"}, {"phase": "Phase 5: Deployment Preparation & Launch", "tasks": ["Prepare app store listings (Google Play Store, Apple App Store) including screenshots, descriptions, and privacy policy.", "Generate final release builds for Android and iOS.", "Submit app to app stores for review.", "Monitor app store review process and address any feedback promptly."], "duration": "2 weeks"}, {"phase": "Phase 6: Post-Launch Monitoring & Feedback", "tasks": ["Monitor app performance, crash reports, and user engagement metrics.", "Gather initial user feedback through app store reviews and direct channels.", "Identify and prioritize minor bug fixes and immediate improvements.", "Plan for future feature enhancements and next iteration based on user feedback and budget availability."], "duration": "4 weeks"}], "summary": "This project aims to develop a minimalist React Native mobile application for basic health monitoring, tracking metrics like heart rate, steps, and calories. Given the extremely tight budget and limited team size, the execution plan prioritizes a lean MVP, leveraging existing platform health kits and open-source tools to deliver core functionality by the specified deadline.", "timeline": "27 weeks total", "riskAnalysis": [{"risk": "Extremely Limited Budget (₹5000) affecting scope, quality, and resource availability.", "solution": "Strictly focus on a Minimum Viable Product (MVP) with core features only. Leverage open-source libraries, free developer accounts, and community resources. Prioritize features that can be implemented with minimal external cost. Assume team members are working pro-bono or as a learning exercise."}, {"risk": "Challenges with health data integration (different device APIs, data permissions, background tracking).", "solution": "Prioritize integration with major platform-level health kits (Google Fit/Apple Health) first. Clearly communicate data privacy requirements to users. Implement robust error handling for API calls. Start with simpler data collection methods (e.g., step counter from phone sensors) and iterate."}, {"risk": "Limited team size (3 members) impacting development velocity and specialization.", "solution": "Foster a culture of cross-functional learning and shared responsibilities. Clearly define individual ownership for specific modules to avoid bottlenecks. Implement agile methodologies for quick iterations and feedback loops. Focus on clear communication and daily stand-ups."}], "requiredSkills": ["React Native", "JavaScript (ES6+)", "Mobile UI/UX Design Principles", "API Integration (RESTful/Platform-specific health APIs)", "State Management (e.g., Context API, Redux)", "Local Data Storage (e.g., AsyncStorage, Realm, SQLite)", "Native Module Development (basic understanding for custom bridges if needed)", "Git Version Control", "Software Testing & Debugging"], "recommendations": ["Given the severe budget constraint, prioritize delivering a highly focused, bug-free MVP that proves the core value proposition (basic health metric tracking) before considering any advanced features or extensive backend infrastructure.", "Actively explore and leverage free open-source React Native libraries, components, and tools to minimize development costs and accelerate feature implementation. Avoid custom solutions where a robust open-source alternative exists.", "Proactively engage with platform health kits (Google Fit, Apple Health) from the early stages to understand their capabilities and limitations, as this will heavily influence the ease and cost of data acquisition and processing.", "Consider this project as a proof-of-concept or a learning opportunity for the team, as the provided budget is insufficient for commercial-grade app development and compensation for a team of 3 professionals."]}	09bbb5ff-b01d-4893-933e-70b610681365	\N	2026-07-21 05:37:09.604	2026-07-21 05:37:09.604	ACTIVE
fb6e5ba8-5709-4f87-94c7-4f66235ac034	Ai chat bot	chat assistant	Mobile App	Digital	2000	2026-08-12 00:00:00	react	2	Medium	{"roles": [{"role": "Full-stack Developer", "responsibility": "Lead technical architecture and development, focusing on React Native frontend, AI API integration, and any necessary backend components. Responsible for code quality, reviews, and overall system functionality."}, {"role": "UI/UX Designer & Junior Developer", "responsibility": "Design and implement user interface wireframes and mockups, contribute to React Native frontend development, assist with testing, documentation, and asset creation. Provide design input to ensure a user-friendly experience."}], "roadmap": [{"phase": "Phase 1: Planning & Discovery", "tasks": ["Define core features and user stories for MVP (text chat, basic AI responses)", "Conduct competitive analysis for mobile chat apps and AI assistants", "Confirm technology stack: React Native for mobile, select AI service/model (e.g., free tier API, open-source model)", "Budget allocation breakdown for minimal expenses (API calls, potential basic hosting)", "Initial project backlog creation"], "duration": "1 week"}, {"phase": "Phase 2: Design & Architecture", "tasks": ["Create basic UI/UX wireframes and mockups for chat interface", "Design mobile application architecture (component structure, data flow)", "Define API endpoints for chat communication and AI service integration", "Plan for minimal data storage (if any, e.g., local state, or simple cloud storage)", "Set up initial development environment and version control"], "duration": "2 weeks"}, {"phase": "Phase 3: Development", "tasks": ["Develop React Native frontend components (chat screen, input field, message display)", "Implement real-time chat functionality (if applicable, or simple request-response)", "Integrate chosen AI service/model API for generating responses", "Build basic user interaction logic and state management", "Develop any necessary backend proxy for AI calls or simple server logic (if required for budget/performance)"], "duration": "8 weeks"}, {"phase": "Phase 4: Testing & QA", "tasks": ["Conduct unit tests for individual components and functions", "Perform integration testing between frontend and AI API", "Execute user acceptance testing (UAT) with internal stakeholders/alpha users", "Identify and fix bugs, performance issues, and UI glitches", "Ensure basic security considerations are met"], "duration": "2 weeks"}, {"phase": "Phase 5: Deployment", "tasks": ["Prepare application for mobile store submission (App Store, Google Play Store)", "Generate app icons, screenshots, and write compelling store descriptions", "Handle necessary developer account setups and configurations", "Submit app for review process", "Configure any required backend infrastructure (e.g., serverless functions, free tier hosting)"], "duration": "1 week"}, {"phase": "Phase 6: Post-Launch & Iteration", "tasks": ["Monitor app performance, crash reports, and user feedback", "Gather basic analytics on usage patterns", "Plan for immediate bug fixes and minor improvements", "Begin outlining features for future iterations based on feedback and budget availability"], "duration": "Ongoing (initial 2 weeks focused)"}], "summary": "This project aims to develop a basic AI chat assistant as a mobile application using React Native. The plan outlines a 16-week execution timeline, from initial discovery to post-launch monitoring, emphasizing an MVP approach to accommodate the limited budget and two-person team. Key activities include streamlined design, core feature development, rigorous testing, and strategic AI integration to deliver a functional chat assistant.", "timeline": "16 weeks total (approx. 4 months)", "riskAnalysis": [{"risk": "Exceeding the ₹2000 budget for AI services, infrastructure, or developer tools.", "solution": "Strictly prioritize free/low-cost AI APIs (e.g., Hugging Face free tier, specific open-source models), utilize free cloud tiers for hosting, and leverage open-source libraries extensively. Limit feature scope to absolute essentials to minimize costs."}, {"risk": "Technical challenges with React Native development or complex AI integration.", "solution": "Allocate buffer time in development phase, leverage community resources (Stack Overflow, open-source documentation), conduct thorough architectural planning, and ensure continuous skill development. Focus on simpler AI models initially."}, {"risk": "Scope creep due to desire for advanced AI features or additional functionalities.", "solution": "Strictly adhere to the defined Minimum Viable Product (MVP) scope, clearly communicate what is in/out of scope to the team, and conduct regular progress reviews to ensure focus on core objectives."}, {"risk": "Limited team capacity impacting timely delivery and quality.", "solution": "Prioritize critical features, streamline development processes through efficient communication and task distribution. Maximize the use of reusable components and libraries to accelerate development."}], "requiredSkills": ["React Native", "JavaScript/TypeScript", "Mobile UI/UX Design", "API Integration (RESTful APIs)", "Basic Backend Development (e.g., Node.js/Python for simple API proxy)", "Problem Solving", "Version Control (Git)", "Cloud Platform Fundamentals (for cost-effective hosting)"], "recommendations": ["Start with a Minimum Viable Product (MVP) focusing solely on core text-based chat functionality and basic, predictable AI responses to ensure timely delivery within budget.", "Utilize highly cost-effective or free AI service APIs initially (e.g., open-source models hosted on free tiers, or simple rule-based systems) to stay within the extremely limited budget.", "Leverage open-source React Native components, UI libraries, and community support extensively to accelerate development and reduce the need for custom solutions.", "Implement a lean development process with frequent check-ins to quickly identify and address any roadblocks, ensuring efficient use of the small team's time.", "Prioritize mobile app performance and a smooth user experience from the outset, as this is crucial for initial user adoption despite limited features."]}	31abdf53-0840-4703-918c-a8cb6b81d84c	\N	2026-07-24 07:06:47.51	2026-07-24 07:06:47.51	ACTIVE
\.


--
-- TOC entry 4991 (class 0 OID 16564)
-- Dependencies: 218
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Application" (id, "userId", "projectId", "matchScore", status, "createdAt") FROM stdin;
aba82bc5-e662-4f78-81d8-18711085c8db	31abdf53-0840-4703-918c-a8cb6b81d84c	1d10a900-0ae0-4c8f-a670-36caba8cbe38	0	ACCEPTED	2026-07-19 09:09:25.347
ae8b654b-abc3-4152-ba67-ebf1d82c4c4b	31abdf53-0840-4703-918c-a8cb6b81d84c	752e86af-1f95-4e7c-8e97-45006eb26766	0	REJECTED	2026-07-08 06:58:56.177
fa0311c3-675b-469c-8653-9136d3399e79	31abdf53-0840-4703-918c-a8cb6b81d84c	dcb702fa-9047-45fc-901d-62c3ef9e8779	0	ACCEPTED	2026-07-08 07:52:33.816
013412ac-afaa-49cc-a5e3-fc162dc5ecec	31abdf53-0840-4703-918c-a8cb6b81d84c	752e86af-1f95-4e7c-8e97-45006eb26766	0	REJECTED	2026-07-08 07:15:10.984
992fdaf4-fdfa-44b8-9a53-82004bb9e57a	31abdf53-0840-4703-918c-a8cb6b81d84c	752e86af-1f95-4e7c-8e97-45006eb26766	0	REJECTED	2026-07-08 07:16:27.911
a4912e82-a1bd-40aa-9af8-56e33f8f5baa	31abdf53-0840-4703-918c-a8cb6b81d84c	9082bf2f-91e1-450b-94a2-fbd7d26103ff	0	ACCEPTED	2026-07-11 15:16:00.105
a39ffde0-e6f0-4d9f-83fe-c08a3cdda137	31abdf53-0840-4703-918c-a8cb6b81d84c	b0f23c67-922c-4efc-954f-4bdceef7f4c9	0	REJECTED	2026-07-11 15:29:49.064
69b5efb4-be5a-401d-826e-f03e5395bce9	31abdf53-0840-4703-918c-a8cb6b81d84c	b0f23c67-922c-4efc-954f-4bdceef7f4c9	0	REJECTED	2026-07-11 15:30:28.061
54764356-38ee-4678-940b-895ef8ff124d	715e8413-e5e2-48e6-9186-39b3a6c41e2a	3fbbd7b8-30fd-42c2-aa63-c15a6abc0311	33.33333333333333	REJECTED	2026-06-18 11:28:55.915
eb3768ce-ac6f-4558-a374-218adf05ced3	31abdf53-0840-4703-918c-a8cb6b81d84c	3fbbd7b8-30fd-42c2-aa63-c15a6abc0311	0	ACCEPTED	2026-07-11 15:32:23.509
7105995d-e82c-416e-821f-241bf49efa43	31abdf53-0840-4703-918c-a8cb6b81d84c	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	0	ACCEPTED	2026-07-11 16:16:49.142
03e7adfd-ccd0-485b-bf35-21b159fb992b	31abdf53-0840-4703-918c-a8cb6b81d84c	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	0	ACCEPTED	2026-07-11 16:43:26.722
32a410f1-15f2-43e8-bb1a-ed6513d9c41c	31abdf53-0840-4703-918c-a8cb6b81d84c	ffc9fa2c-d8c5-444c-9fa2-911462a915ba	0	ACCEPTED	2026-07-11 16:46:54.197
68626a3c-f610-40bc-a20a-0eb64bfc6799	09bbb5ff-b01d-4893-933e-70b610681365	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	0	PENDING	2026-07-14 13:32:03.854
c742909e-1f26-4553-bd21-f7447501156e	31abdf53-0840-4703-918c-a8cb6b81d84c	8109b0eb-ea71-4d7a-b47e-c97103f5a73d	0	ACCEPTED	2026-07-14 14:13:18.084
9bd583f0-53b9-44c8-9bd8-f113f271534b	31abdf53-0840-4703-918c-a8cb6b81d84c	e74c3dcb-f348-44db-96ff-d4b884f0ef59	0	ACCEPTED	2026-07-14 14:14:18.897
db0ac3ef-664a-4e98-b9e4-55b151f22051	31abdf53-0840-4703-918c-a8cb6b81d84c	9082bf2f-91e1-450b-94a2-fbd7d26103ff	0	ACCEPTED	2026-07-11 16:47:43.448
2d74bd36-136b-4480-ba10-646ef5afabf4	31abdf53-0840-4703-918c-a8cb6b81d84c	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	0	ACCEPTED	2026-07-11 16:32:52.143
2ca46af2-2a71-4cce-a347-61640323f0a3	31abdf53-0840-4703-918c-a8cb6b81d84c	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	0	ACCEPTED	2026-07-11 16:44:28.729
999a0dbf-d87c-4fd0-a0e6-3573f77d9be2	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	ACCEPTED	2026-07-18 15:23:48.702
00041653-30b2-4ed1-a1c0-0988190e3bda	31abdf53-0840-4703-918c-a8cb6b81d84c	1d10a900-0ae0-4c8f-a670-36caba8cbe38	0	PENDING	2026-07-19 09:09:30.83
f0ffa8ac-8584-4639-87e5-32310e91e8cb	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	ACCEPTED	2026-07-19 10:54:51.533
be7061e7-57bb-4581-8a56-7fd88e4379ba	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	ACCEPTED	2026-07-19 11:04:19.558
754c1b98-fb89-4109-8246-f1f4410fbe48	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	ACCEPTED	2026-07-19 12:09:46.964
9906a58d-cfdd-4ee3-b12a-5d2e23014f12	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	PENDING	2026-07-21 09:03:58.067
94741f0d-a434-44be-8aa1-ebc786c96023	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	PENDING	2026-07-21 14:22:59.839
04d79cce-30f2-427d-a780-c39b3d92d537	31abdf53-0840-4703-918c-a8cb6b81d84c	d80283e8-bf69-4b2a-9d78-631898090ef8	0	ACCEPTED	2026-07-19 12:48:28.775
13f7ecd6-5755-4cb5-9c14-553018b70e3b	31abdf53-0840-4703-918c-a8cb6b81d84c	ffc9fa2c-d8c5-444c-9fa2-911462a915ba	0	PENDING	2026-07-22 04:08:42.136
2a33492e-3f63-456d-bf60-296b3a747d09	31abdf53-0840-4703-918c-a8cb6b81d84c	ffc9fa2c-d8c5-444c-9fa2-911462a915ba	0	ACCEPTED	2026-07-14 14:12:49.108
1c8bef4b-363a-4c3c-bb3b-f983011d7690	31abdf53-0840-4703-918c-a8cb6b81d84c	cceef37a-0ff0-4e03-8150-7ac73cbf55d6	0	ACCEPTED	2026-07-22 16:32:37.187
8228850b-9562-4dd1-95f6-f7bab24ca206	31abdf53-0840-4703-918c-a8cb6b81d84c	9082bf2f-91e1-450b-94a2-fbd7d26103ff	0	ACCEPTED	2026-07-14 14:43:31.829
7875f0a3-8fca-4377-8fff-f9666734f522	f0f160cd-65de-4f88-b85a-77729bbd91bc	75d898c2-c888-4564-98e7-f6907d25a38a	0	ACCEPTED	2026-07-23 08:30:43.279
47173cdb-227c-45c8-b1ba-b928ba134ad6	31abdf53-0840-4703-918c-a8cb6b81d84c	75d898c2-c888-4564-98e7-f6907d25a38a	0	ACCEPTED	2026-07-23 09:58:10.056
\.


--
-- TOC entry 4993 (class 0 OID 25252)
-- Dependencies: 220
-- Data for Name: Conversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Conversation" (id, "projectId", "providerId", "masterId", "createdAt", "updatedAt") FROM stdin;
2ddb8e39-a02a-49df-b7e4-46093f90f6a7	dcb702fa-9047-45fc-901d-62c3ef9e8779	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-15 16:06:35.215	2026-07-15 16:06:35.215
f029a034-bf2c-448c-8d2e-65c4a969def4	9082bf2f-91e1-450b-94a2-fbd7d26103ff	31abdf53-0840-4703-918c-a8cb6b81d84c	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-17 15:16:18.959	2026-07-17 15:16:18.959
67442375-a946-4b72-82ee-6b63befc5387	e74c3dcb-f348-44db-96ff-d4b884f0ef59	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-18 06:35:14.756	2026-07-18 06:35:14.756
89563ba5-11c4-407d-aef5-af74fc889311	6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-18 08:03:17.925	2026-07-18 08:03:17.925
7e3887f0-414c-4331-abb5-3f335bc4a645	d80283e8-bf69-4b2a-9d78-631898090ef8	31abdf53-0840-4703-918c-a8cb6b81d84c	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-18 15:26:39.045	2026-07-18 15:26:39.045
54f365c2-99b9-44d5-a4e2-acd7cfce7612	d80283e8-bf69-4b2a-9d78-631898090ef8	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-19 10:54:00.376	2026-07-19 10:54:00.376
d1131e19-fd7e-4c93-b642-76f40147ae8d	1d10a900-0ae0-4c8f-a670-36caba8cbe38	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-19 10:54:20.444	2026-07-19 10:54:20.444
e2a586a5-7e24-4ffb-a81f-722d0bc24da8	ffc9fa2c-d8c5-444c-9fa2-911462a915ba	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-22 04:09:24.044	2026-07-22 04:09:24.044
ce330c1c-8f00-4c83-b332-11afb7d73b87	cceef37a-0ff0-4e03-8150-7ac73cbf55d6	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-22 16:33:01.398	2026-07-22 16:33:01.398
4efd0946-2048-4680-a15e-6e677a2a37b9	9082bf2f-91e1-450b-94a2-fbd7d26103ff	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	2026-07-23 08:31:53.72	2026-07-23 08:31:53.72
ca5c9a45-28ae-4098-9d24-719b9b95d8d8	75d898c2-c888-4564-98e7-f6907d25a38a	09bbb5ff-b01d-4893-933e-70b610681365	f0f160cd-65de-4f88-b85a-77729bbd91bc	2026-07-23 09:59:09.812	2026-07-23 09:59:09.812
\.


--
-- TOC entry 4994 (class 0 OID 25260)
-- Dependencies: 221
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "conversationId", "senderId", message, "isRead", "createdAt", "readAt") FROM stdin;
3d5c65dd-b634-4bf7-8ec5-4e1eb6f48434	2ddb8e39-a02a-49df-b7e4-46093f90f6a7	09bbb5ff-b01d-4893-933e-70b610681365	is my project completed	f	2026-07-15 16:45:42.681	\N
15773f83-60ee-46cf-a2e0-a2307e934d7b	2ddb8e39-a02a-49df-b7e4-46093f90f6a7	09bbb5ff-b01d-4893-933e-70b610681365	Hello Master 👋	f	2026-07-15 16:59:23.878	\N
80e801e4-287e-447e-bc9e-eb218f79749d	f029a034-bf2c-448c-8d2e-65c4a969def4	31abdf53-0840-4703-918c-a8cb6b81d84c	hii 	f	2026-07-17 15:16:24.7	\N
1537f803-00c7-40c6-be70-d977f705faa0	f029a034-bf2c-448c-8d2e-65c4a969def4	31abdf53-0840-4703-918c-a8cb6b81d84c	yes mam	f	2026-07-17 15:16:55.558	\N
2d665598-0087-4d5c-8bb8-017af42fd3c3	67442375-a946-4b72-82ee-6b63befc5387	09bbb5ff-b01d-4893-933e-70b610681365	hii master	f	2026-07-18 06:35:26.078	\N
a93616d7-1955-418b-9f6d-8eb69e91df23	67442375-a946-4b72-82ee-6b63befc5387	09bbb5ff-b01d-4893-933e-70b610681365	im the provider	f	2026-07-18 06:35:40.333	\N
e2fe84ea-0a57-472f-b621-b545089fd8be	67442375-a946-4b72-82ee-6b63befc5387	09bbb5ff-b01d-4893-933e-70b610681365	hello provider	f	2026-07-18 06:37:02.96	\N
e8d12f1a-fad7-459d-bd08-382a7b96674a	89563ba5-11c4-407d-aef5-af74fc889311	09bbb5ff-b01d-4893-933e-70b610681365	hii master	f	2026-07-18 08:03:25.067	\N
d6787b97-cda7-4c14-aa3f-9560d10f7cdf	89563ba5-11c4-407d-aef5-af74fc889311	31abdf53-0840-4703-918c-a8cb6b81d84c	hello provider	f	2026-07-18 08:03:44.673	\N
f48536e9-5ecc-462c-bf6e-787befb3ebad	7e3887f0-414c-4331-abb5-3f335bc4a645	31abdf53-0840-4703-918c-a8cb6b81d84c	hii master	f	2026-07-18 15:26:56.749	\N
b256cb30-6e8a-4ab0-86ea-369c063cf846	7e3887f0-414c-4331-abb5-3f335bc4a645	31abdf53-0840-4703-918c-a8cb6b81d84c	hello provider	f	2026-07-18 15:27:29.638	\N
d14ce626-7563-44d5-a00c-c7fe9705571f	89563ba5-11c4-407d-aef5-af74fc889311	09bbb5ff-b01d-4893-933e-70b610681365	test provider	f	2026-07-19 07:39:53.982	\N
0d0274f1-c985-4c16-9744-e47eccc42045	89563ba5-11c4-407d-aef5-af74fc889311	09bbb5ff-b01d-4893-933e-70b610681365	Test Provider 123	f	2026-07-19 07:42:11.403	\N
7b5d9fdc-2d8d-43ef-b04b-f6b27c3fc587	d1131e19-fd7e-4c93-b642-76f40147ae8d	09bbb5ff-b01d-4893-933e-70b610681365	hii master	f	2026-07-19 10:54:26.177	\N
bb1be683-c78f-4998-b7dc-73f35cb01ecb	d1131e19-fd7e-4c93-b642-76f40147ae8d	31abdf53-0840-4703-918c-a8cb6b81d84c	hello provider	f	2026-07-19 10:54:44.979	\N
17a1e9d8-5a77-45df-9516-8732c38a8bc5	d1131e19-fd7e-4c93-b642-76f40147ae8d	09bbb5ff-b01d-4893-933e-70b610681365	abcd check 1	f	2026-07-19 12:51:26.554	\N
d257f5a8-25e3-4f3d-bb82-1a5385e700da	d1131e19-fd7e-4c93-b642-76f40147ae8d	31abdf53-0840-4703-918c-a8cb6b81d84c	check success	f	2026-07-19 12:51:44.003	\N
e31cf4d0-ace8-459e-8d2a-10902f4466c5	54f365c2-99b9-44d5-a4e2-acd7cfce7612	31abdf53-0840-4703-918c-a8cb6b81d84c	hiii	f	2026-07-21 14:25:53.863	\N
2d6378b9-b1fe-43a2-8c00-654b69bd77cf	e2a586a5-7e24-4ffb-a81f-722d0bc24da8	09bbb5ff-b01d-4893-933e-70b610681365	hello master	f	2026-07-22 04:09:44.149	\N
40bba49f-e2b9-4761-ad1f-98bc7089cea7	e2a586a5-7e24-4ffb-a81f-722d0bc24da8	31abdf53-0840-4703-918c-a8cb6b81d84c	hello provider	f	2026-07-22 04:10:27.81	\N
26d535cc-39ed-479f-bdee-bf7b9b68a764	ce330c1c-8f00-4c83-b332-11afb7d73b87	09bbb5ff-b01d-4893-933e-70b610681365	hii i need and design	f	2026-07-22 16:33:13.545	\N
467c0bf6-ef7d-458b-bd63-5664ab8480af	ce330c1c-8f00-4c83-b332-11afb7d73b87	31abdf53-0840-4703-918c-a8cb6b81d84c	i will generate it	f	2026-07-22 16:33:49.978	\N
68ec61c3-6177-4d89-9ef9-3968f0b3b5d3	4efd0946-2048-4680-a15e-6e677a2a37b9	09bbb5ff-b01d-4893-933e-70b610681365	hii master	f	2026-07-23 08:32:01.72	\N
8c3ae92b-70ee-4c47-97da-0504907a44e9	ca5c9a45-28ae-4098-9d24-719b9b95d8d8	09bbb5ff-b01d-4893-933e-70b610681365	hii mnaster	f	2026-07-23 09:59:29.159	\N
\.


--
-- TOC entry 4995 (class 0 OID 25817)
-- Dependencies: 222
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", type, title, message, "isRead", "createdAt") FROM stdin;
d4fde0ad-5fa3-4a6e-9410-9451ea31b539	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hii master	t	2026-07-18 15:26:56.76
42ad74c8-0c7d-4621-ba32-88293e6b1fcb	09bbb5ff-b01d-4893-933e-70b610681365	CHAT	New Message	hello provider	f	2026-07-19 10:54:44.995
68d618b9-2e69-4162-a3a1-9f836da52ccc	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "project abcd".	f	2026-07-19 12:48:28.792
ce97c35d-25e8-45a6-a650-a03a471a5df7	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hello provider	t	2026-07-18 15:27:29.653
1cb7eeec-b442-471d-bbef-5a39171d02d3	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	Test Provider 123	t	2026-07-19 07:42:11.408
0f83bd1e-0b43-435c-8e79-7a6e1f027c82	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	test provider	t	2026-07-19 07:39:54.014
970a3e31-f64e-47b9-96aa-804a9731ff65	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "Hospital Management" has been accepted.	t	2026-07-19 10:54:17.337
8bc49b20-da1e-404e-a817-d2b13ba29f16	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hii master	t	2026-07-19 10:54:26.191
e44e8f1b-260b-4380-84b2-49fa012ff1d6	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "project abcd" has been accepted.	t	2026-07-19 12:49:59.931
152e3355-c711-46b8-9a5e-82236c90f182	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "project abcd" has been accepted.	t	2026-07-19 12:50:04.652
281ef2ab-b753-43e1-a1f4-28ca50e7f32a	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "project abcd" has been accepted.	t	2026-07-19 12:50:03.358
a793820f-5edc-4cd1-acda-7f8660734730	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "project abcd" has been accepted.	t	2026-07-18 15:24:24.993
d661cf40-bd2e-4134-98e6-96ba582f08c8	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	abcd check 1	f	2026-07-19 12:51:26.592
b37c7118-7c3d-465a-a4b9-487cf9d3a2c5	09bbb5ff-b01d-4893-933e-70b610681365	CHAT	New Message	check success	f	2026-07-19 12:51:44.01
a9f52992-8218-4881-bc17-4f62a9575a33	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "project abcd".	f	2026-07-21 09:03:58.102
63cd182c-df9f-4b3d-aae2-07f549bfbd12	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "project abcd".	f	2026-07-21 14:22:59.855
148cb8e7-a01c-4e82-a25a-7f0f474d37ae	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "project abcd" has been accepted.	f	2026-07-21 14:25:21.47
d0de7ff5-245e-4a32-9cfe-3379562f05f1	09bbb5ff-b01d-4893-933e-70b610681365	CHAT	New Message	hiii	f	2026-07-21 14:25:53.876
daea9021-9a90-4682-ac79-361e6622cd6d	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "ygv".	f	2026-07-22 04:08:42.284
1a32dc75-bc1e-4472-8fe1-74ec1db9e529	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "ygv" has been accepted.	f	2026-07-22 04:09:19.21
7ce9c9aa-c730-4a69-9a1e-860bdc253c21	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hello master	f	2026-07-22 04:09:44.167
b7cb8911-2684-405d-8a6e-855f6e478636	09bbb5ff-b01d-4893-933e-70b610681365	CHAT	New Message	hello provider	f	2026-07-22 04:10:27.83
07e916eb-8267-479c-9ca0-ddbd4338ee53	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-22 04:12:45.021
f8ba6ef7-0984-4655-a2cf-c8634041b998	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-22 05:26:19.466
2240299d-3349-4153-9ccc-bcae11fb338b	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-22 06:16:22.381
409a0218-f323-44de-8d29-51c0fec1ea1b	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "image design".	f	2026-07-22 16:32:37.209
13da329f-12f2-4149-adca-ba6d21313605	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "image design" has been accepted.	f	2026-07-22 16:32:59.362
0064ec34-b115-4735-a833-89ced90d5736	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hii i need and design	f	2026-07-22 16:33:13.569
6c881139-78ce-4801-b60c-f8b1c44f93a7	09bbb5ff-b01d-4893-933e-70b610681365	CHAT	New Message	i will generate it	f	2026-07-22 16:33:49.993
0bfd3f55-a235-4620-ba75-32b6c0555c64	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-22 16:35:09.628
a07d0358-b808-40e1-95fa-29c7b474d5e6	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarthivalavan applied to "image design".	f	2026-07-23 08:30:43.301
46d7c6ac-e82c-4849-9df5-bc2af6f092e8	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "promotion broucher" has been accepted.	f	2026-07-23 08:31:48.495
c9ecfe92-c48a-4804-850a-674e6dadd8c1	31abdf53-0840-4703-918c-a8cb6b81d84c	CHAT	New Message	hii master	f	2026-07-23 08:32:01.729
8931ae64-1724-4994-b35a-87da689c4e87	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-23 08:34:29.143
e1655c97-39dd-462a-8ab7-4c1121ad8307	09bbb5ff-b01d-4893-933e-70b610681365	APPLICATION	New Application	Aarth Master applied to "image design".	f	2026-07-23 09:58:10.143
f5f839e5-dbef-4ac7-9a43-59e2dfee69a6	f0f160cd-65de-4f88-b85a-77729bbd91bc	APPLICATION	Application Accepted	Your application for "image design" has been accepted.	f	2026-07-23 09:59:04.913
fc91ac71-b001-4431-82a8-bd07ed59626c	31abdf53-0840-4703-918c-a8cb6b81d84c	APPLICATION	Application Accepted	Your application for "image design" has been accepted.	f	2026-07-23 09:59:06.633
4609f9f8-b92c-4985-ba34-ea0b5452071e	f0f160cd-65de-4f88-b85a-77729bbd91bc	CHAT	New Message	hii mnaster	f	2026-07-23 09:59:29.178
70b7f1fb-3d0c-4087-a104-4fd9565baada	31abdf53-0840-4703-918c-a8cb6b81d84c	PROJECT	Submission Approved	Your submission has been approved by the provider.	f	2026-07-23 10:02:01.159
\.


--
-- TOC entry 4997 (class 0 OID 33661)
-- Dependencies: 224
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "submissionId", "projectId", "providerId", "userId", amount, status, "releasedAt", "createdAt", "updatedAt") FROM stdin;
afc9027c-bbf5-4220-a536-362c63ffc3ba	b1e3b734-4cd5-4d19-b44d-b2a94cb05c31	d80283e8-bf69-4b2a-9d78-631898090ef8	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	5000	RELEASED	2026-07-22 05:45:13.236	2026-07-22 05:26:19.492	2026-07-22 05:45:13.238
fbec4f31-cadf-4939-ad0f-0eb97b15903e	36287ada-098a-4ec5-8699-a89290a07d9f	d80283e8-bf69-4b2a-9d78-631898090ef8	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	5000	RELEASED	2026-07-22 06:16:29.273	2026-07-22 06:16:22.388	2026-07-22 06:16:29.275
0826be18-026d-46aa-bab6-9c4ec85fe643	863db0d7-e665-408c-b382-f98ccb052daf	cceef37a-0ff0-4e03-8150-7ac73cbf55d6	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	200	RELEASED	2026-07-22 16:35:13.876	2026-07-22 16:35:09.636	2026-07-22 16:35:13.879
23feead5-4ceb-44f4-b826-ef8939aee355	8878579b-e2a7-45a4-833a-a6265dd8a58e	1d10a900-0ae0-4c8f-a670-36caba8cbe38	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	25000	RELEASED	2026-07-23 08:34:35.449	2026-07-23 08:34:29.15	2026-07-23 08:34:35.45
cedb078e-4fc9-4d18-bf43-7dacfca91c7b	3f8694d6-cd7c-4499-b26d-6fbc317e6e8f	75d898c2-c888-4564-98e7-f6907d25a38a	09bbb5ff-b01d-4893-933e-70b610681365	31abdf53-0840-4703-918c-a8cb6b81d84c	500	RELEASED	2026-07-23 10:02:08.481	2026-07-23 10:02:01.17	2026-07-23 10:02:08.482
\.


--
-- TOC entry 4990 (class 0 OID 16499)
-- Dependencies: 217
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, title, description, budget, "requiredSkills", "createdAt", "updatedAt", status, "taskType", "providerId") FROM stdin;
752e86af-1f95-4e7c-8e97-45006eb26766	e-shopping app	create an application for online shopping with user friendly design and convenient usage 	10000	development skill, UI/UX skill, Frontend and backend knowledge	2026-07-03 14:58:03.161	2026-07-03 14:58:03.161	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
dcb702fa-9047-45fc-901d-62c3ef9e8779	Updated Hospital Management System	Updated project description	50000	React, Next.js, NestJS	2026-06-27 12:09:15.317	2026-07-05 16:43:41.34	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
3fbbd7b8-30fd-42c2-aa63-c15a6abc0311	E-Commerce wephase	Build a React + NestJS application	5500	React,NestJS,PostgreSQL	2026-06-17 13:34:43.403	2026-07-07 13:18:39.205	IN_PROGRESS	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
f6ceb78c-3a0a-4ca7-86d0-73b61f26a32c	website creation	create  an website for the  online shopping	50000	web creation and 	2026-07-10 16:06:24.835	2026-07-10 16:06:24.835	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
b0f23c67-922c-4efc-954f-4bdceef7f4c9	xyz project	asdfghjkl zxcvbnm qwertyuiop	1000	coding	2026-07-11 06:25:39.728	2026-07-11 06:25:39.728	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
9082bf2f-91e1-450b-94a2-fbd7d26103ff	promotion broucher	showroom promotion broucher with the details 	500	designing skill	2026-07-11 14:49:20.553	2026-07-11 14:49:20.553	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
ffc9fa2c-d8c5-444c-9fa2-911462a915ba	ygv	asdfghjkl qwertyuiop zxcvbnm,	1000	coding	2026-07-11 16:10:01.003	2026-07-11 16:10:01.003	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
6f9d3561-f7fa-451d-b0a0-f2d719d62c3e	asdfghjk	qwsdfvbnmxcfghuio dfvbnmkloiujh cvbhnjmkl\n\nPickup: asdfghjkl\n\nDrop: lkjhgfdsa	2000	Field Work	2026-07-11 16:10:35.447	2026-07-11 16:10:35.447	OPEN	FIELD	09bbb5ff-b01d-4893-933e-70b610681365
e74c3dcb-f348-44db-96ff-d4b884f0ef59	PG shifting	help to shift the pg by packing the thing and arranging in the new pg\n\nPickup: hms street ABC PG\n\nDrop: LKMA street RFT PG	1000	Field Work	2026-07-10 16:09:50.438	2026-07-14 16:06:32.671	COMPLETED	FIELD	09bbb5ff-b01d-4893-933e-70b610681365
8109b0eb-ea71-4d7a-b47e-c97103f5a73d	ekart	online shopping website	500	coding	2026-07-10 16:16:19.728	2026-07-14 16:16:03.482	COMPLETED	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
d80283e8-bf69-4b2a-9d78-631898090ef8	project abcd	asdfghjkl zxcvbnm, qwertyuiopdlknc  sjgvhovn sfnd,	5000	coding	2026-07-18 15:23:28.178	2026-07-22 06:16:29.277	COMPLETED	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
cceef37a-0ff0-4e03-8150-7ac73cbf55d6	image design	design the image	200	ui ux	2026-07-22 16:31:52.185	2026-07-22 16:35:13.887	COMPLETED	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
1d10a900-0ae0-4c8f-a670-36caba8cbe38	Hospital Management	Hospital Project	25000	React,NestJS	2026-07-03 14:38:40.888	2026-07-23 08:34:35.452	COMPLETED	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
da4fe5e1-ff96-47bd-ae7b-c7cf6109f6d5	health care	monitor health like heart beat steps, calories etc	5000	react	2026-07-23 08:57:27.9	2026-07-23 08:57:27.9	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
91a74a69-df71-42a4-9542-e1f21a23955c	website development	using react + tailwind	20000	react and tailwind	2026-07-23 08:59:34.064	2026-07-23 08:59:34.064	OPEN	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
75d898c2-c888-4564-98e7-f6907d25a38a	image design	design the imaghes	500	ui ux	2026-07-22 04:25:41.604	2026-07-23 10:02:08.488	COMPLETED	DIGITAL	09bbb5ff-b01d-4893-933e-70b610681365
\.


--
-- TOC entry 4992 (class 0 OID 24899)
-- Dependencies: 219
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Submission" (id, "applicationId", "githubLink", "deploymentLink", description, status, "createdAt", "updatedAt", "completionDate", "imageUrls", location, "reportFile", feedback, "approvedAt", "reviewedAt", "reviewedBy") FROM stdin;
42891241-4a25-4239-a8b8-30da98bbe957	9bd583f0-53b9-44c8-9bd8-f113f271534b	https://infyspringboard.onwingspan.com/web/en/page/home		asdfghjkl\n\nasdfghjkl qwertyuiop zxcvbnm, qwsdcvb  tyhb mkloiuhb gshrfkmnfghgn la;fgudjrfgkbbv	APPROVED	2026-07-14 15:16:52.273	2026-07-14 16:06:32.615	\N	\N	\N	\N	\N	\N	\N	\N
4ac04bef-70a0-4b2f-acb2-429cdf37bd98	c742909e-1f26-4553-bd21-f7447501156e	https://infyspringboard.onwingspan.com/web/en/page/home	https://infyspringboard.onwingspan.com/web/en/page/home	sdfghjkl xcvb nytrfdfb esrftfcv 	APPROVED	2026-07-14 16:09:37.99	2026-07-14 16:16:03.402	\N	\N	\N	\N	\N	\N	\N	\N
555cae74-7473-461a-8c5e-9d4aa0aaf071	32a410f1-15f2-43e8-bb1a-ed6513d9c41c	ocalhost:3000/master/submit-work	ocalhost:3000/master/submit-work	sdfghj cgkshzdj.whbd dzouvzh,bzsjfcvbairub xdbiej fjn	REJECTED	2026-07-14 16:27:26.818	2026-07-14 16:27:39.49	\N	\N	\N	\N	\N	\N	\N	\N
9cc70707-349c-47fc-a589-bc6ac9c42050	04d79cce-30f2-427d-a780-c39b3d92d537	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	asdfghjkl zxcvbnm scvbjkv yghb	PENDING	2026-07-21 14:26:46.697	2026-07-21 14:26:46.697	\N	\N	\N	\N	\N	\N	\N	\N
a4e96c4d-13a4-4648-9399-0f194297f48b	f0ffa8ac-8584-4639-87e5-32310e91e8cb	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	cfguhynti fkgetoy hguteiwerkj dbdiuyon jheitow c mgjohfb lskuhg lkhj	APPROVED	2026-07-22 04:11:20.279	2026-07-22 04:12:44.991	\N	\N	\N	\N	great work	2026-07-22 04:12:44.985	2026-07-22 04:12:44.985	09bbb5ff-b01d-4893-933e-70b610681365
b1e3b734-4cd5-4d19-b44d-b2a94cb05c31	be7061e7-57bb-4581-8a56-7fd88e4379ba	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	sadffy jtfgn  unm cgfcg vjyhgm vbcngukft vku5egfc gchjfxg	APPROVED	2026-07-21 15:24:40.521	2026-07-22 05:26:19.401	\N	\N	\N	\N	good job \n	2026-07-22 05:26:19.394	2026-07-22 05:26:19.394	09bbb5ff-b01d-4893-933e-70b610681365
36287ada-098a-4ec5-8699-a89290a07d9f	754c1b98-fb89-4109-8246-f1f4410fbe48	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	ghdjgldzkhb xvkjbhrip c,doisf[pc vcxmewutropjtyo vn.,[\nytpohdkngxjlkjtypk	APPROVED	2026-07-21 14:28:57.232	2026-07-22 06:16:22.356	\N	\N	\N	\N	good	2026-07-22 06:16:22.353	2026-07-22 06:16:22.353	09bbb5ff-b01d-4893-933e-70b610681365
863db0d7-e665-408c-b382-f98ccb052daf	1c8bef4b-363a-4c3c-bb3b-f983011d7690	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	design created as mentioned	APPROVED	2026-07-22 16:34:21.852	2026-07-22 16:35:09.609	\N	\N	\N	\N	perfect	2026-07-22 16:35:09.604	2026-07-22 16:35:09.604	09bbb5ff-b01d-4893-933e-70b610681365
8878579b-e2a7-45a4-833a-a6265dd8a58e	aba82bc5-e662-4f78-81d8-18711085c8db	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	gdjgibh hdfjhclnvkjn	APPROVED	2026-07-23 08:33:44.481	2026-07-23 08:34:29.125	\N	\N	\N	\N	good\n	2026-07-23 08:34:29.124	2026-07-23 08:34:29.124	09bbb5ff-b01d-4893-933e-70b610681365
3f8694d6-cd7c-4499-b26d-6fbc317e6e8f	47173cdb-227c-45c8-b1ba-b928ba134ad6	http://localhost:3000/master/submit-work	http://localhost:3000/master/submit-work	gooj 	APPROVED	2026-07-23 10:01:01.147	2026-07-23 10:02:01.135	\N	\N	\N	\N	good job\n	2026-07-23 10:02:01.13	2026-07-23 10:02:01.13	09bbb5ff-b01d-4893-933e-70b610681365
\.


--
-- TOC entry 4989 (class 0 OID 16417)
-- Dependencies: 216
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, skills, experience, rating, "createdAt", "updatedAt", "resetToken", "resetTokenExpiry", "kycAddress", "kycCity", "kycDob", "kycGender", "kycIdPhoto", "kycPanCard", "kycPhone", "kycPincode", "kycProfilePhoto", "kycScore", "kycSelfie", "kycState", "kycStatus", "kycVerificationReport", "kycVerifiedAt") FROM stdin;
cb56599e-19a5-4a77-bdf3-d3426d243c4f	Rahul	rahul@example.com	$2b$10$JKK5WogUDT1RWD/T4wgcueW1QJBo7.ceCirSnguLAOdH6Yb2rlKoK	MASTER	React, Node.js	3	0	2026-06-16 08:53:59.571	2026-06-16 08:53:59.571	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
fb4b2b70-cfa2-442e-bf3a-c8d61ce5ec5f	Rahul	rahul@gmail.com	$2b$10$awQkjy7XxVk.K.BLq3C7FexVUoan3ekUZ996Et2zb9sUAQYSmx4H.	MASTER	\N	\N	0	2026-06-27 11:57:00.737	2026-06-27 11:57:00.737	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
244ce574-406e-4820-aa59-8e29ba187a8a	Anjali	anjali@gmail.com	$2b$10$oZytNUeBlTNLxzORFQ/19uJZazMl/s2Sgw3Lsffazgp.JXtTTF.i.	PROVIDER	\N	\N	0	2026-06-27 12:06:18.496	2026-06-27 12:06:18.496	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
fee9524f-6c9d-4de6-8e2e-52289e3b55f1	John	john@gmail.com	123456	MASTER	React,NestJS,Node	3	0	2026-06-27 12:07:23.203	2026-06-27 12:07:23.203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
dad4ebcf-1b3e-4c69-8e21-99d9e0c62c85	Aarthi	aarthi@gmail.com	$2b$10$QBv9KYxZStCD1mJxIqMjOeQcITl15waNmYQPHblRd2CW/W1I.MdR2	PROVIDER	React,NestJS	2	0	2026-06-27 12:49:41.809	2026-06-27 12:49:41.809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
ce73303d-b022-4f63-819c-9c8dd585bc53	Aarthi	aarthi12@gmail.com	$2b$10$AmYy7izYqjHT8Q0o37MlSeaeS5yvLGZiyOu3SATo98Y6GpQahpW5i	PROVIDER	React,NestJS	2	0	2026-06-27 12:55:37.458	2026-06-27 12:55:37.458	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
72f662ce-8b76-4f9f-9958-39679b246f92	Rahul	rahul@test.com	$2b$10$c3/xdMwKnDZw7EJQLYoW5uZ2q4aw1CXhaogoLlUxFqiHSHHihV3Z.	MASTER	\N	\N	0	2026-07-22 13:13:17.397	2026-07-22 13:13:17.397	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
65b99d46-5260-4ab9-a4d1-f8da61d8a9c7	priya 	priya@example.com	$2b$10$8iuyNbHdMzOXPKagi0l47.yWhqM/tNTYLlvWxY.2d2R1/CS7.oXnW	MASTER	\N	\N	0	2026-07-22 13:43:04.486	2026-07-22 13:43:04.486	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
715e8413-e5e2-48e6-9186-39b3a6c41e2a	Aarth	aarth@example.com	$2b$10$aNkkArZNKEXCwEePH0q.gOKRxqv6oUEBzcX/5P7035cc7WD98GKyK	MASTER	React, Next.js, TypeScript	2	0	2026-06-16 06:21:03.604	2026-07-19 18:45:55.837	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
09bbb5ff-b01d-4893-933e-70b610681365	Aarth Provider	provider@example.com	$2b$10$iEIj5rLIYY/vwod6CXP5lO32LSLDGrNRiALjmGbbicwpjlO17Rrd2	PROVIDER	\N	\N	0	2026-07-03 09:53:08.459	2026-07-19 19:05:08.249	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
80e83419-c21e-46a9-aba0-32011b1444bb	Test KYC	test-kyc-1503779495@test.com	$2b$10$9wuQOIqNSZfD1tXt459BWuXr75eOlgTzkgTza0ngYMdIkx3VROUa2	PROVIDER	\N	\N	0	2026-07-22 09:05:01.895	2026-07-22 09:05:01.895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
3e7f8307-c61e-4f5e-8a9f-81aab3e5c250	Test KYC 3	test-kyc3-1001979652@test.com	$2b$10$7wFWntHysPTWOvHoCsS4eeYhDqp7ugG0pw2ogaOevsc6TBjj8MKBG	PROVIDER	\N	\N	0	2026-07-22 09:06:01.649	2026-07-22 09:06:01.649	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
e954c976-567a-484f-a0da-37c264d560ad	Test User	test-1784720784765@test.com	$2b$10$UAFiiMujp/nXeu1MNhNH8eQcEX7w.mqjsZtnS9gX72fw7p6RYCrbK	PROVIDER	\N	\N	0	2026-07-22 11:46:24.986	2026-07-22 11:46:24.986	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NOT_STARTED	\N	\N
31abdf53-0840-4703-918c-a8cb6b81d84c	Aarth Master	master@example.com	$2b$10$bPTxYDYE5Ctfzmhxd2qM4uBOqo/Ovgb2oWUty7Ka1WCwKHc63OAvC	MASTER	\N	\N	0	2026-07-03 09:53:31.96	2026-07-22 12:58:37.825	\N	\N	Manjunatha layout devasandra	bangalore	2005-12-14	female	adhar.png	pan.jpg	08904738926	560036	selfie.jfif	95	selfie.jfif	Karnataka	VERIFIED	{"status": "VERIFIED", "faceMatch": "96%", "fraudRisk": "Low", "identityMatch": "97%", "ocrConfidence": "98%", "recommendation": "User identity successfully verified. Welcome to WorkLancer AI!", "documentQuality": "Good", "verificationScore": "95/100"}	2026-07-22 12:58:37.818
f0f160cd-65de-4f88-b85a-77729bbd91bc	Aarthivalavan	aarthi@example.com	$2b$10$eq1E5XkNTPvtiZiCkWd.Vu0zkFLNEozbA3MXgw7e6nhuZlSOYF46q	MASTER	\N	\N	0	2026-07-22 12:59:53.823	2026-07-23 08:30:25.119	\N	\N	Manjunatha layout devasandra	bangalore	2005-12-12	female	adhar.png	pan.jpg	08904738926	560036	selfie.jfif	90	selfie.jfif	Karnataka	VERIFIED	{"status": "VERIFIED", "faceMatch": "94%", "fraudRisk": "Low", "identityMatch": "95%", "ocrConfidence": "96%", "recommendation": "Identity verified successfully.", "documentQuality": "Good", "verificationScore": "90/100"}	2026-07-23 08:30:25.102
\.


--
-- TOC entry 4988 (class 0 OID 16400)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1bc971ff-e407-4a4f-99b7-5b5f0a59ab5c	74a2707a367ca798146f02a008c6e6b6a630eee1944f730ab07edffe9f972539	2026-06-15 12:02:19.097919+05:30	20260615063219_init	\N	\N	2026-06-15 12:02:19.050603+05:30	1
6fb49926-9ccc-41db-9076-c94299e7edf8	146029ecc31c087d691a74e699b2a8fee2b729debd6c3d0c01be47c8c949bfad	2026-06-16 14:47:23.188666+05:30	20260616091723_add_project	\N	\N	2026-06-16 14:47:23.067891+05:30	1
a7c29a7a-2a64-45cd-8dbb-aea1902f4b23	60c138fae84b31ad3ead48b76f9b05248ae463efe6e5e354c64d4802e8af85dd	2026-06-17 19:54:57.835914+05:30	20260617142457_add_application	\N	\N	2026-06-17 19:54:57.394397+05:30	1
caa1126d-eb4b-448c-90ae-7527a490c069	1e71b4a7cc4991ed875c6cbe30b70624943cd3540c02e213588a57a2fb139456	2026-06-19 18:43:59.105369+05:30	20260619131359_project_status_workflow	\N	\N	2026-06-19 18:43:59.055241+05:30	1
9e926c71-f8e7-4116-9f6a-f90ca9da38a5	e29ff95dc3e790b99a476ded29c351fc1fbc82695a7373325ef668f25cc39f55	2026-07-08 22:02:50.541414+05:30	20260708163250_add_submission	\N	\N	2026-07-08 22:02:50.443673+05:30	1
fa8e3477-ea3f-4b5a-8fc3-c49dd6def595	381f42b87f20a62854e8d9d6c91268a5b845ab8951dc11c5503c2143969c4fb8	2026-07-10 20:44:26.421651+05:30	20260710151426_add_task_type	\N	\N	2026-07-10 20:44:26.347063+05:30	1
efc42b46-773a-4dee-ae68-501bc3aaf0ed	d59c198251ddc049e9e2c52a561c757934084858b8ea6c45ae0ca89d4161c4c4	2026-07-15 20:32:13.7144+05:30	20260715150213_add_chat_module	\N	\N	2026-07-15 20:32:13.576458+05:30	1
abdc219f-d026-461c-bb13-f148a2c204c6	3308145adc1f160f07183435e57818949cdef657049a67ec1c125a0ddebb0204	2026-07-17 21:21:28.497238+05:30	20260717155128_add_message_read_status	\N	\N	2026-07-17 21:21:28.451578+05:30	1
24fda5ad-97a9-4979-bf45-1571ae35e23a	a91c86972d89a45001314d3b9a98f3cb392560470ea98aa4d6e44af52dce9972	2026-07-18 13:56:55.09371+05:30	20260718082654_add_notifications	\N	\N	2026-07-18 13:56:54.843169+05:30	1
1b15c17f-2004-4b33-b543-1589cc66b127	8679775d5eae9168c7f3bd4e543cfe5c23eabc0c6958934dc7fdf3771c16dae7	2026-07-19 17:56:32.038147+05:30	20260719174600_add_project_provider_id		\N	2026-07-19 17:56:32.038147+05:30	0
7568dfed-dd0e-4f08-8ed6-640912bac9b2	c5c1572aae553249062a9503301a27ab9a5abcd67e17fb63b2259ee0946f3b17	2026-07-20 00:02:45.193325+05:30	20260719235930_add_reset_password_token	\N	\N	2026-07-20 00:02:45.132131+05:30	1
c413e64e-8fec-4492-9145-15f2412ae49f	a8724adec5f0dd4b1fbcc50194b0db383b681bfd470321d4e10d0ea0fa0422f0	2026-07-21 11:01:39.926787+05:30	20260720150242_add_ai_project_plan	\N	\N	2026-07-21 11:01:39.684363+05:30	1
57bbabd0-cfae-40f9-bb78-271d5899d190	7a208082251d39067a236434bf87691b3a69ea43e6210b5efd2a932e88457d4a	2026-07-21 11:01:39.948093+05:30	20260720210000_add_plan_status	\N	\N	2026-07-21 11:01:39.931015+05:30	1
52c80b0e-2002-4449-86d1-458428fe0da0	17d694ff3927234c1ab5a857d2b21bd31dd5e602504a79a69c178d920df27aae	2026-07-21 11:01:42.311762+05:30	20260721053142_add_ai_project_plan	\N	\N	2026-07-21 11:01:42.220271+05:30	1
a7fa898a-3841-4167-92b7-2247c25dbe7c	a274582b6e821605ac27d3b57c872dca878d88a09556404889d955968e4bcebf	2026-07-21 12:01:23.437015+05:30	20260721113000_add_submission_review	\N	\N	2026-07-21 12:01:23.419096+05:30	1
b897213f-d031-4548-8ad9-65872b8ed788	c796f6a0130f0f90e5edb6dd0810dad868c6e8d9689d35d693f4b9a79ca836c0	2026-07-22 09:59:39.691377+05:30	20260722042939_add_payment	\N	\N	2026-07-22 09:59:39.349847+05:30	1
dc77b716-c052-4c4e-864b-ddf6942e4ebc	31ba7d4dee547b504d049371d37e4fddde993ab3bac0fc930d2e87fd86220d91	2026-07-22 13:11:21.344447+05:30	20260722074121_add_kyc_fields	\N	\N	2026-07-22 13:11:21.304543+05:30	1
\.


--
-- TOC entry 4829 (class 2606 OID 27737)
-- Name: AIProjectPlan AIProjectPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIProjectPlan"
    ADD CONSTRAINT "AIProjectPlan_pkey" PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16573)
-- Name: Application Application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_pkey" PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 25259)
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 25268)
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 25825)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 33669)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 16507)
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 24907)
-- Name: Submission Submission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16425)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16408)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 1259 OID 33670)
-- Name: Payment_submissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_submissionId_key" ON public."Payment" USING btree ("submissionId");


--
-- TOC entry 4819 (class 1259 OID 24908)
-- Name: Submission_applicationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Submission_applicationId_key" ON public."Submission" USING btree ("applicationId");


--
-- TOC entry 4812 (class 1259 OID 16426)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4843 (class 2606 OID 27744)
-- Name: AIProjectPlan AIProjectPlan_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIProjectPlan"
    ADD CONSTRAINT "AIProjectPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4844 (class 2606 OID 27739)
-- Name: AIProjectPlan AIProjectPlan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIProjectPlan"
    ADD CONSTRAINT "AIProjectPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4834 (class 2606 OID 16579)
-- Name: Application Application_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4835 (class 2606 OID 16574)
-- Name: Application Application_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4837 (class 2606 OID 25279)
-- Name: Conversation Conversation_masterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4838 (class 2606 OID 25269)
-- Name: Conversation Conversation_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4839 (class 2606 OID 25274)
-- Name: Conversation Conversation_providerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4840 (class 2606 OID 25284)
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4841 (class 2606 OID 25289)
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4842 (class 2606 OID 25826)
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 27944)
-- Name: Project Project_providerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4836 (class 2606 OID 24909)
-- Name: Submission Submission_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."Application"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-07-24 13:24:27

--
-- PostgreSQL database dump complete
--

\unrestrict kc0qJyKQLqqjLGQNdVyM034WmrvTmYijUrcolDO6pPV51DuIKHsfax0h48jsGp3

