## ADDED Requirements

### Requirement: Base64 encode and decode
The system SHALL provide tools to encode arbitrary text to Base64 and decode Base64 strings back to text.

#### Scenario: Encode to Base64
- **WHEN** the user selects "Base64 Encode" and provides plain text input
- **THEN** the output SHALL be the Base64-encoded representation of the input

#### Scenario: Decode from Base64
- **WHEN** the user selects "Base64 Decode" and provides a valid Base64 string
- **THEN** the output SHALL be the decoded plain text

#### Scenario: Invalid Base64 input
- **WHEN** the input is not valid Base64
- **THEN** the tool SHALL return an error message indicating the input is not valid Base64

### Requirement: URL encode and decode
The system SHALL provide tools to percent-encode a string for use in URLs and to decode percent-encoded strings.

#### Scenario: URL encode
- **WHEN** the user selects "URL Encode" with a string containing special characters
- **THEN** the output SHALL be the percent-encoded version of the input

#### Scenario: URL decode
- **WHEN** the user selects "URL Decode" with a percent-encoded string
- **THEN** the output SHALL be the decoded plain text

### Requirement: JWT inspector
The system SHALL provide a tool to decode and display the header, payload, and signature of a JWT token.

#### Scenario: JWT decoded
- **WHEN** the user pastes a valid JWT string
- **THEN** the output SHALL display the decoded header and payload as formatted JSON, and note the signature (unverified)

#### Scenario: Invalid JWT
- **WHEN** the input is not a valid JWT
- **THEN** the tool SHALL return an error message

### Requirement: HTML entity encode and decode
The system SHALL provide tools to encode special HTML characters to entities and decode HTML entities back to characters.

#### Scenario: HTML encode
- **WHEN** the user provides text containing `<`, `>`, `&`, `"`, `'`
- **THEN** the output SHALL replace those characters with their HTML entity equivalents

#### Scenario: HTML decode
- **WHEN** the user provides text containing HTML entities
- **THEN** the output SHALL replace entities with their character equivalents
