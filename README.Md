# CureFeed-v2

This is a completely rewritten version of the previous [CureFeed](https://github.com/adwaithwas/CureFeed). The previous version was written using Flask API, but the Python environment was a pain in the arse to work with and deployment was difficult, which led to me slowly abandoning the project.

> [!NOTE]
> Currently, CureFeed uses Vercel for the frontend deployment and the free tier of Render for the backend. As the Render free tier sleeps after 15 minutes of inactivity, it takes around 40–50 seconds to wake up on the first search. Backend fetching works perfectly once the server is awake! 

---

## Story 😸

This is a project i am genuinely passionate about, because ever since in 2020 i discovered self improvement and dopamine detox, ive been intriguied by the idea of reducing/ cutting away social media from my day to day life. Even though i found success in most parts, YouTube was always one of those websites i always ended up coming back to, and hence the idea of a custom youtube feed which shows us useful feed without sucking us into the algo rabbit hole was always something i was interested in. 

Even though there are some ways to do this, i decided to make my own engine for this as that sounded cool lol, and thats how CureFeed was born. I made first MVP using flask and python as i was not that experienced in forntend development and decided to go with python because it sounded easy, and even though it has its own positives i never really liked the customisation features it had. As time passed i picked up frameworks like react, express, tauri, etc, which provided me with confidence to rewrite this in newer format. And here it is.

## Features

### 1. Clean Feed Checker (Inbox Style)

The home tab acts as a **feed checker** rather than a recommendation engine. It aggregates new uploads chronologically and filters out community posts to prevent feed clutter.

*   **Aggregated View**: Combines both public uploads and members-only videos into a single, unified timeline.
*   **Chronological Sorting**: All content is sorted by upload time (newest first), ensuring you never miss a new upload.
*   **Clutter-Free Design**: Community posts are hidden from the home feed to keep the experience focused solely on video content.

### 2. Client-Side Watch Tracking

All tracking is handled locally in your browser using `localStorage`, ensuring complete privacy and instant updates.

*   **One-Click Tracking**: Click on any video to watch it, and it instantly gets marked as "watched".
*   **Real-Time Filtering**: Watched videos are immediately filtered out of your feed and "caught up" states.
*   **Private & Secure**: No user data or viewing history is ever stored on the backend or sent to any server.

### 3. Private YouTube Player

Videos are played inside a custom, cookies-free player to prevent algorithmic tracking.

*   **`youtube-nocookie.com`**: Uses the privacy-focused YouTube embed domain to prevent tracking.
*   **No Cookies**: Does not use any YouTube cookies, ensuring your viewing behavior is not tied to your Google account.
*   **Seamless Integration**: Opens in a centered, non-intrusive overlay that maintains focus on the content.

### 4. Monochrome-by-Default Filter

The video player defaults to monochrome to keep visual stimulation to an absolute minimum, aligning with the "dopamine detox" philosophy.

*   **Instant Grayscale**: Videos load in black and white by default to reduce cognitive load.
*   **Smooth Toggle**: A dedicated button in the player header allows you to toggle colors on or off with a smooth transition.
*   **Preference Retention**: Your color preference is saved locally, so the player remembers your choice for future sessions.

### 5. "Zero-Stimulus" Caught-Up State

When you have watched all available content, the interface transitions into a clean, minimalist "caught-up" state.

*   **Visual Clarity**: The feed is replaced by a simple checkmark icon and a "No new videos" message.
*   **Reset Option**: Includes a subtle `[Reset watch history]` button, allowing you to clear your progress and start fresh whenever you choose.
*   **Zen Mode**: Eliminates all content, providing a clear mental break and a satisfying sense of completion.

### 6. Backstage Community Tab

A dedicated community tab parses and displays various types of community posts that are typically hidden in the standard YouTube UI.

*   **Rich Content Support**: Supports text-only posts, posts with links, single image attachments, and gallery (multi-image) posts.
*   **Organized Layout**: Posts are displayed in a clean, card-based layout that is easy to read and navigate.
*   **Link Previews**: Posts containing URLs display rich link previews to provide context.

### 7. Flexible Subscriptions

Manage your subscriptions with simple, efficient controls.

*   **Save Channels**: Add channels to your subscriptions with a single click.
*   **Delete Channels**: Easily remove channels when needed.
*   **Instant Sync**: All changes are saved immediately to your local storage and reflected across the app.

### 8. Fuzzy Handle Search

The search functionality automatically formats and corrects YouTube channel handles.

*   **Auto-Formatting**: Automatically converts raw handles (e.g., `ABCDE`) into fully-qualified YouTube URLs (e.g., `https://youtube.com/LifeLiftLogic/ABCDE`).
*   **Flexible Input**: Supports both `@handle` format and raw handle input without requiring manual URL formatting.
*   **Error Prevention**: Prevents invalid URL errors by ensuring the backend always receives a correctly formatted URL.

---

## Tech Stack 🛠️

### Frontend

*   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for type safety and component-based architecture.
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) for a utility-first approach to styling and custom animations.
*   **Icons**: [Lucide React](https://lucide.dev/) for a consistent and modern icon set.
*   **State Management**: Built-in React hooks (`useState`, `useEffect`) for local state management.
*   **APIs**: HTML5 Web APIs (e.g., `localStorage`) for client-side data persistence.
*   **Hosting**: [Vercel](https://vercel.com/) for seamless deployment and global CDN.

### Backend

*   **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) for the server framework.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and better developer experience.
*   **YouTube Parsing**: [youtubei.js](https://github.com/LitoMore/youtubei.js/) for unauthenticated parsing of YouTube data and memo-tree structures.
*   **API Design**: RESTful API architecture for clean separation between frontend and backend.
*   **Hosting**: [Render](https://render.com/) (Free Tier) for backend deployment.
