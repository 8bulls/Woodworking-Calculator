# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file HTML woodworking calculator application that provides three main tools:
- **Calculator**: Feet/inches arithmetic with memory functions and conversions
- **Cut Calculator**: Material cutting optimization with waste calculation
- **Waste Optimizer**: Optimizes board usage to minimize waste

The entire application is contained in a single `index.html` file with embedded CSS and JavaScript.

## Architecture

### Single-File Structure
- All HTML, CSS, and JavaScript code is contained in `index.html`
- No build process or package management - can be opened directly in a browser
- No external dependencies or frameworks

### Key Components
- **Tab System**: Three main tabs (Calculator, Cut Calculator, Waste Optimizer)
- **State Management**: Global JavaScript variables manage application state:
  - `currentValueInches`, `cutValueInches` for calculator values
  - `history[]`, `cutHistory[]` for operation history
  - `boards[]`, `cuts[]` for cut optimization data
  - `memoryValue` for calculator memory functions

### Core Functions
- **Calculator Functions**: `updateCalculation()`, `setOperation()`, `memoryOperation()`
- **Cut Calculator**: `addBoard()`, `addCut()`, `calculateCuts()`
- **Conversion Utilities**: `inchesToFeet()`, `convertToDecimal()`, `convertToFraction()`
- **UI Management**: `switchTab()`, `updatePrecision()`, `showNotification()`

## Development

### Running the Application
```bash
# Simply open the file in any modern web browser
open index.html
# or
python -m http.server 8000  # For local development server
```

### Testing
- No automated tests - manual testing required
- Test all three calculator modes with various inputs
- Verify fraction/decimal conversions work correctly
- Check memory functions and history persistence

### Key Features to Understand
- **Fraction Support**: Handles feet/inches with fractional inches (1/16", 1/8", etc.)
- **Memory Functions**: MC (clear), MR (recall), M+ (add), M- (subtract)
- **Cut Optimization**: Calculates optimal cuts from available boards to minimize waste
- **Unit Conversions**: Seamless conversion between decimal, fraction, feet, and inches

### Common Modifications
- Precision settings affect fraction display (controlled by dropdown selections)
- Calculator supports basic arithmetic operations (+, -, ×, ÷)
- History functionality allows saving and reviewing calculations
- Board foot calculator and golden ratio tools are built-in utilities

## Development Guidelines

### Code Modularity and Consistency
- **Avoid Hardcoded Values**: Don't use hardcoded CSS dimensions, magic numbers, or specific measurements. Instead, use consistent patterns that adapt naturally.
- **Consistent Container Systems**: When fixing layout issues, identify the root cause rather than applying band-aid fixes. All calculator types should use similar container patterns.
- **CSS Best Practices**: 
  - Avoid `!important` overrides unless absolutely necessary
  - Use flexible layouts (`overflow: visible`, `min-width: 0`) that adapt to content
  - Prefer consistent CSS classes over inline styles for repeated patterns
  - **Form Element Constraints**: All form elements (select, input) in calc cards must use `max-width: 100%; box-sizing: border-box;` to prevent container overflow
- **Smart Input Standardization**: All measurement inputs should use the smart input system with standardized 450px width that works across all calculator types.
- **Placeholder Text Standards**: 
  - Never use escaped quotes (\") in HTML placeholder attributes - use `&quot;` for quotes in HTML
  - Follow the pattern: `Try: 4'6", 48", 4 6 1/32, 48.5"` showing multiple input formats
  - Include: feet/inches (`4'6"`), inches only (`48"`), smart parsing (`4 6 1/32`), and decimals (`48.5"`)
  - Always end with closing quote to show proper format
  - Smart parsing examples like `1 6 1/2` demonstrate how users can input feet, inches, and fractions

### Problem-Solving Approach
1. **Identify Root Cause**: When containers or layouts break, investigate why different sections behave differently
2. **Unified Solutions**: Prefer solutions that make all components work consistently rather than special cases for individual calculators
3. **Flexible Design**: Containers should naturally expand to accommodate their content rather than constraining it
4. **Pattern Consistency**: Basic calculator patterns should work equally well in specialty calculators

### UI State Management
- **Mode Switching**: When calculators have multiple modes (tabs/buttons), always clear all preview/feedback elements when switching modes
- **Preview Elements**: All `.input-preview` elements should be hidden (`display: none`) when changing calculator modes to prevent leftover feedback from previous calculations
- **Clean State**: Mode switching should provide a clean slate - no residual visual feedback from previous mode

## Working with Single-File Architecture

### File Structure Considerations
- **Warning**: This is a 16,000+ line single-file application - exercise extreme caution with large-scale edits
- **Section Markers**: Use clear comment markers to delineate major sections (HTML, CSS, JavaScript, individual calculators)
- **Navigation**: Use search/grep to verify line numbers before making large edits
- **Duplicate Detection**: Before major edits, check for duplicates: `grep -c "id=\"elementId\"" index.html`

### Incremental Development Pattern
When making significant changes, follow this pattern:
1. **Improve existing features first** (commit after testing)
2. **Add new features in isolation** (commit after testing)
3. **Integrate features only after individual parts work** (commit after testing)
4. **Reorganize structure as final step** (commit after testing)

**Never combine improvements with reorganization in a single session.**

### Major Structural Changes
- **Moving Sections**: When moving large blocks (like entire calculators):
  - Copy the section to new location first
  - Verify it works in new location
  - Only then remove from old location
  - Search for any leftover fragments (closing tags, related functions)
- **Testing Required**: Test application after EVERY structural change
- **Fragment Detection**: After moving content, search for orphaned elements:
  ```bash
  # Check for leftover HTML in JavaScript sections
  grep -n "</div>\|</svg>\|</select>" index.html | grep -A2 -B2 "function\|var\|let"
  ```

### Testing Strategy
- **Console First**: Keep browser DevTools console open at all times
- **Incremental Testing**: Test after every significant change, not after multiple changes
- **Error Recovery**: If errors appear, stop immediately - don't try to fix by adding more changes
- **Syntax Validation**: For JavaScript changes, use a linter or online validator before saving