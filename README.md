# 🖥️ Interactive Terminal Portfolio

A high-fidelity, interactive terminal-style portfolio website inspired by [vladburca.com](https://vladburca.com). Built with React, Next.js, and Tailwind CSS — featuring ASCII art, a command history system, and a retro "Midnight Retro" hacker aesthetic.

![Terminal Portfolio Preview](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer)

---

## ✨ Features

- **CLI Interface** — Fully interactive terminal with command input, history, and output
- **ASCII Art** — Large name header and portrait rendered with `<pre>` tags
- **Command History** — Navigate previous commands with ↑/↓ arrow keys
- **Blinking Cursor** — Authentic terminal cursor animation
- **Clickable Navigation** — Dashboard navigation items execute commands on click
- **12+ Commands** — `/about`, `/work`, `/clients`, `/skills`, `/contact`, `/help`, `/clear`, `ls`, `whoami`, `sudo`, `date`, `pwd`, `echo`
- **macOS Window Frame** — Traffic light buttons (red, yellow, green) with hover effects
- **Responsive** — 2-column grid on desktop, stacked on mobile
- **Smooth Animations** — Framer Motion entrance animations and skill bar reveals

## 🎨 Theme: "Midnight Retro"

| Token | Color | Usage |
|-------|-------|-------|
| `--color-terminal-bg` | `#24243e` | Window background |
| `--color-terminal-peach` | `#fbc093` | Name, headers, accents |
| `--color-terminal-purple` | `#a594f9` | Labels, secondary accent |
| `--color-terminal-text` | `#d1d1e0` | Standard text |
| `--color-terminal-green` | `#a6e3a1` | Success indicators |
| `--color-terminal-blue` | `#89b4fa` | Links, tech tags |

**Font:** JetBrains Mono (Google Fonts)

## 🗂️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Theme tokens, animations, scrollbar styles
│   ├── layout.tsx           # Root layout with JetBrains Mono font
│   └── page.tsx             # Main page
├── components/
│   ├── Terminal/
│   │   ├── ASCIIHeader.tsx   # Dashboard view (ASCII art + grid layout)
│   │   ├── CommandInput.tsx  # Input with blinking cursor & history
│   │   ├── SkillBars.tsx     # Animated expertise bars
│   │   ├── ProjectCards.tsx  # Project showcase cards
│   │   └── ClientGrid.tsx    # Client list grid
│   ├── sections/
│   │   ├── TerminalWindow.tsx       # Main terminal container & command router
│   │   └── AntigravityBackground.tsx # Purple/blue gradient background
│   └── ui/
│       ├── Cursor.tsx        # Custom cursor (optional)
│       └── SmoothScroll.tsx  # Lenis smooth scroll (optional)
├── hooks/
│   └── useTerminal.ts       # Terminal state management hook
└── lib/
    └── constants.ts         # ASCII art, projects, clients, skills data
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Vaibhavraghav108/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **UI Library:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev)
- **Font:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## 📦 Available Commands

| Command | Description |
|---------|------------|
| `/about` | Bio and background info |
| `/work` | Selected project showcase |
| `/clients` | Client database |
| `/skills` | Animated expertise bars + tools |
| `/contact` | Email, phone, socials |
| `/help` | List all available commands |
| `/clear` | Clear terminal history |
| `ls` | List navigation files |
| `whoami` | Current user |
| `date` | Current date/time |
| `pwd` | Working directory |
| `echo <text>` | Echo back text |
| `sudo` | 🚫 Nice try |

## 🌐 Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vaibhavraghav108/Portfolio)

## 📄 License

MIT License — feel free to use this as a template for your own portfolio.

---

<p align="center">
  Built with ☕ and terminal vibes
</p>
