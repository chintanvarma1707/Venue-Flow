# 🏟️ ApexStadium: User Guidance & Feature Documentation

Welcome to **ApexStadium**, the next-generation smart stadium management and fan engagement platform. This document provides a comprehensive overview of the platform's capabilities, how to navigate the interface, and how to utilize the administrative "God Mode" controls.

---

## 🚀 1. Getting Started

### Installation & Launch
1. **Environment**: Ensure you have Node.js (v18+) installed.
2. **Setup**: Run `npm install` to install dependencies.
3. **Launch**: Execute `npm run dev` to start the local development server.
4. **Access**: Open `http://localhost:3000` in your browser.

### Authentication
- **User View**: No login required. Simply enter a **Seat Code** (e.g., `A101`) on the onboarding screen to enter.
- **Admin Portal**: 
  - **URL**: `/admin`
  - **Username**: `admin`
  - **Password**: `password`

---

## 📱 2. Fan Experience (Homepage)

The fan interface is designed as a **Bento-style Interactive Hub** that provides real-time stadium intelligence.

### Core Features:
- **Live Scoreboard**: Real-time cricket match updates (Runs, Overs, Wickets) at the top of the dashboard.
- **Digital Twin (Stadium Bowl)**: A 3D-interactive visualization of the stadium. Clicking on a sector allows you to "teleport" or view specific sector details.
- **Vision AI (Heatmaps)**: Accessed via the "Vision AI" button. Provides real-time crowd density heatmaps for the entire venue.
- **Food & Concessions**: Use the "Food Order" hub to browse the menu, add items to your cart, and have them delivered directly to your registered seat.
- **Emergency SOS**: A high-priority red button for immediate assistance. Triggers a tactical alert for stadium security.
- **FanSync**: Interactive light-show controls that sync your phone's flashlight and screen with the stadium's rhythm.

---

## 🛡️ 3. Administrative Command Center (Admin Portal)

The Admin Portal is a **Full-Screen Tactical HUD** designed for total venue oversight.

### Key Modules:
- **Neural AI Feed (Left Panel)**: 
  - Monitor live occupancy and wait times for every gate.
  - **Density Control**: Manual sliders allow you to override AI data for stress-testing or crowd management.
- **Global Digital Twin (Center)**: 
  - A massive interactive map showing the health status of every sector.
  - **Colors**: Green (Optimal), Orange (Busy), Red (Critical/Congested).
- **Property Overrides (Right Panel)**: 
  - Select a sector on the map to unlock its properties.
  - **Routing Override**: Change gate assignments (e.g., redirect fans from Gate A to Gate B) in real-time.
  - **Capacity Management**: Manually adjust density levels to update the public-facing heatmaps.
- **Tactical Simulator**: 
  - Click **"RUN SIMULATION"** in the top header to generate dynamic, moving crowd data across the entire stadium. This simulates a real match-day flow.

---

## 🛠️ 4. Technical Architecture

ApexStadium is built with a high-performance modern stack:
- **Framework**: Next.js 15 (React 19)
- **Styling**: Vanilla CSS with Glassmorphism and Tactical-Grid design.
- **Animations**: Framer Motion for high-fidelity transitions and micro-interactions.
- **Data Flow**: Local state synchronization between `public/stadium_state.json` and `public/vision_data.json` for persistent simulations.
- **Icons**: Lucide-React for tactical iconography.

---

## 📋 5. Best Practices
- **Responsiveness**: The app is fully responsive. Use the **Mobile/Laptop** toggle at the bottom-right of the homepage to preview different device experiences.
- **Simulation**: Always run the simulator in the Admin Portal to see the "Pulse" of the stadium on the fan dashboard.
- **Exit Strategy**: Use the "EXIT" button in the admin header to quickly return to the fan view without logging out.

---

**© 2026 ApexStadium Intelligence Systems**
*Transforming the atmosphere, one data point at a time.*
