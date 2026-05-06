## ADDED Requirements

### Requirement: Unix timestamp converter
The system SHALL provide a tool to convert between Unix timestamps (seconds or milliseconds) and human-readable date-time strings, and vice versa.

#### Scenario: Timestamp to human date
- **WHEN** the user provides a Unix timestamp integer
- **THEN** the output SHALL display the corresponding UTC and local date-time strings

#### Scenario: Human date to timestamp
- **WHEN** the user provides a date-time string (e.g. "2024-01-15 10:30:00")
- **THEN** the output SHALL display the corresponding Unix timestamp in both seconds and milliseconds

#### Scenario: Current time shortcut
- **WHEN** the user clicks "Now"
- **THEN** the input SHALL be populated with the current Unix timestamp

### Requirement: Color format converter
The system SHALL provide a tool to convert colors between HEX, RGB, HSL, and HSV formats.

#### Scenario: HEX to RGB
- **WHEN** the user provides a HEX color string (e.g. "#ff5733")
- **THEN** the output SHALL include the RGB, HSL, and HSV equivalents

### Requirement: Number base converter
The system SHALL provide a tool to convert integers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16).

#### Scenario: Decimal to all bases
- **WHEN** the user provides a decimal integer
- **THEN** the output SHALL display the number in binary, octal, decimal, and hexadecimal
