## ADDED Requirements

### Requirement: Natural language intent routing
The system SHALL send the user's natural language command and current input to a `/api/ai` route, which SHALL return a structured response containing the recommended `toolId`, optionally corrected input, and a brief explanation.

#### Scenario: Valid command routed to tool
- **WHEN** the user types "decode this base64" and submits
- **THEN** the AI route SHALL return `{ toolId: "base64-decode", correctedInput: null, explanation: "Applying Base64 decode" }`
- **AND** the system SHALL execute the base64-decode tool with the current input

#### Scenario: Malformed input correction
- **WHEN** the user pastes malformed JSON and the AI detects fixable syntax errors
- **THEN** the AI route SHALL return a `correctedInput` with valid JSON
- **AND** the system SHALL show the corrected input as a diff suggestion before applying it

### Requirement: AI indicator
The system SHALL display a subtle visual indicator whenever the output was produced with AI assistance.

#### Scenario: AI badge shown
- **WHEN** the output was generated using AI-corrected input or AI-routed tool selection
- **THEN** a small "AI assisted" chip SHALL be displayed near the output header

### Requirement: Graceful degradation without API key
The system SHALL function fully without an AI API key configured. All AI-powered features SHALL be hidden or disabled when `OPENAI_API_KEY` is not set.

#### Scenario: AI features hidden when no key
- **WHEN** the `OPENAI_API_KEY` environment variable is not set
- **THEN** the natural language command bar SHALL be hidden
- **AND** all tools SHALL remain fully functional via auto-detection and manual selection
