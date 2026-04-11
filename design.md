# Design Specification: Interactive Wrangler Wizard

## 1. Design Philosophy
- **Clean, developer‑first** – Minimal distractions, maximum readability.
- **Trustworthy** – Use familiar terminal/IDE aesthetics (monospace for code).
- **Accessible** – High contrast, focus indicators, responsive.

---

## 2. Layout & Dimensions

### 2.1 Page Container
- **Max width**: 1280px (centered with `mx-auto`)
- **Horizontal padding**: 1.5rem on mobile, 2rem on desktop (`px-6 md:px-8`)
- **Vertical spacing**: `py-8 md:py-12`

### 2.2 Header
- **Logo/Title**: Left aligned, size 1.875rem (30px) on mobile, 2.25rem (36px) on desktop.
- **Tagline**: Below title, size 1rem, opacity 0.7.
- **Margin bottom**: 2rem (`mb-8`)

### 2.3 Input Area
- **Textarea**:
  - Width: 100%
  - Height: 160px (mobile), 180px (desktop)
  - Padding: 1rem (`p-4`)
  - Border radius: 0.75rem (`rounded-xl`)
  - Font size: 1rem (`text-base`)
  - Font family: system UI (Inter, -apple-system, etc.)
  - Background: `#0f0f0f` (dark) or `#fafafa` (light) – see colors section.
- **Generate Button**:
  - Padding: 0.75rem 2rem (`py-3 px-8`)
  - Font weight: 600 (`font-semibold`)
  - Border radius: 2rem (`rounded-full`)
  - Margin top: 1rem (`mt-4`)

### 2.4 Output Panels (Desktop: side‑by‑side, Mobile: stacked)
- **Breakpoint**: `md:` (768px) for side‑by‑side.
- **Each panel**:
  - Width: 50% (desktop), 100% (mobile)
  - Padding: 1.25rem (`p-5`)
  - Border radius: 1rem (`rounded-2xl`)
  - Background: slightly different from main background (e.g., `#111` on dark, `#f5f5f5` on light).
  - Margin: 0.5rem gap (`gap-4` via flex/grid)

#### Panel Header
- **Title** (e.g., “📄 wrangler.jsonc”): font size 1.125rem, font weight 600, margin bottom 0.75rem.
- **Copy button**: positioned top‑right of the panel (inline with title). Icon only (📋) + tooltip.

#### Panel Content (Code Block)
- **Background**: `#1e1e1e` (VS Code dark) regardless of theme – because code looks best on dark.
- **Font**: `'Fira Code', 'Monaco', 'Cascadia Code', monospace`
- **Font size**: 0.875rem (`text-sm`)
- **Line height**: 1.5
- **Padding**: 1rem
- **Border radius**: 0.5rem (`rounded-lg`)
- **Overflow**: `overflow-auto`, max height 400px, scrollable.
- **White space**: `pre-wrap` and `break-words`.

### 2.5 Download Button
- Below the code panel (or next to copy button).
- Secondary style: outline or ghost button.
- Icon: ⬇️ + “Download .jsonc”.

---

## 3. Color Palette (Default: Dark Mode First)

Because developers love dark mode, we default to dark. A light mode toggle is optional for MVP.

### Dark Theme (default)
| Element                     | Color (Hex)   | Tailwind class          |
|-----------------------------|---------------|-------------------------|
| Page background             | `#0a0a0a`     | `bg-neutral-950`        |
| Card / panel background     | `#121212`     | `bg-neutral-900`        |
| Textarea background         | `#1a1a1a`     | `bg-neutral-800`        |
| Text primary                | `#ededed`     | `text-neutral-100`      |
| Text secondary (tagline)    | `#a3a3a3`     | `text-neutral-400`      |
| Code block background       | `#1e1e1e`     | (custom, not in default)|
| Button primary background   | `#f97316`     | `bg-orange-500`         |
| Button primary hover        | `#ea580c`     | `hover:bg-orange-600`   |
| Button primary text         | `#ffffff`     | `text-white`            |
| Border (cards, textarea)    | `#262626`     | `border-neutral-800`    |

