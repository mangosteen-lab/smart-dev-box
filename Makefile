.PHONY: dev test test-watch test-e2e test-e2e-ui typecheck check build lint install clean

# Start the development server (binds to 0.0.0.0 for remote access)
dev:
	npm run dev

# Run production server (requires build first, binds to 0.0.0.0)
start: build
	npm run start

# Lint the codebase
lint:
	npm run lint

# Run unit tests
test:
	npm run test

# Run unit tests in watch mode
test-watch:
	npm run test:watch

# Run Playwright smoke tests
test-e2e:
	npm run test:e2e

# Open Playwright's interactive test runner
test-e2e-ui:
	npm run test:e2e:ui

# Run TypeScript without emitting files
typecheck:
	npm run typecheck

# Run the daily local verification suite
check:
	npm run check

# Install dependencies
install:
	npm install

# Remove build artifacts and node_modules
clean:
	rm -rf .next .open-next node_modules

# Install dependencies and run dev server
setup: install dev
