# Design System Document: The Obsidian Map Philosophy

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"
This design system is built on the concept of **The Digital Curator**. Unlike standard map applications that feel like utility tools, this system treats the city as a dark gallery and its events as premium exhibits. We move beyond "interface" into "atmosphere."

The visual language rejects the traditional rigid grid in favor of **Intentional Asymmetry and Tonal Depth**. We achieve an "Editorial" feel by using expansive whitespace (Scale 16, 20, 24) to frame map elements as if they were art pieces. Overlapping glass containers and floating action layers create a sense of discovery, suggesting that the city has layers hidden beneath its surface.

---

## 2. Colors

The palette is rooted in deep, light-absorbing foundations (`surface` #0a0e14) contrasted against high-energy neon pops (`secondary` #00f4fe and `tertiary` #ff51fa).

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or structural division. Layout boundaries must be defined through background color shifts. Use `surface-container-low` (#0f141a) to sit on a `surface` background. If you need to separate content, use Spacing Scale 8 (2.75rem) or a shift to `surface-bright` (#262c36).

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass.
*   **Base:** `surface` (#0a0e14)
*   **Nesting Level 1:** `surface-container` (#151a21) for primary sidebars.
*   **Nesting Level 2:** `surface-container-high` (#1b2028) for floating map overlays.
*   **Nesting Level 3:** `surface-container-highest` (#20262f) for active states and modals.

### The "Glass & Gradient" Rule
To evoke exclusivity, floating elements should use **Glassmorphism**. Apply `surface-container-highest` at 60% opacity with a 20px-30px backdrop-blur. 
*   **Signature Textures:** Main CTAs must use a subtle gradient transitioning from `primary` (#ca98ff) to `primary-container` (#c185ff) at a 135-degree angle. This provides a "glow" that flat colors cannot replicate.

---

## 3. Typography

The system utilizes a dual-font strategy to balance authority with modern readability.

*   **Display & Headline (Manrope):** Chosen for its geometric precision and premium weight. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero event titles to create a high-fashion editorial look.
*   **Body & Label (Inter):** The workhorse for the map interface. `body-md` (0.875rem) provides maximum clarity against dark backgrounds. Use `label-sm` (0.6875rem) in all-caps with 0.05em tracking for secondary metadata (e.g., event categories).

**Hierarchy Principle:** Typography is used to "anchor" the floating glass elements. High contrast between `on-surface` (#f1f3fc) and `on-surface-variant` (#a8abb3) is essential to guide the eye without adding visual clutter.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is achieved by "stacking" tonal tiers. Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "recessed" or "lifted" effect.

### Ambient Shadows
Shadows are never black. They are a tinted "glow" of the background.
*   **Floating Elements:** Blur: 40px | Opacity: 6% | Color: `primary` (#ca98ff).
*   **Map Pins:** Blur: 12px | Opacity: 15% | Color: #000000.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use a **Ghost Border**:
*   **Token:** `outline-variant` (#44484f) at 20% opacity. 
*   **Prohibition:** Never use 100% opaque, high-contrast borders.

### Glassmorphism & Depth
All map overlays must feel integrated. Use backdrop blurs to allow the `secondary` neon accents of the map markers to bleed through the `surface-container` tiers, softening the layout's edges.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary-container`), Rounded Scale `full`, `title-sm` typography. High-glow shadow on hover.
*   **Secondary:** Ghost Border style. No background fill. `on-surface` text.
*   **Tertiary:** No border, no background. Use `secondary` (#00f4fe) for text to signify a "Neon Action."

### Glass Cards (Event Cards)
*   **Style:** `surface-container-high` at 70% opacity, backdrop-blur 16px.
*   **Roundedness:** `xl` (1.5rem) for a sophisticated, soft feel.
*   **Spacing:** Internal padding of `4` (1.4rem).
*   **Prohibition:** No divider lines. Use `body-sm` metadata colors to separate title from description.

### Input Fields (Search)
*   **Style:** `surface-container-lowest` background. 
*   **Shape:** `full` (pill-shaped) to contrast against the sharp map geometry.
*   **State:** On focus, transition border to `primary` (#ca98ff) at 40% opacity.

### Additional Signature Component: "The Pulse Pin"
For active map events, use a `tertiary` (#ff51fa) core with a radiating semi-transparent circle that pulses using the `tertiary_fixed_dim` color. This acts as the platform's signature visual identifier.

---

## 6. Do's and Don'ts

### Do
*   **Do** use generous vertical whitespace (`Spacing 12+`) between disparate content blocks.
*   **Do** lean into the "Deep Navy" base. The `background` (#0a0e14) should feel infinite.
*   **Do** use `secondary` (#00f4fe) for technical data points like coordinates or time-stamps.

### Don't
*   **Don't** use pure white (#ffffff) for text. Always use `on-surface` (#f1f3fc) to reduce eye strain in dark mode.
*   **Don't** use standard `0.5rem` rounding for main containers; it feels "default." Use `xl` (1.5rem) or `full`.
*   **Don't** allow map labels to compete with UI labels. Use a custom map style that dims map-labels when UI overlays are active.
*   **Don't** use standard 1px dividers. Use a 10px vertical gap instead.