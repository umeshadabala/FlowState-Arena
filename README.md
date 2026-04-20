<p align="center">
  <img src="https://img.shields.io/badge/FlowState_Arena-V1.0-22d3ee?style=for-the-badge&labelColor=020617" alt="FlowState Arena V1.0" />
  <img src="https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&labelColor=020617" alt="React 18" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&labelColor=020617" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite&labelColor=020617" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-d946ef?style=for-the-badge&labelColor=020617" alt="License" />
</p>

<h1 align="center">⚡ FlowState Arena V1.0</h1>
<p align="center"><strong>Real-Time Crowd Intelligence Platform for Large-Scale Venues</strong></p>

<p align="center">
  A self-simulating digital twin dashboard that uses <em>Behavioral Load Balancing</em> to visualize, predict, and manage crowd congestion across stadium zones in real time.
</p>

---

## 🎯 What is FlowState Arena?

FlowState Arena is a **real-time crowd-management dashboard** designed for large-scale sporting venues, concerts, and festivals. It provides venue operators with a live, interactive **digital twin** of their entire facility — visualizing crowd density, predicting bottlenecks, and automatically generating smart reroute suggestions to balance foot traffic across zones.

### The Problem

Large venues with 50,000+ capacity face critical challenges:
- **Gate congestion** causes dangerous crowd crushes during peak entry/exit
- **Concession bottlenecks** lead to long wait times and lost revenue
- **Reactive management** — operators only respond *after* problems occur
- **No unified view** of the entire venue's crowd state in real time

### The Solution

FlowState Arena provides:
- 🔴 **Live monitoring** of 36 venue zones updating every second
- 🧠 **Predictive intelligence** via Flow Velocity metrics (people/min)
- 🔀 **Automated rerouting** with incentive-based nudge system
- 📊 **At-a-glance analytics** with color-coded status indicators

---

## ✨ Key Features

### 🗺️ Digital Twin — 6×6 Venue Grid
A responsive CSS Grid representing 36 stadium sections that react in real time:

| Congestion Level | Color | Status |
|---|---|---|
| 0–40% | 🟦 Electric Cyan | Clear |
| 41–75% | 🟨 Gold | Busy |
| 76–100% | 🟪 Pulsing Magenta | Critical |

Each cell shows:
- Zone name and current congestion percentage
- Hover tooltips with detailed stats (wait time, status)
- Pulsing animation for critical zones
- Smooth Framer Motion hover interactions

### 🧠 Pathfinder AI — Smart Rerouting Engine
The intelligence unit that automatically:
- **Ranks all gates** from lowest to highest congestion
- **Identifies the optimal entry point** at any moment
- **Generates reroute nudges** when zones exceed 70% capacity
- **Offers incentives** — `ARENA-FLOW-15` discount code (15% off concessions) to encourage crowd redistribution

### 📊 Live Analytics Panel
Real-time CSS bar charts showing:
- Per-gate occupancy with animated progress bars
- Color-coded load indicators
- Average venue congestion metric
- Flow Velocity (people movement rate per minute)

### 🎛️ Control Matrix
Interactive simulation controls:
- **Start / Stop Real-Time** — Toggle the live simulation
- **Peak Surge** — Simulate half-time or event end when food zones spike to critical and gates become congested
- Visual mode indicator (MONITORING / SURGE MODE / PAUSED)

### 🔔 Smart Toast Alerts
Auto-firing notification system:
- 🚨 **Critical alerts** when any zone exceeds 76% (red toast)
- ✅ **Clear notifications** when zones recover (green toast)
- Auto-dismiss after 6 seconds with animated progress bar
- Slide-in animation with glassmorphism styling

### 📈 Flow Velocity — Predictive Intelligence
Unlike simple occupancy tracking, FlowState calculates **Flow Velocity** — the rate of crowd movement across all zones per minute. This enables:
- Predicting bottlenecks *before* they form
- Measuring the effectiveness of reroute actions
- Detecting unusual crowd behavior patterns

---

## 🏗️ Architecture

```
FlowState-Arena/
├── index.html                  # Entry point with Google Fonts
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite dev server config
├── tailwind.config.js          # Custom theme (arena colors, animations)
├── postcss.config.js           # PostCSS + Tailwind pipeline
└── src/
    ├── main.jsx                # React root mount
    ├── index.css               # Global styles, glassmorphism, keyframes
    ├── App.jsx                 # 🧠 Central state, simulation loop, layout
    └── components/
        ├── StadiumGrid.jsx     # 🗺️ 6×6 interactive venue grid
        ├── Pathfinder.jsx      # 🔀 AI reroute engine + nudge feed
        └── ControlPanel.jsx    # 🎛️ Start/Stop + Peak Surge controls
```

### Component Responsibilities

| Component | Role | Key Logic |
|---|---|---|
| `App.jsx` | **The Brain** | Manages `zones[]` state, runs 1s `setInterval` heartbeat, calculates flow velocity, renders 4-panel grid layout, manages toast alerts |
| `StadiumGrid.jsx` | **The Visual** | 6×6 CSS Grid digital twin, reactive colors (cyan/gold/magenta), hover tooltips, pulsing critical animations |
| `Pathfinder.jsx` | **The Intelligence** | Gate ranking algorithm, smart reroute cards with `AnimatePresence`, `ARENA-FLOW-15` discount incentive |
| `ControlPanel.jsx` | **The Controls** | Start/Stop toggle, Peak Surge mode, status indicator |

