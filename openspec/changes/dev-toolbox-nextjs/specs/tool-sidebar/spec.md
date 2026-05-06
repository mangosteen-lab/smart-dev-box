## ADDED Requirements

### Requirement: Collapsible tool sidebar
The system SHALL render a sidebar listing all registered tools, grouped by category, with a toggle button to collapse or expand it.

#### Scenario: Sidebar collapses on toggle
- **WHEN** the user clicks the sidebar toggle button
- **THEN** the sidebar SHALL collapse to a narrow icon rail, preserving space for the main content area

#### Scenario: Collapsed state persists
- **WHEN** the user collapses the sidebar and refreshes the page
- **THEN** the sidebar SHALL remain collapsed

### Requirement: Tool search in sidebar
The system SHALL provide a search/filter input at the top of the sidebar that filters the tool list in real-time.

#### Scenario: Search filters tools
- **WHEN** the user types "base" in the sidebar search box
- **THEN** only tools whose name, description, or keywords contain "base" SHALL be visible

### Requirement: Tool selection from sidebar
The system SHALL allow the user to click any tool in the sidebar to set it as the active tool, bypassing auto-detection.

#### Scenario: Manual tool selection
- **WHEN** the user clicks a tool in the sidebar
- **THEN** the active tool SHALL be set to the selected tool
- **AND** if input is present, the tool SHALL execute immediately and display output
