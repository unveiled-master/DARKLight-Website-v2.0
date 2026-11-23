# CSS Modules Migration Design

## Goal

Replace the app's Tailwind CSS styling with CSS Modules throughout every TSX file in the repository while preserving the current visual design, responsive behavior, and interactions.

## Scope

- Migrate every `.tsx` file, including unrouted pages and JSX fragments in `constants.tsx`.
- Give each TSX file one matching CSS Module in a sibling `styles` directory. For example, `components/Header.tsx` uses `components/styles/Header.module.css`; root-level TSX files use `styles/<Name>.module.css`.
- Remove the Tailwind CDN/configuration from `index.html` and replace page-wide defaults and theme tokens with a root global stylesheet.
- Keep Vite's built-in CSS Modules support; do not add a styling dependency.

## Approach

Use component- and page-local CSS Modules with descriptive, locally scoped class names. Put only shared design tokens, reset rules, typography defaults, selection styles, and scrollbar styles in the global stylesheet. Preserve responsive breakpoints, interaction states, animations, and conditional state styling in the corresponding module. Keep CSS Modules adjacent to the `styles` folder convention already used by the carousel and downloads styles.

## Acceptance Criteria

- Every TSX file imports its corresponding CSS Module.
- No Tailwind CDN, Tailwind utility dependency, or Tailwind configuration remains in the app.
- Existing layouts and responsive behavior are represented in CSS Modules and global CSS.
- Dynamic class changes for navigation, carousel, dialogs, and other interactive UI continue to work.
- No unrelated behavior or content changes are included.

## Validation

Review the source for remaining Tailwind usage and confirm the TypeScript/JSX imports reference existing module files. Do not add or run tests as part of the migration unless requested.
