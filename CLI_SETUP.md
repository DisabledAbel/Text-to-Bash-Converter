# Tech to Bash Converter CLI

A command-line interface for converting code snippets to formatted bash code blocks.

## Setup Instructions

### 1. Create a new directory for the CLI

```bash
mkdir tech-to-bash-cli
cd tech-to-bash-cli
```

### 2. Initialize npm project

```bash
npm init -y
```

### 3. Install dependencies

```bash
npm install commander chalk
```

### 4. Create the CLI file

Create a file named `cli.js` with the content provided below.

### 5. Make it executable

Add to your `package.json`:

```json
{
  "name": "tech-to-bash-cli",
  "version": "1.0.0",
  "bin": {
    "tech2bash": "./cli.js"
  },
  "type": "module"
}
```

### 6. Link globally (for local development)

```bash
npm link
```

### 7. Usage

```bash
# Convert from stdin
echo "npm install react" | tech2bash

# Convert from file
tech2bash -f input.txt

# Specify output format
echo "const x = 5" | tech2bash -o typescript

# Copy to clipboard (requires xclip on Linux or pbcopy on macOS)
echo "npm install" | tech2bash -c

# Save to file
echo "npm install" | tech2bash -s output.md
```

## CLI Code (cli.js)

See the `cli.js` file in this directory.

## Available Output Formats

- `bash` (default)
- `typescript`
- `javascript`
- `python`
- `markdown`

## Publishing to npm (Optional)

1. Create an account on npmjs.com
2. Login: `npm login`
3. Publish: `npm publish`

## Examples

```bash
# Basic usage
echo "npm install lodash" | tech2bash

# Multiple lines
cat << 'EOF' | tech2bash
npm install react
npm install typescript
npm run build
EOF

# From file with custom format
tech2bash -f commands.txt -o python -s output.md
```
