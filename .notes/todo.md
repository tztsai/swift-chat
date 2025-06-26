### **Core Features**
- [ ] InstantDB real-time sync in connection with Supabase
- [ ] Branching of dialogue like Git branches
* [ ] Readwise ingestion via API
* [ ] Screenshot OCR (monitoring a selected folder via `pickDirectory`)
* [ ] URL content fetch (Web Scraper)
	- [ ] Implement a cloud function to fetch and clean article content from a URL.
    - [ ] Integrate with the native **Share Sheet** (iOS/Android) to save links.
* [ ] WeRead (微信读书) ingestion
* [ ] Rednote (小红书) ingestion
* [ ] Set up a scheduler (e.g., Supabase PG Cron) for recurring tasks like syncing feeds or sending reminders.
* [ ] Expose webhooks to allow integration with external services like IFTTT or Zapier.

### **User Interface & Experience**
- [ ] On a new page, user can write a note in the central area or enter a message in the message box
	- [ ] If user sends a message first, then it's the normal chat mode; If user has written something in the central area and then sends a message, the note persists and becomes the context the user and AI talk about and can also be edited by AI upon request
	- [ ] With no chat messages, the central area is a rich-text editor using Tiptap; in writing a chat message, the user can also press an "expand" button to expand the minimal text field into full screen rich-text editor
* [ ] Sidebar for navigation (Resources, Dialogues, Artifacts)
* [ ] Double-tap any message to edit
	* [ ] There should be two buttons - one simply saves the edited message, the other requests for an AI response; if the edited message already has a response, then it creates a new branch of the dialogue where 
* [ ] App Action (Android) / Intent (iOS) for quick message
* [ ] Home screen widgets for quick message
* [ ] Build a **Browser Extension** to capture webpages, highlights, and AI chats.
* [ ] Build a **Wechat service account** to capture anything shared with it.
* [ ] Build service workers to ingest RSS feeds and email newsletters.
* [ ] Create 2D minimap for dialogues or artifacts - git branches horizontally and document tree vertically

### **Search & AI**
* [ ] Offline full-text search (SQLite FTS5)
* [ ] Online hybrid search (Supabase) with filtering, grouping, sorting
* [ ] Enable selected messages from the search result to be used as the context of a new dialogue
* [ ] AI Search Mode (RAG pipeline) to generate cited answers from history messages and link with them
* [ ] Bookmarking messages in a dialogue
* [ ] Audio note recording with Whisper transcription

### **Organization & Review**
* [ ] Bi-directional linking (`@mention` creates a link to a history message)
* [ ] Note version history
- [ ] Groups of dialogues (can be nested)
- [ ] Tags for dialogues (bonus: auto-tag with AI, c.f. karakeep)
* [ ] Spaced Repetition "Review Mode" in swiper cards to adjust priority; prioritize resurfacing unreviewed messages
* [ ] "Content Fading": A mechanism to auto-archive or delete neglected notes after a certain period to encourage review and decluttering
