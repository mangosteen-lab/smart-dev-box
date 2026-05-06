.PHONY: dev test build lint install clean

# Start the development server (binds to 0.0.0.0 for remote access)
dev:
	npm run dev

# Run production server (requires build first, binds to 0.0.0.0)
start: build
	npm run start

# Lint the codebase
lint:
	npm run lint

# Install dependencies
install:
	npm install

# Remove build artifacts and node_modules
clean:
	rm -rf .next node_modules

# Install dependencies and run dev server
setup: install dev
