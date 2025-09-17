# AI Music Search Documentation

# Overview

This app is an AI powered, royalty-free music search engine, with playback + download capabilities. A user can enter a search prompt into the search bar, and the AI + Music DB will respond back with songs corresponding to the prompt. Results are displayed to the user, where they can then playback all the songs, or download any songs.

#### **Services**

- **OpenAI 4o-mini API**
  - <https://platform.openai.com/docs/overview>
  - Our AI API of choice. We send a prompt to OpenAI, and it responds with search tags to use for our Jamendo search (music DB).
  - Location in code:
    - app / api / openai
- **Jamendo API**
  - <https://developer.jamendo.com/v3.0/docs>
  - Our resource for royalty-free music. We send the API the search tags to search by, and it responds with a JSON of all corresponding songs. Each song in the JSON contains info like name, artist, streaming link, download link, thumbnail, etc.
- **OAuth 2.0**
  - Authorization framework. We use OAuth to authenticate users are legitimate, so we don’t have bots creating API requests (costs money)
- **Firebase**
  - <https://console.firebase.google.com/u/0/project/ai-song-search/overview>
  - **Authentication**
    - Helps manage authentication (with OAuth)
    - Google, Facebook, GitHub
  - **Firestore**
    - Database, NoSQL (non-relational)
    - Used for session management, stores tokens
      - providerAccessToken (OAuth)
      - jamendo_access_token
      - jamendo_refresh_token

#### **Frameworks/Platforms**

**Node.js**

- The runtime that powers Next.js server-side rendering & APIs.
- Location in code:
  - app / api / ... / route.js

**React**

- Used inside .jsx files and components to render UI.
  - Components
  - Context
  - Hooks

**Next.js**

- The framework providing routing, APIs, and React integration.
- Utilizes Next.js App Router
  - Location in code:
  - app / (pages) / … / page.jsx
  - app / (pages) / … / layout.jsx
  - <https://nextjs.org/docs/14/app/building-your-application/routing>

**Material UI (MUI)**

- React component library (buttons, sliders, icons, etc.)

**Vercel**

- Cloud deployment platform
- Environment variables + secrets are found here
- <https://vercel.com/nick-grahams-projects/ai-music-search>

**ESLint**

- Tool that analyzes your source code to find problems before you run it.
  - Errors (real bugs, like undefined variables).
  - Style issues (missing semicolons, unused imports, inconsistent spacing).

**Tailwind** **CSS**

- Our CSS Utility framework (flex, padding, margin, etc.)

# Structure Overview

Below is the folder structure of the app. It is separated into a client/server (front-end/back-end) design, where the client and the server are distinct from each other. It is an important security consideration that any outbound requests to any APIs/DB, are not done client-side.

**Client:**

- **_app/(pages)_** folder
- **_app/components_** folder
- **_context_** folder
- **_hooks_** folder

**Server:**

- **_app/api_** folder
- **_lib_** folder
- **_styles_** folder
- **_utils_** folder

# Codebase Structure

- **_\[folder\]_**
  - \[folder description\]
  - **_\[file\]_**
    - \[file description\]

### **_app_**

#### **(pages)**

- - Actual pages + their layouts. Client-side
    - Currently only one real “page“ – the home page
    - **_layout.jsx_**
      - context provider
    - **_(home)_**
      - **_layout.jsx_**
        - \* Main home layout \*
      - **_page.jsx_**
        - \* Main home page \*
      - **_User_**
        - User profile. Not yet implemented
        - **_\[id\]_**
        - **_Favorites_**
    - **_Login_**
      - Not in use currently.
      - **_callback_**
        - Not in use currently. “callback” screens used for logging into a Jamendo account.
        - **_jamendo-callback.jsx_**
        - **_page.jsx_**

#### **api**

- - Where API calls are handled. Server-side.
    - **_auth_**
      - **_login_**
        - **_route.js_**
      - **_logout_**
        - **_route.js_**
    - **_jamendo_**
      - **_jamendo-search.js_**
      - **_access-token_**
        - **_route.js_**
      - **_jamendo-handler_**
        - **_go-to-jamendo.js_**
        - **_jamendo-auth.js_**
    - **_openai_**
      - **_route.js_**
        - Entry and exit location of the front-end to back-end communication (when you hit search)
        - This encapsulates the entire API calling search process
          - (additional functions are called from within this one)
      - **_openai-handler_**
        - **_openai.js_**
    - **_session_**
      - **_route.js_**
      - **_session-handler_**
        - **_session.js_**

#### **components**

- - **_search-bar.jsx_** - where the initial call to the back end is made - await fetch(“/api/openai”, { … });
    - **\[other _misc. components\].jsx_**
    - **_audio_**
      - **_\[audio components\].jsx_**
    - **_login_**
      - **_\[login components\].jsx_**

### **_context_**

- Handles react context within the app (react hooks, state-based stuff, global values/functions). Client-side.
- **_audio-player-context.jsx_**
  - tracks, setTracks, currentTrack, setCurrentTrack, isPlaying, setIsPlaying, etc.
- **_auth-context.jsx_**
  - user, setUser, googleSignIn, etc.

### **_hooks_**

- Custom hooks
- **_use-current-user.jsx_**

### **_lib_**

- Firebase and Firestore logic are handled here, among other things.
- **_ai-tools.js_**
  - functions + tools used to assist AI search
- **_authorize-calls.js_**
  - User is authorized here before any initial API call is made (before initial OpenAI call)
- **_firebase-admin.js_**
- **_firebase.js_**
- **_search-data_**
  - lists of data used to search with (tags, etc.)

### **_styles_**

- **_customize-progress-bar.css_**
- **_globals.css_**
- **_theme.js_**

### **_utils_**

- **_clean.js_**

# High Level Typical Flow

- User enters prompt and clicks search button
- Validate user with their ID token
- If okay, call OpenAI API with user’s prompt + search tools
- AI will respond with search tags to use for Jamendo API call
- Format search tags for Jamendo API call
- Call Jamendo API using formatted tags
- Jamendo responds with all corresponding songs
- Send OpenAI search results from Jamendo for its final response (the message back to the user)
- Get AI response back
- Load songs received earlier into an array in audio-player-context.jsx
- Display each song into a result-card component
- Display AI final response to user

# Future Considerations

- Change to Apple Music / Spotify API for a much larger library of music
- User Playlists
  - Auto generate playlists
  - Based on prompt or based on particular artist/song
- User Profiles
- Song Recommendations based on given:
  - Song
  - Artist
  - Genre
- Check out other LLMs
- Dark Mode
- UI Refinement
