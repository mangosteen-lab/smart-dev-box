## ADDED Requirements

### Requirement: UUID generator
The system SHALL provide a tool to generate one or more UUID v4 strings.

#### Scenario: Single UUID generated
- **WHEN** the user selects UUID Generator and clicks Run
- **THEN** the output SHALL contain one newly generated UUID v4 string

#### Scenario: Bulk UUID generation
- **WHEN** the user specifies a count (e.g. 10) and clicks Run
- **THEN** the output SHALL contain the specified number of UUID v4 strings, one per line

### Requirement: Hash generator
The system SHALL provide a tool to compute MD5, SHA-1, SHA-256, and SHA-512 hashes of the input string.

#### Scenario: Hash computed
- **WHEN** the user provides input text and selects Hash Generator
- **THEN** the output SHALL display the MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously

### Requirement: Lorem ipsum generator
The system SHALL provide a tool to generate placeholder Lorem Ipsum text with configurable word, sentence, or paragraph count.

#### Scenario: Paragraph generation
- **WHEN** the user specifies 3 paragraphs and clicks Run
- **THEN** the output SHALL contain 3 paragraphs of Lorem Ipsum text