### State Flow

```
┌─────────────┐    1s tick    ┌──────────────┐
│  setInterval ├──────────────►│  zones[]     │
│  heartbeat   │              │  state       │
└─────────────┘              └──────┬───────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             ┌──────────┐   ┌───────────┐   ┌──────────┐
             │ Stadium  │   │ Pathfinder│   │ Control  │
             │ Grid     │   │ AI        │   │ Panel    │
             └──────────┘   └───────────┘   └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/umeshadabala/FlowState-Arena.git
cd FlowState-Arena

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173` and begin **self-simulating immediately** — no clicks needed.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `arena-base` | `#020617` | Background (Deep Slate) |
| `arena-dark` | `#0f172a` | Card backgrounds |
| `arena-cyan` | `#22d3ee` | Primary accent, clear status, data flow |
| `arena-magenta` | `#d946ef` | Alerts, critical zones, pulsing effects |
| `arena-gold` | `#eab308` | Busy/warning status |

### Typography

| Font | Usage |
|---|---|
| **Inter** (300–900) | UI text, headings, labels |
| **JetBrains Mono** (400–700) | Data values, percentages, codes |

### Visual Effects

- **Glassmorphism**: `bg-slate-900/50` + `backdrop-blur-md` + subtle cyan border
- **Grid Pattern**: Subtle cyan grid lines on the background
- **Pulse Animation**: Critical zones pulse magenta with `drop-shadow`
- **Glow Effects**: Cards emit soft cyan/magenta glow based on state
- **Toast Animations**: Slide-in from right with countdown progress bar

---

## 🔧 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18.3 | UI framework (Functional Components + Hooks) |
| [Vite](https://vitejs.dev) | 6.0 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 11.x | Smooth animations & transitions |
| [Lucide React](https://lucide.dev) | 0.460 | Icon library |

### Why These Choices?

- **Vite** — Sub-second HMR, zero-config React support, lightning fast builds
- **Tailwind CSS** — Rapid UI development with consistent design tokens
- **Framer Motion** — Declarative animations with `AnimatePresence` for mount/unmount transitions
- **Lucide** — Tree-shakeable icons, consistent stroke style, MIT licensed
- **No state library** — React's built-in `useState` + `useRef` + `useCallback` is sufficient for this scale

---

## 📐 Zone Map

The 36-zone grid represents a complete venue layout:

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  North   │    NE    │   East   │    NW    │  Field   │    SE    │
│  Gate    │  Corner  │   Gate   │  Corner  │  Level   │  Corner  │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│  West    │    SW    │  South   │Concourse │  Main    │Concourse │
│  Gate    │  Corner  │   Gate   │    A     │   Bar    │    B     │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│  Merch   │   Food   │   Fan    │   VIP    │  Press   │ Medical  │
│  Stand   │  Plaza   │   Zone   │  Lounge  │   Box    │   Bay    │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Gate A2  │ Gate B2  │ Gate C2  │ Tunnel N │  Pitch   │ Tunnel S │
│          │          │          │          │   Side   │          │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│  Upper   │  Upper   │  Upper   │  Upper   │  Skybox  │Broadcast │
│  Deck N  │  Deck E  │  Deck S  │  Deck W  │   Row    │          │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│Overflow  │Overflow  │Overflow  │Overflow  │  Family  │Accessib. │
│    N     │    E     │    S     │    W     │   Zone   │          │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Zone Types:**
- 🚪 **Gates** (8): North, South, East, West, A2, B2, C2
- 🍔 **Food/Merch** (3): Main Bar, Food Plaza, Merch Stand
- 🏟️ **Sections** (25): Concourses, decks, tunnels, VIP areas

---

## 🧪 Simulation Details

### Normal Mode
- Each zone's congestion changes by **±12** every second
- Values are clamped between **3–99%**
- Status auto-derives: Clear (≤40) → Busy (≤75) → Critical (>75)
- Toast alerts fire on status transitions

### Peak Surge Mode
When activated:
- **Food zones** increase by **+4 to +16** per tick (simulating half-time rush)
- **All other zones** increase by **+2 to +10** per tick
- Rapidly drives zones to Critical status
- Pathfinder AI generates multiple reroute suggestions

### Flow Velocity
Calculated as:
```
flowVelocity = Σ |currentCongestion[i] - previousCongestion[i]| × 12
```
This gives an approximation of people movement rate per minute across all zones.

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas for extending FlowState Arena:

- [ ] **Multi-event modes** — Sports / Concert / Festival with different zone layouts
- [ ] **WebSocket integration** — Replace simulation with real IoT sensor data
- [ ] **Historical playback** — Record and replay crowd patterns
- [ ] **Heat map overlay** — Gradient-based congestion visualization
- [ ] **Mobile responsive** — Touch-optimized layout for tablet/phone
- [ ] **Emergency protocols** — Lockdown mode, evacuation route planning
- [ ] **API endpoints** — REST/GraphQL for external system integration

### Development

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ⚡ by <a href="https://github.com/umeshadabala">Umesh Adabala</a></strong>
</p>
<p align="center">
  <em>FlowState Arena V1.0 — Crowd Intelligence Platform</em>
</p>
