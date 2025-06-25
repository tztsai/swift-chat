### 1\. Introduction & Vision

**Product Vision:** Ruminer is a personal knowledge operating system designed to unify note-taking, task management, read-it-later services, and AI-powered chat into a single, cohesive interface. It aims to create a versioned, interconnected, and intelligent memory space that mirrors the natural, non-linear way humans think.

**Core Problem:** Today's knowledge workers face fragmentation. Notes are in one app, to-dos in another, web clippings in a third, and AI chats are ephemeral. This creates friction and prevents the cross-pollination of ideas. Ruminer solves this by treating every piece of information as a "message" within a unified, version-controlled system, making all knowledge searchable, linkable, and actionable.

**Guiding Principles:**

  * **Data Sovereignty:** Users own their data in a transparent, local-first format (Markdown files).
  * **Unified Interface:** A single, consistent interface for capture, organization, and retrieval.
  * **Intelligent & Contextual:** AI is a first-class citizen, used to augment memory and automate workflows.
  * **Non-Destructive History:** Every thought and edit is preserved through Git-based versioning.

### 2\. Target Audience

  * **Knowledge Workers & Researchers:** Professionals who synthesize large amounts of information.
  * **Developers & Tech Enthusiasts:** Users comfortable with concepts like Git and Markdown who value data control.
  * **Lifelong Learners:** Individuals who consume and process content from various sources (articles, books, videos).

### 3\. Core Architecture

  * **Chamber:** The top-level vault, which is a user-selected local folder on the filesystem.
  * **Dialogue:** A single conversation or topic thread, physically represented as a Git repository within the Chamber folder.
  * **Message:** The atomic unit of knowledge (a note, a screenshot, a URL, an AI response), represented as a timestamped Markdown file with a metadata header within a Dialogue's Git repository. Every message is a Git commit.

-----

### 4\. Phased Development Plan

This plan breaks down the development into logical phases, delivering value incrementally.

#### **Phase 1: Foundation & Core Chat (MVP)**

**Goal:** Establish the foundational chat application with its unique Git-based backend.

| Feature ID | Feature Description          | User Stories                                                                                         | Acceptance Criteria                                                                                                                                                                                                                    |
| :--------- | :--------------------------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1-01**  | **Fork & Adapt Base App**    | As a developer, I want to start with a working chat application base to accelerate development.      | - A functional AI chat app (like `swift-chat`) is running locally.<br>- Core UI components (Message, Dialogue View) are identified and modularized.                                                                                    |
| **P1-02**  | **Filesystem & Git Backend** | As a user, I want to select a local folder as my "Chamber" so I can control where my data is stored. | - On first launch, the app prompts the user to select a directory.<br>- Creating a new "Dialogue" initializes a new Git repository in a sub-folder.<br>- Sending a message creates a new Markdown file and a corresponding Git commit. |
| **P1-03**  | **Basic Dialogue UI**        | As a user, I want to see a list of my dialogues and view the messages within a selected dialogue.    | - A sidebar lists all dialogue folders within the Chamber.<br>- Clicking a dialogue displays its messages in chronological order.<br>- The UI updates reactively when files are changed on disk.                                       |

-----

#### **Phase 2: Interactive Dialogue & Smart Input**

**Goal:** Implement the core interaction model of versioning, branching, and an enhanced message input experience.

| Feature ID | Feature Description              | User Stories                                                                                                                 | Acceptance Criteria                                                                                                                                                                                                                                               |
| :--------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P2-01**  | **Dual-Action Input**            | As a user, I want to either save a note privately or ask the AI for a response.                                              | - A "Save" button commits the message without triggering an AI response.<br>- An "Ask" button commits the message and sends it to the AI for a reply, which is then saved as a new commit.                                                                        |
| **P2-02**  | **In-Place Editing & Branching** | As a user, I want to edit any previous message, and I want the AI to respond to my edit without losing the original history. | - Clicking an "edit" icon on a message allows for in-place modification.<br>- Saving the edit creates a new commit.<br>- Requesting an AI response to an *edited* message creates a new Git branch automatically.                                                 |
| **P2-03**  | **Branch Navigation**            | As a user, I want to easily see and switch between different conversation branches that originate from a single message.     | - A message with multiple subsequent branches displays caret icons (`<` and `>`).<br>- Clicking the carets cycles through the different branches, updating the subsequent message view.                                                                           |
| **P2-04**  | **Enhanced Message Box**         | As a user, I want to use special characters to quickly format my messages, create links, and manage tasks.                   | - Typing `#` suggests tags.<br>- Typing `@` allows linking to other messages.<br>- Typing ` -  ` or `- [ ]` auto-formats as a list or todo item; auto-append the next item<br>- An "expand" button converts the message box into a full-featured Markdown editor. |

-----

#### **Phase 3: Capture & Organization**

**Goal:** Make it frictionless to get information *into* Ruminer from anywhere and organize dialogues effectively.

