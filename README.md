# Hompai Mobile — Smart Household Inventory & AI Reminders

![React Native](https://img.shields.io/badge/React_Native-Expo_Dev_Client-000020?style=flat-square&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%7C_FCM_Messaging-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Google Sign-In](https://img.shields.io/badge/OAuth-Google_Sign_In-4285F4?style=flat-square&logo=google&logoColor=white)
![Design Patterns](https://img.shields.io/badge/Patterns-Builder_%7C_Factory_%7C_Observer-10B981?style=flat-square)

<p align="center">
  <img src="https://raw.githubusercontent.com/jomudev/portfolio/main/public/res/Hompai_Android_mockup.jpg" alt="Hompai Mobile Mockup" width="680" />
</p>

## Executive Summary

**Hompai Mobile** is a cross-platform mobile application built with **React Native and Expo (`expo-dev-client`)** for managing household pantry items, smart reminders, and batch inventories. The codebase applies classic object-oriented design patterns (**Builder, Factory, and Observer**) within a modular JavaScript mobile architecture.

---

## Architecture & Engineering Highlights

- **Applied Software Design Patterns:**
  - **Builder Pattern (`src/objects/ArticleBuilder.js`):** Clean step-by-step construction of domain objects (`Article`, `LocallySavedArticle`, `Reminder`).
  - **Factory Pattern (`src/objects/AnimationFactory.js`):** Encapsulated UI animation instantiation.
  - **Observer Pattern (`src/interfaces/Observable.js`, `Observer.js`):** Decoupled state change propagation across pantry modules.
- **Authentication & Security (`modules/Auth.js`):** Native Google Sign-In (`@react-native-google-signin/google-signin`) integrated with `@react-native-firebase/auth`.
- **Push Notifications (`modules/PushNotificationHelper.js`):** Real-time reminder alerts via Firebase Cloud Messaging (`@react-native-firebase/messaging`).
- **AI & Offline Persistence (`modules/AIapi.js`, `modules/Storage.js`, `modules/PantryStore.js`):** Local persistence via `AsyncStorage` paired with custom React hooks (`ArticlesHooks.js`) and modular API clients.

---

## Project Structure

```text
HompaiMobile/
├── modules/
│   ├── AIapi.js                    # AI assistant integration client
│   ├── Auth.js                     # Firebase + Google Sign-In authentication
│   ├── PantryStore.js              # Domain pantry store logic
│   ├── PushNotificationHelper.js   # FCM token & push notification handler
│   └── Storage.js                  # AsyncStorage persistence layer
├── src/
│   ├── apis/                       # Reminders API integration
│   ├── components/                 # Home & Reminder UI components (@rneui/themed)
│   ├── errors/                     # Typed error wrappers (AIErrors, SignInErrors)
│   ├── hooks/                      # Custom article state hooks
│   ├── interfaces/                 # Observable & Observer interfaces
│   ├── objects/                    # ArticleBuilder, AnimationFactory, domain models
│   ├── router/                     # React Navigation Native Stack router
│   └── screens/                    # Articles, Batch & core app screens
└── App.js                          # Application entry point
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev client
npm start

# Build & run native targets
npm run android
npm run ios
```

---

## Author & Contact

**Héctor Joann Murillo Mejía** — Mobile & Full-Stack Software Engineer (React Native · TypeScript · Node.js)

- **Email:** [joannmurillo@icloud.com](mailto:joannmurillo@icloud.com)
- **LinkedIn:** [linkedin.com/in/hector-joann-murillo-mejia](https://www.linkedin.com/in/hector-joann-murillo-mejia/)
- **GitHub:** [github.com/jomudev](https://github.com/jomudev)
- **Portfolio:** [joannmurillo.com](https://www.joannmurillo.com)
