## ADDED Requirements

### Requirement: Tool registry
The system SHALL maintain a central registry of all available tools, where each tool exports a `ToolDefinition` object with fields: `id`, `name`, `category`, `description`, `detect`, `execute`, and `keywords`.

#### Scenario: Tool registration
- **WHEN** the application initializes
- **THEN** all tools in the registry SHALL be loaded and available for detection and execution

### Requirement: Tool execution pipeline
The system SHALL execute a tool by calling its `execute` function with the current input and optional options, and return a `ToolResult` object containing output string, output language hint, and optional error.

#### Scenario: Successful tool execution
- **WHEN** the user triggers a tool with valid input
- **THEN** the tool's `execute` function SHALL be called and its result passed to the output panel

#### Scenario: Tool execution error
- **WHEN** a tool's `execute` function throws or returns an error
- **THEN** the output panel SHALL display the error message clearly, without crashing the application

### Requirement: Tool categories
The system SHALL group tools into the following categories: Encoding/Decoding, Formatting, Conversion, Generation, Inspection.

#### Scenario: Sidebar grouping
- **WHEN** the sidebar is rendered
- **THEN** tools SHALL be grouped under their respective category headings
