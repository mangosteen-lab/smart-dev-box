## ADDED Requirements

### Requirement: Universal text input area
The system SHALL provide a resizable textarea as the primary input area that accepts any text content.

#### Scenario: Input accepts arbitrary text
- **WHEN** a user pastes or types any text into the input area
- **THEN** the text SHALL be accepted and stored in application state without validation errors

#### Scenario: Drag and drop file support
- **WHEN** a user drags and drops a file onto the input area
- **THEN** the file contents SHALL be read and populated into the input area

### Requirement: Auto-detection of content type
The system SHALL automatically detect the content type of the input using heuristic detection functions registered per tool.

#### Scenario: JSON detected
- **WHEN** the user pastes text that is valid or near-valid JSON
- **THEN** the detection bar SHALL display "Detected: JSON" and offer JSON formatting as the primary action

#### Scenario: Base64 detected
- **WHEN** the user pastes a string that matches Base64 character patterns
- **THEN** the detection bar SHALL display "Detected: Base64" and offer decode as the primary action

#### Scenario: Multiple detections ranked
- **WHEN** multiple tool detectors return confidence above 0
- **THEN** the tool with the highest confidence score SHALL be shown as primary, others as secondary options

#### Scenario: No detection
- **WHEN** no tool detector returns confidence above 0.3
- **THEN** the detection bar SHALL display "Unrecognized input — select a tool manually"

### Requirement: Natural language command input
The system SHALL provide a secondary single-line input below the main textarea for natural language commands.

#### Scenario: Command triggers AI routing
- **WHEN** the user types a natural language command (e.g. "convert to base64") and presses Enter or clicks Run
- **THEN** the system SHALL send the command and input to the AI routing layer and apply the result

### Requirement: Input size warning
The system SHALL warn the user when the input exceeds 1MB.

#### Scenario: Large input warning
- **WHEN** the input size exceeds 1,048,576 bytes
- **THEN** the system SHALL display a non-blocking warning banner indicating the input is large and performance may be affected
