## ADDED Requirements

### Requirement: Syntax-highlighted output display
The system SHALL display tool output in a syntax-highlighted read-only code block using Shiki, with the language inferred from the tool's `ToolResult.outputLanguage` field.

#### Scenario: JSON output highlighted
- **WHEN** a JSON formatting tool completes
- **THEN** the output SHALL be displayed with JSON syntax highlighting

#### Scenario: Plain text output
- **WHEN** a tool returns output with no language hint
- **THEN** the output SHALL be displayed as plain monospace text without highlighting errors

### Requirement: Copy and download actions
The system SHALL provide a "Copy" button and a "Download" button on the output panel.

#### Scenario: Copy to clipboard
- **WHEN** the user clicks the Copy button
- **THEN** the full output text SHALL be copied to the system clipboard
- **AND** the button SHALL briefly show a "Copied!" confirmation

#### Scenario: Download output
- **WHEN** the user clicks the Download button
- **THEN** the browser SHALL download a file containing the output text with an appropriate file extension

### Requirement: Multi-tool tabbed output
The system SHALL support displaying results from multiple tools simultaneously in tabs within the output panel.

#### Scenario: Multiple tool results in tabs
- **WHEN** the user runs more than one tool on the same input
- **THEN** each tool's output SHALL appear in a separate tab
- **AND** the user SHALL be able to switch between tabs without re-executing tools

### Requirement: Diff view
The system SHALL provide an optional diff view comparing the original input to the tool output.

#### Scenario: Diff view toggle
- **WHEN** the user clicks the "Diff" button in the output panel
- **THEN** a side-by-side or inline diff SHALL be shown between the input and the output