### Light Theme (optional – can be added later)
| Element                     | Color (Hex)   |
|-----------------------------|---------------|
| Page background             | `#ffffff`     |
| Card background             | `#f8f8f8`     |
| Textarea background         | `#ffffff`     |
| Text primary                | `#111111`     |
| Code block background       | `#f5f5f5` (with dark text) |

---

## 4. Typography

### System Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;



Code Font Stack
css
font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
Font Sizes (using Tailwind v4 scale)
Element	Mobile size	Desktop size	Tailwind class
Page title	30px	36px	text-3xl md:text-4xl
Tagline	16px	16px	text-base
Label (input)	14px	14px	text-sm
Button text	16px	16px	text-base
Panel title	18px	18px	text-lg
Code	14px	14px	text-sm
5. Spacing System (Tailwind defaults)
Use space-y-{n} for vertical rhythm.

Base unit: 0.25rem (4px).
Example: p-4 = 1rem padding, gap-6 = 1.5rem gap.

Key distances
Between header and input: mb-8

Between input and generate button: mt-4

Between generate button and output panels: mt-8

Between two output panels: gap-4 (using flex or grid)

6. Interactive States
Button
Default: orange background, white text, rounded-full.

Hover: darker orange, slight scale? No, keep scale for stability. Use shadow instead.

Disabled: opacity 0.5, cursor not-allowed, no hover effect.

Textarea
Focus: ring-2 ring-orange-500/50, border-transparent.

Invalid: red border + error message below.

Copy Button
Icon only (📋). Hover: background neutral-700 (dark) or neutral-200 (light).

After click: icon changes to ✅ for 2 seconds, then reverts.

Loading Spinner
SVG circular spinner, orange colour, 24x24px.

Position: inline inside the button (replaces text “Generating…”).

7. Responsive Behaviour
Breakpoint	Layout change
< 768px	Stack panels vertically (input → button → config panel → commands panel).
≥ 768px	Two columns: left = input + button, right = output panels stacked? Actually better: input+button at top, then two columns below for config and commands.
≥ 1024px	Same as 768px, but wider gutters.
Detailed responsive layout for MVP:

text
┌─────────────────────────────────────┐
│  Header                              │
├─────────────────────────────────────┤
│  Textarea (full width)               │
│  [Generate] button                   │
├───────────────┬─────────────────────┤
│ Config panel  │ Commands panel       │ (≥768px)
│ (code block)  │ (code block)         │
└───────────────┴─────────────────────┘
On mobile, the two panels appear one after the other.

8. Animations (Subtle)
Fade in for generated output: transition-opacity duration-300.

Spinner rotation: animate-spin.

Button hover: transition-colors duration-200.

9. Accessibility (WCAG 2.1 AA)
Colour contrast: Orange button on dark background has ratio > 4.5:1.

Focus indicators: Outline ring-2 ring-offset-2 ring-orange-500.

Screen reader labels:

Copy button: aria-label="Copy configuration to clipboard"

Generate button: aria-label="Generate wrangler configuration"

Keyboard navigation: Tab order: textarea → Generate → Copy buttons → Download.

10. Example Visual Mockup (ASCII)
text
+----------------------------------------------------------+
|  🔧 WRANGLER WIZARD                                      |
|  Describe your Cloudflare project in plain English       |
+----------------------------------------------------------+
|  [Textarea: "I want a Worker with a D1 database..."]     |
|                                                          |
|  [              GENERATE                ] (orange pill)  |
+---------------------------+------------------------------+
|  📄 wrangler.jsonc   [📋]  |  💻 Commands          [📋]   |
|  -----------------------  |  -----------------------    |
|  {                         |  npx wrangler d1 create ...  |
|    "name": "my-worker",    |  npx wrangler deploy         |
|    "d1_databases": [...]   |                              |
|  }                         |                              |
|  [⬇️ Download .jsonc]       |                              |
+---------------------------+------------------------------+
11. Implementation Notes for Tailwind v4
Use @tailwind base; @tailwind components; @tailwind utilities; in globals.css.

Enable dark mode via darkMode: 'class' or use system preference – but MVP can force dark with dark class on <html>.

For custom code block background, use a utility class like bg-[#1e1e1e].

