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