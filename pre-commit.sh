#!/usr/bin/env bash

# PiFlash Pre-commit Hook
# Ensures code quality and consistency before commits

set -euo pipefail

echo "🔍 Running pre-commit checks for PiFlash..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print colored output
print_status() {
    echo -e "${BLUE}[PiFlash]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    print_warning "No staged files found"
    exit 0
fi

print_status "Staged files: $(echo $STAGED_FILES | wc -w)"

# Check 1: Validate HTML files
print_status "Validating HTML files..."
HTML_FILES=$(echo "$STAGED_FILES" | grep -E '\.(html|htm)$' || true)
if [ -n "$HTML_FILES" ]; then
    for file in $HTML_FILES; do
        if [ -f "$file" ]; then
            # Basic HTML validation
            if ! grep -q "<!DOCTYPE html>" "$file"; then
                print_error "Missing DOCTYPE in $file"
                exit 1
            fi
            
            # Check for basic structure
            if ! grep -q "<html" "$file" || ! grep -q "</html>" "$file"; then
                print_error "Invalid HTML structure in $file"
                exit 1
            fi
            
            print_success "HTML validation passed for $file"
        fi
    done
else
    print_status "No HTML files to validate"
fi

# Check 2: Validate CSS files
print_status "Validating CSS files..."
CSS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(css|scss|sass)$' || true)
if [ -n "$CSS_FILES" ]; then
    for file in $CSS_FILES; do
        if [ -f "$file" ]; then
            # Basic CSS syntax check
            if ! node -e "
                const fs = require('fs');
                const css = fs.readFileSync('$file', 'utf8');
                const openBraces = (css.match(/\{/g) || []).length;
                const closeBraces = (css.match(/\}/g) || []).length;
                if (openBraces !== closeBraces) {
                    console.error('Mismatched braces in CSS');
                    process.exit(1);
                }
            " 2>/dev/null; then
                print_error "CSS syntax error in $file"
                exit 1
            fi
            
            print_success "CSS validation passed for $file"
        fi
    done
else
    print_status "No CSS files to validate"
fi

# Check 3: Validate JavaScript files
print_status "Validating JavaScript files..."
JS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx)$' || true)
if [ -n "$JS_FILES" ]; then
    for file in $JS_FILES; do
        if [ -f "$file" ]; then
            # Check for basic syntax using Node.js
            if ! node -c "$file" 2>/dev/null; then
                print_error "JavaScript syntax error in $file"
                exit 1
            fi
            
            # Check for console.log statements (optional warning)
            if grep -q "console\.log" "$file"; then
                print_warning "console.log found in $file - consider removing for production"
            fi
            
            # Check for TODO comments
            if grep -qi "TODO\|FIXME\|HACK" "$file"; then
                print_warning "TODO/FIXME/HACK comments found in $file"
            fi
            
            print_success "JavaScript validation passed for $file"
        fi
    done
else
    print_status "No JavaScript files to validate"
fi

# Check 4: Validate JSON files
print_status "Validating JSON files..."
JSON_FILES=$(echo "$STAGED_FILES" | grep -E '\.(json)$' || true)
if [ -n "$JSON_FILES" ]; then
    for file in $JSON_FILES; do
        if [ -f "$file" ]; then
            if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
                print_error "Invalid JSON in $file"
                exit 1
            fi
            
            print_success "JSON validation passed for $file"
        fi
    done
else
    print_status "No JSON files to validate"
fi

# Check 5: File size limits
print_status "Checking file sizes..."
for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        max_size=1048576  # 1MB in bytes
        
        if [ "$file_size" -gt "$max_size" ]; then
            print_error "File $file is too large ($(($file_size / 1024))KB > 1MB)"
            exit 1
        fi
    fi
done
print_success "File size check passed"

# Check 6: Line ending consistency
print_status "Checking line endings..."
for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        # Check for mixed line endings
        if file "$file" | grep -q "CRLF"; then
            print_warning "CRLF line endings found in $file - consider using LF"
        fi
    fi
done
print_success "Line ending check completed"

# Check 7: Trailing whitespace
print_status "Checking for trailing whitespace..."
WHITESPACE_FILES=""
for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        if grep -q '[[:space:]]$' "$file"; then
            WHITESPACE_FILES="$WHITESPACE_FILES $file"
        fi
    fi
done

if [ -n "$WHITESPACE_FILES" ]; then
    print_warning "Trailing whitespace found in:$WHITESPACE_FILES"
    print_status "Attempting to fix trailing whitespace..."
    
    for file in $WHITESPACE_FILES; do
        # Remove trailing whitespace
        sed -i 's/[[:space:]]*$//' "$file"
        git add "$file"
    done
    
    print_success "Trailing whitespace fixed and re-staged"
fi

# Check 8: Commit message format (if available)
if [ -n "${1:-}" ]; then
    COMMIT_MSG_FILE="$1"
    if [ -f "$COMMIT_MSG_FILE" ]; then
        commit_msg=$(head -n1 "$COMMIT_MSG_FILE")
        
        # Check commit message length
        if [ ${#commit_msg} -gt 72 ]; then
            print_warning "Commit message is longer than 72 characters"
        fi
        
        # Check for conventional commit format (optional)
        if echo "$commit_msg" | grep -qE '^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+'; then
            print_success "Conventional commit format detected"
        else
            print_warning "Consider using conventional commit format (feat:, fix:, docs:, etc.)"
        fi
    fi
fi

# Check 9: Security scan for sensitive data
print_status "Scanning for sensitive data..."
SENSITIVE_PATTERNS=(
    "password\s*=\s*['\"][^'\"]*['\"]"
    "api[_-]?key\s*=\s*['\"][^'\"]*['\"]"
    "secret\s*=\s*['\"][^'\"]*['\"]"
    "token\s*=\s*['\"][^'\"]*['\"]"
    "private[_-]?key"
)

for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        for pattern in "${SENSITIVE_PATTERNS[@]}"; do
            if grep -iE "$pattern" "$file" >/dev/null 2>&1; then
                print_error "Potential sensitive data found in $file: $pattern"
                print_error "Please review and remove sensitive information before committing"
                exit 1
            fi
        done
    fi
done
print_success "Security scan completed"

# Final success message
print_success "All pre-commit checks passed!"
print_status "Ready to commit $(echo $STAGED_FILES | wc -w) files"

exit 0
