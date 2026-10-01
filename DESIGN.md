# GymOS — Design System & UI Token Specification

> **Theme**: Professional White & Hubstaff Blue Theme (`#F2F8FF` / `#253053` / `#0000EE` / `#FFFFFF`)  
> **Font Stack**: Poppins, Arial, sans-serif  
> **Surface Type**: SaaS Admin Management Dashboard  

---

## 1. Design Tokens & Palette

Every visual decision in GymOS strictly maps to the established design system tokens:

### 1.1 Color Tokens
| Token | Hex Value | Role in GymOS Dashboard | Tailwind Utility Mapping |
| :--- | :--- | :--- | :--- |
| `color-6` | `#F2F8FF` | **App Background Canvas** (Crisp soft ice-blue tint) | `bg-[#F2F8FF]` / `bg-canvas` |
| `color-7` | `#FFFFFF` | **Card & Modal Surface / White Text** | `bg-white` / `text-white` |
| `color-5` | `#DFDFDF` | **Subtle Secondary Surface / Divider** | `bg-[#DFDFDF]` / `border-[#DFDFDF]` |
| `color-4` | `#C6C6DD` | **Card Border / Input Outlines** | `border-[#C6C6DD]` / `border-token` |
| `color-1` | `#253053` | **Primary Text & Headings / Brand Navy** | `text-[#253053]` / `bg-[#253053]` |
| `color-2` | `#0000EE` | **Primary Action & CTA Blue / Active Nav** | `text-[#0000EE]` / `bg-[#0000EE]` |
| `color-3` | `#636B83` | **Secondary & Muted Text / Subtitles** | `text-[#636B83]` |

### 1.2 Functional Status Badges (Harmonized)
| Status | Background | Text | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Active / Paid** | `#ECFDF5` | `#047857` | `#A7F3D0` | Active member, Paid transaction, Checked in |
| **Expiring Soon** | `#FFFBEB` | `#B45309` | `#FDE68A` | Expiring in $\le 7$ days, Pending payment |
| **Overdue / Suspended**| `#FEF2F2` | `#B91C1C` | `#FECACA` | Overdue fee, Expired plan, Restrict access |
| **WhatsApp Action** | `#DCFCE7` | `#15803D` | `#86EFAC` | Direct 1-Click WhatsApp Followup CTA |

---

## 2. Typography Token Scale

**Font Family**: `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`

| Level | Size | Line Height | Weight | Application |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | `13px` | `18px` | `400 / 600` | Badges, timestamps, helper labels |
| `text-sm` | `16px` | `24px` | `400 / 600` | Table content, navigation items, buttons |
| `text-base` | `20px` - `24px` | `32px` | `600` | Card titles, section headers, dialog titles |
| `text-lg` | `32px` - `41px`| `48px` - `52px` | `600` | KPI metrics, revenue numbers, page hero title |

---

## 3. Spacing Scale

Base unit: **4px**

- `space-1`: 2px
- `space-2`: 4px
- `space-3`: 6px
- `space-4`: 8px (`p-2` / `gap-2`)
- `space-6`: 12px (`p-3` / `gap-3`)
- `space-8`: 16px (`p-4` / `gap-4`)
- `space-10`: 20px (`p-5`)
- `space-12`: 24px (`p-6` / `gap-6`)
- `space-13`: 32px (`p-8` / `gap-8`)
- `space-14`: 48px
- `space-15`: 64px

---

## 4. Shapes & Border Radius

- `radius-sm`: **12px** (`rounded-xl`) — Inputs, select dropdowns, inner chips
- `radius-md`: **16px** (`rounded-2xl`) — Standard Dashboard cards, modals, table containers
- `radius-lg`: **32px** (`rounded-3xl`) — Large hero callout banners, pill action triggers
- `radius-full`: **50%** / **9999px** — Member avatars, status indicators, pill tags

---

## 5. Elevation & Shadows

- `shadow-sm`: `0 1px 2px 0 rgba(37, 48, 83, 0.05)` (Subtle card base)
- `shadow-md`: `0 4px 12px 0 rgba(37, 48, 83, 0.08)` (Dropdowns, hover card states)
- `shadow-lg`: `0 12px 32px 0 rgba(37, 48, 83, 0.12)` (Modals, Profile slide-over drawer)

---

## 6. Layout & Screen Anatomies

### 6.1 Persistent Sidebar
- **Background**: `color-7` (`#FFFFFF`) with right border `color-4` (`#C6C6DD`).
- **Brand Logo**: `GYMOS` in `color-1` (`#253053`) with `color-2` (`#0000EE`) accent dot.
- **Active Navigation**:
  - Container: `bg-[#F2F8FF]` (`color-6`)
  - Left border indicator: `3px solid #0000EE` (`color-2`)
  - Text & Icon: `#0000EE` (`color-2`, `font-semibold`)
- **Inactive Navigation**:
  - Text: `#636B83` (`color-3`)
  - Hover state: `bg-[#F8FAFC]` with text `#253053` (`color-1`)

### 6.2 Top Navigation Bar
- **Background**: `color-7` (`#FFFFFF`) with bottom border `color-4` (`#C6C6DD`).
- **Global Search**: Input box with `border-[#C6C6DD]`, placeholder in `#636B83`, focus ring `#0000EE`.
- **Gym Profile & Date Filter**: Clean dropdown chips with subtle `#C6C6DD` borders.

### 6.3 KPI Metric Cards
- **Card Background**: `color-7` (`#FFFFFF`)
- **Border**: `1px solid #C6C6DD` (`color-4`), radius `16px` (`radius-md`).
- **Metric Label**: `text-[#636B83]` (`color-3`), `text-xs` uppercase tracking-wide.
- **Stat Value**: `text-[#253053]` (`color-1`), `text-3xl` bold tabular figures.
- **Trend Chip**: Light tint container with percentage delta and trend icon.

### 6.4 Primary & Secondary Action Buttons
- **Primary Action (CTA)**:
  - Background: `color-2` (`#0000EE`)
  - Text: `color-7` (`#FFFFFF`)
  - Radius: `12px` (`radius-sm`)
  - Hover: `bg-[#0000C8]` with transition `all 0.2s ease`
- **Secondary Action (Outline)**:
  - Background: `color-7` (`#FFFFFF`)
  - Border: `1px solid #C6C6DD` (`color-4`)
  - Text: `color-1` (`#253053`)
  - Hover: `bg-[#F2F8FF]`
- **WhatsApp Action Button**:
  - Background: `#DCFCE7`
  - Border: `1px solid #86EFAC`
  - Text: `#15803D`
  - Icon: WhatsApp Phone / Message icon

---

## 7. Component Guidelines & Anti-patterns

### ✅ Do
- Use `#253053` for headings and high-contrast text.
- Use `#636B83` for supporting metadata and secondary copy.
- Use `#0000EE` as the primary interaction color (buttons, active tabs, selected states).
- Use `#F2F8FF` as the background canvas color for the entire admin panel.
- Adhere strictly to the `12px` / `16px` / `32px` border radius scale.

### ❌ Don't
- Do not introduce random neon greens, dark blacks, or unapproved shades outside this palette.
- Do not use raw hardcoded pixel padding outside the 4px base spacing scale.
- Do not use dark mode backgrounds — GymOS is designed for clean white-and-blue SaaS presentation.
