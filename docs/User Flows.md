The thinking about how we structure linking throughout the docs.

# New user

This is a range of people, but it covers someone who has just started programming to an experienced programmer who is interested in understanding a new language.
For them, the TypeScript website is exploratory.

## On desktop

On a desktop, you're doing deeper learning usually, with a specific goal in mind.

Four main user goals:

- Understand what TypeScript is
- Try TypeScript
- Install TypeScript
- Learn the language

#### Understand

- Homepage
- Homepage Footer -> Why TypeScript
- Homepage -> Handbook

#### Install

- Homepage Header -> Download
- Homepage -> Install Locally -> Download

#### Try

- Homepage -> Try it out -> Examples -> Install -> Playground
- Homepage -> Install Locally -> Tutorials -> Install -> Playground
- Homepage -> Learn

#### Learn

- Homepage -> Learn

## On Mobile

On mobile the first user experience is oriented towards shallow learning ('what is this typescript thing?' and learning enough to know that you'd want to come back with an IDE)

Two main user goals:

- Understand what TypeScript is
- Learn a bit of the language

#### Understand

- Homepage
- Homepage -> Why TypeScript

#### Learn

- Homepage -> Download -> Learn
- Homepage -> Learn

# Existing User

This is a narrower range of people, representing someone with a bit of confidence in their TypeScript knowledge and are coming back to the website as a reference tool.

## On desktop

Three main user goals:

- Improve my knowledge on TypeScript
- Get to a specific bit of information I'm looking for
- Work on and share code

User routes:

- Homepage -> Download -> Learn
- Homepage -> Learn

#### Finding Information

Entry points:

- Search via search engines (handled by SEO, titles, headers, head metadata, HTML5 attributes, JSON schemas)
- Search via in-site search
- Navigation route from home to specific handbook

#### Sharing Code

User routes:

- Homepage "try button"
- Homepage -> Playground
- Homepage -> Tools -> Playground
- Homepage Footer -> Code Samples -> Playground

## Mobile

Two main user goals:

- Improve my knowledge on TypeScript
- Get to a specific bit of information I'm looking for

Homepage -> Learn

# Automated migration coverage

The Astro migration keeps these product journeys executable in `packages/typescriptlang-org-astro/browser/m14.spec.mjs` on desktop Chrome and a Pixel 7 viewport:

- **Install:** home → Download → a visible installation heading.
- **Try:** home → Playground → the real Playground application container.
- **Learn:** home → Documentation → the documentation landing page.
- **Find information:** documentation page → deterministic DocSearch result → a same-origin handbook URL; keyboard users can move through results with arrow keys.
- **Localized learning:** a Japanese Download route with a French browser preference → an offered, existing French Download route; dismissal persists across reloads. Links use a translated route only when that exact route exists and otherwise retain the English destination.
- **Mobile reference:** documentation → open the sidebar → focus the first navigation link → move with arrow keys → close with Escape and return focus to the toggle.
- **Settings and privacy:** select dark theme and Consolas → reload → both choices remain applied before interaction; the Microsoft WCP consent API initializes against the `cookie-banner` host.

The deterministic search fixture proves focus, URL rewriting, and result selection without depending on Algolia. A separate ten-second network smoke checks that the exact DocSearch v2 CDN runtime is downloadable; it does not claim that Algolia indexing or query service availability is deterministic.