| Feature ID | Feature Description       | User Stories                                                                                                                       | Acceptance Criteria                                                                                                                                                                                                                                                                 |
| :--------- | :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P3-01**  | **Quick-Send Mechanisms** | As a user on my mobile device or desktop, I want to quickly save a thought, URL, or image to Ruminer without opening the full app. | - An **App Widget** allows for typing and sending a message directly to a default dialogue.<br>- A system **Share Sheet** target allows sending URLs, text, and images to Ruminer.<br>- A registered **App Intent/Action** allows for scriptable input (e.g., via Apple Shortcuts). |
| **P3-02**  | **Dialogue Groups**       | As a user, I want to organize my dialogues into folders or groups to keep my sidebar tidy.                                         | - Users can create folders in the sidebar and drag dialogues into them.<br>- A "Smart Group" can be created based on rules (e.g., source: `readwise`, tag: `project-x`).                                                                                                            |
| **P3-03**  | **Task & Calendar View**  | As a user, I want to see all my tasks and time-sensitive notes in one place.                                                       | - A dedicated Calendar view lists all messages containing a todo (`- [ ]`) or a reminder tag.<br>- Items are organized by date.<br>- Clicking an item navigates to its context within the source dialogue.                                                                          |

-----

#### **Phase 4: Automation & Integration**

**Goal:** Automate the import of external data sources using background services.

| Feature ID | Feature Description            | User Stories                                                                                         | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :--------- | :----------------------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P4-01**  | **Background Service Workers** | As a user, I want the system to automatically fetch data and process tasks for me in the background. | - A service worker can be configured to run on a schedule.<br>- **Webpage Fetcher:** When a URL is saved, the service fetches the full page content and saves it as Markdown. <br>- **Readwise Import:** The service periodically calls the Readwise API and imports new highlights as messages into a "Readwise" smart group.<br>- **Screenshot Import:** The service monitors the screenshot folder, runs OCR on new images, and saves the text and image as a new message. |
| **P4-02**  | **Browser Extension**          | As a user, I want to easily save my AI conversations and web content directly from my browser.       | - The extension can capture and import entire conversations from major AI chat platforms.<br>- The extension allows for saving a full webpage or selected text highlights.                                                                                                                                                                                                                                                                                                    |

-----

#### **Phase 5: Intelligent Search & Retrieval (RAG)**

**Goal:** Implement a powerful, AI-assisted search and retrieval system that leverages the entire knowledge base.

| Feature ID | Feature Description                      | User Stories                                                                                                          | Acceptance Criteria                                                                                                                                                                                                                             |
| :--------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P5-01**  | **Global & Local Search**                | As a user, I want to find any message, whether it's in my current dialogue or across my entire Chamber.               | - A search bar provides instant full-text search results.<br>- Search can be scoped globally or to the current dialogue.<br>- (Bonus) Vector search is implemented for semantic matching.                                                       |
| **P5-02**  | **Retrieval Augmented Generation (RAG)** | When I ask the AI a question, I want it to use my own notes and history as context to provide a more relevant answer. | - Before querying the AI, the system performs a vector search for relevant historical messages.<br>- The retrieved content is injected into the AI prompt.<br>- The final AI response includes citations that link back to the source messages. |
| **P5-03**  | **Unified Retrieval API**                | As a developer, I want a single, abstract API for both user-facing search and AI-backend retrieval.                   | - A unified `search()` function is created that can handle queries from both the user and the RAG system.<br>- The API supports filtering by tags, source, time, etc.                                                                           |

-----

#### **Phase 6: Advanced Visualization**

**Goal:** Build the innovative navigation and visualization tools for exploring the knowledge graph.

| Feature ID | Feature Description     | User Stories                                                                                                   | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------- | :---------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P6-01**  | **Global History Tree** | As a user, I want a high-level view of all changes across a dialogue, similar to GitLens in VS Code.           | - A toggleable view displays the entire Git commit history of a dialogue as a DAG.<br>- Nodes represent messages/commits.<br>- Clicking a node checks out that version of the dialogue in the main view.                                                                                                                                                                                                                               |
| **P6-02**  | **2D Dialogue Minimap** | As a user, I want an intuitive map to navigate the complex temporal and semantic structure of a long dialogue. | - A minimap view is available for each dialogue.<br>- The **vertical axis** represents the commit timeline of a branch.<br>- The **horizontal axis** represents either a Git branch (alternate history) or a semantic expansion of a node (its children/mindmap).<br>- Nodes can be collapsed (showing a summary) or expanded to the right (showing children).<br>- The minimap is interactive: clicking a node focuses the main view. |

### 5\. Success Metrics

  * **Adoption:** Number of downloads and active daily/monthly users.
  * **Engagement:** Average number of messages created per user per day.
  * **Feature Penetration:** Adoption rate of key features (e.g., RAG, branch creation, smart groups).
  * **Data Volume:** Average size of a user's Chamber over time.
  * **User Retention:** Percentage of users who remain active 30 days after installation.