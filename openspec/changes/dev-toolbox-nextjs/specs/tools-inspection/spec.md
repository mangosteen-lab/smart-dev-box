## ADDED Requirements

### Requirement: Regex tester
The system SHALL provide a tool to test a regular expression against input text and highlight all matches.

#### Scenario: Matches highlighted
- **WHEN** the user provides a regex pattern and input text
- **THEN** the output SHALL list all matches with their positions
- **AND** matched portions SHALL be visually highlighted in the input preview

#### Scenario: Invalid regex
- **WHEN** the user provides an invalid regex pattern
- **THEN** the tool SHALL display a descriptive error message

### Requirement: Text diff viewer
The system SHALL provide a tool to compute and display a diff between two text inputs.

#### Scenario: Diff displayed
- **WHEN** the user provides two text blocks (original and modified)
- **THEN** the output SHALL display an inline or side-by-side diff with added lines in green and removed lines in red

### Requirement: JSON path evaluator
The system SHALL provide a tool to evaluate a JSONPath expression against a JSON input and return the matching values.

#### Scenario: JSONPath match returned
- **WHEN** the user provides valid JSON and a JSONPath expression (e.g. `$.store.book[*].author`)
- **THEN** the output SHALL display the matching values as a JSON array

#### Scenario: No match
- **WHEN** the JSONPath expression does not match any node
- **THEN** the output SHALL return an empty array and a "No matches found" message
