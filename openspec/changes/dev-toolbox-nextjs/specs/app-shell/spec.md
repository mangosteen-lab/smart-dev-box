## ADDED Requirements

### Requirement: App shell renders global layout
The system SHALL render a persistent top navigation bar containing the app logo, app name ("DevBox"), a theme toggle button, and a settings button on every page.

#### Scenario: Default dark theme on first load
- **WHEN** a user visits the app for the first time
- **THEN** the app SHALL render in dark mode by default

#### Scenario: Theme toggle persists across sessions
- **WHEN** the user toggles the theme
- **THEN** the selected theme SHALL be saved to localStorage and restored on next visit

### Requirement: Single-page layout
The system SHALL present all primary functionality (input, detection bar, output panel, sidebar) on a single page without full-page navigation.

#### Scenario: No page reload on tool switch
- **WHEN** the user selects a different tool from the sidebar or detection bar
- **THEN** the active tool SHALL update without a full page reload or route change

### Requirement: Responsive layout
The system SHALL adapt its layout for mobile, tablet, and desktop viewports.

#### Scenario: Mobile stacked layout
- **WHEN** the viewport width is less than 768px
- **THEN** the input and output panels SHALL stack vertically and the sidebar SHALL become a bottom sheet drawer
