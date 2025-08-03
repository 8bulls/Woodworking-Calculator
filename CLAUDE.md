# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file HTML woodworking calculator application that provides multiple woodworking tools:
- **Calculator**: Feet/inches arithmetic with memory functions and conversions
- **Cut Calculator**: Material cutting optimization with waste calculation
- **Waste Optimizer**: Optimizes board usage to minimize waste
- **Drawer Box Calculator**: Calculates drawer box dimensions with assembly instructions

The entire application is contained in a single `index.html` file with embedded CSS and JavaScript.

## Architecture

### Single-File Structure
- All HTML, CSS, and JavaScript code is contained in `index.html`
- No build process or package management - can be opened directly in a browser
- No external dependencies or frameworks

### Key Components
- **Tab System**: Multiple tabs for different calculators and tools
- **State Management**: Global JavaScript variables manage application state:
  - `currentValueInches`, `cutValueInches` for calculator values
  - `history[]`, `cutHistory[]` for operation history
  - `boards[]`, `cuts[]` for cut optimization data
  - `memoryValue` for calculator memory functions
  - `currentCabinetDepthInches`, `currentCabinetMaterialThickness` for drawer calculations
  - `cabinetFrameStyle`, `drawerSlideType` for drawer configuration

### Core Functions
- **Calculator Functions**: `updateCalculation()`, `setOperation()`, `memoryOperation()`
- **Cut Calculator**: `addBoard()`, `addCut()`, `calculateCuts()`
- **Drawer Calculator**: `calculateDrawerBoxes()`, `calculateRailPositions()`, `updateDrawerBoxDiagrams()`, `updateFaceToBoxMountingDiagram()`
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

## Calculator Design Principles

### 1. Smart Input Integration
- **Always Use Smart Input Values**: 
  - Use the smart input callback values (e.g., `currentBfThicknessInches`) as the primary data source
  - Fall back to legacy inputs only when smart inputs are not available
  - Never read from legacy hidden inputs if smart inputs are being used
  
- **Consistent Unit Handling**:
  - Smart inputs always return values in inches - this is the canonical unit
  - Store all internal calculations in inches for consistency
  - Convert to display units (feet, fractions) only for output
  
- **Proper Variable Management**:
  - Define smart input callback variables at the top of the script
  - Reset these variables when clearing forms
  - Example pattern:
  ```javascript
  // Smart input callbacks
  let currentBfThicknessInches = 0;
  let currentBfWidthInches = 0;
  let currentBfLengthInches = 0;
  
  function updateBfThicknessValue(inches, display) {
      currentBfThicknessInches = inches;
      calculateBoardFeet();
  }
  ```

### 2. Calculation Accuracy
- **Board Foot Calculations**:
  - Formula when all dimensions in inches: `(thickness × width × length) / 144`
  - Formula when length in feet: `(thickness × width × length) / 12`
  - Always document which units are expected in comments
  - Never mix unit systems in a single calculation
  
- **Validation Before Calculation**:
  - Check all required inputs are present and positive
  - Use the actual variables being used in calculations for validation
  - Don't validate `length` if you're using `lengthInInches`
  - Provide clear error messages indicating what's missing
  
- **Avoid Unit Conversion Errors**:
  - Don't convert units multiple times in a calculation chain
  - Be explicit about units in variable names (e.g., `lengthInInches` vs `lengthInFeet`)
  - Test calculations with known values to verify accuracy
  - Common error: Converting to feet then still dividing by 144 instead of 12

### 3. Reactive Calculations
- **Auto-recalculate**: When any input changes, automatically recalculate results if enough data exists
- **Remember state**: Store last calculation type/values to enable auto-recalculation
- **Input events**: Use `oninput` for real-time updates, not just `onchange`
- **Implementation pattern**:
  ```javascript
  let lastDivisionType = null;  // 'quick' or 'custom'
  let lastDivisionValue = null; // number of pieces
  
  function autoRecalculateDivision() {
      if (cutValueInches > 0 && lastDivisionValue) {
          quickCut(lastDivisionValue);
      }
  }
  ```

### 4. UI Simplification
- **Remove redundancy**: Don't use checkboxes + dropdowns for same setting (e.g., kerf on/off + kerf size)
- **Smart defaults**: Include "None" or "0" options in dropdowns instead of separate enable/disable controls
- **Conditional visibility**: Show/hide related controls based on primary selections
- **Example**: Kerf compensation - single dropdown with "None" option instead of checkbox + dropdown

### 5. Consistent Layout Patterns
- **Settings panels**: Use light background boxes with grid/flex layouts for settings
  ```html
  <div class="settings-panel" style="background: #f8f9fa; border-radius: 12px; padding: 20px;">
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
          <div style="flex: 1; min-width: 250px;"><!-- Column 1 --></div>
          <div style="flex: 1; min-width: 250px;"><!-- Column 2 --></div>
      </div>
  </div>
  ```
- **Input sections**: Clear labels, consistent spacing, responsive widths
- **Results sections**: Titled sections with scrollable areas for long results

### 6. State Management
- **Global variables**: Track current values and last selections for persistence
- **Clear functions**: Reset ALL related state variables, not just UI elements
  ```javascript
  function clearCut() {
      cutValueInches = 0;
      currentCutLengthInches = 0;
      lastDivisionType = null;
      lastDivisionValue = null;
      // Clear all UI elements...
  }
  ```
- **Smart callbacks**: Input handlers should update state AND trigger recalculations

### 7. Responsive Design
- **Flexible layouts**: Use flexbox with wrap, avoid fixed-width grids
- **Min-widths**: Set minimum widths on columns to force stacking on small screens
- **Container constraints**: Use `width: 100%; max-width: 450px;` for inputs
- **Avoid over-constraining**: Let content flow naturally within reasonable bounds

### 8. Validation Best Practices
- **Validate Actual Variables**: Always validate the exact variables used in calculations
  ```javascript
  // WRONG - validates 'length' but uses 'lengthInInches'
  if (thickness <= 0 || width <= 0 || length <= 0) { return; }
  const boardFeet = (thickness * width * lengthInInches) / 144;
  
  // CORRECT - validates the actual variable used
  if (thickness <= 0 || width <= 0 || lengthInInches <= 0) { return; }
  const boardFeet = (thickness * width * lengthInInches) / 144;
  ```

- **Clear Error Messages**: Specify exactly what's wrong
  - Bad: "Invalid input"
  - Good: "Please enter valid dimensions and quantity"
  - Better: "Length must be greater than 0"

- **Early Validation**: Check required fields before optional ones
  1. First check if required selections are made (species, type)
  2. Then validate dimensions are positive
  3. Finally validate optional fields (price, notes)

- **Consistent Validation Order**: Follow the same validation sequence across all calculators

## Drawer Box Calculator Principles

### Cabinet Interior Depth Definition
- **Interior depth** = inside face of cabinet front to inside back wall
- This is the baseline measurement for all drawer box calculations
- User inputs this value directly in the "Cabinet Interior Clear Depth" field

### Frame Style Logic
- **Inset drawers**:
  - Face sits inside cabinet opening, flush with cabinet face frame
  - Box uses full interior depth minus rear clearance
  - Max box depth = cabinet interior depth - rear clearance
  
- **Overlay drawers**:
  - Face sits on top of cabinet face frame
  - Box extends forward by cabinet material thickness
  - Max box depth = cabinet interior depth + cabinet material thickness - rear clearance
  - Requires "Cabinet Material Thickness" input (defaults to 3/4")

### Box Construction Method
- Front and back pieces run the full width of the box
- Side pieces are sandwiched between front and back
- Side length = total box depth - (2 × box material thickness)
- Bottom panel sits in dado grooves on all four sides

### Clearance Requirements
- **Side mount slides**:
  - Box-to-cabinet clearance per side (default 1/2")
  - Top clearance only (default 1/2")
  
- **Bottom mount slides**:
  - Smaller side clearances (default 3/16")
  - Top clearance (default 1/2")
  - Bottom clearance for slide hardware (default 3/8")
  - Box height reduced by both top and bottom clearances

### Critical Assembly Features
- **Face-to-box mounting diagram** shows:
  - Precise alignment offsets (horizontal and vertical)
  - Pilot hole locations (1" from edges)
  - Screw specifications (1 1/4" length)
  - Center line alignment guides
  
- **Assembly instructions** emphasize:
  - Pre-drilling to prevent splitting
  - Mounting from inside the box
  - Verifying alignment before final tightening

### Validation and Error Handling
- Minimum depth validation prevents negative dimensions
- Insufficient depth shows clear warning messages
- SVG diagrams gracefully handle edge cases
- All calculations return null if constraints aren't met

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
- **Smart Input Layout Rule**: **CRITICAL** - The preview div (`input-preview`) must be OUTSIDE the `input-row` div to display underneath the input. If placed inside `input-row`, it will display inline to the right instead of below the input.
  ```html
  <!-- CORRECT - Preview div outside input-row -->
  <div class="input-row">
      <label>Total Length:</label>
      <input type="text" id="smartInput" class="wide-input" oninput="handleSmartInput(...)">
  </div>
  <div id="previewDiv" class="input-preview"></div>

  <!-- INCORRECT - Preview div inside input-row will show inline -->
  <div class="input-row">
      <label>Total Length:</label>
      <input type="text" id="smartInput" class="wide-input" oninput="handleSmartInput(...)">
      <div id="previewDiv" class="input-preview"></div> <!-- WRONG LOCATION -->
  </div>
  ```
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

## HTML Structure Debugging

### Common Div Nesting Issues
DIV balance problems are the #1 cause of visual bugs in this single-file application. Issues manifest as:
- Multiple calculators appearing within a single border
- Inconsistent spacing between sections
- Elements not displaying (0 width/height despite having content)
- Tab content missing or appearing in wrong locations

### Debugging Approach
1. **Visual Symptoms**: 
   - Multiple borders around grouped elements = missing closing divs
   - Elements with 0 dimensions but visible content = incorrect parent nesting
   - Inconsistent spacing = check for extra margins or unclosed containers

2. **Diagnostic Tools**:
   ```python
   # Python script to check div balance between sections
   with open('index.html', 'r') as f:
       content = f.read()
   section = content[start_pos:end_pos]
   balance = section.count('<div') - section.count('</div>')
   print(f'Div balance: {balance}')
   ```

3. **Quick Checks**:
   - Use browser DevTools to inspect parent relationships
   - Add temporary CSS borders to visualize container boundaries
   - Check computed styles for unexpected inheritance

### Prevention Strategies
1. **Always Close at Same Indentation**: When adding a div, immediately add its closing tag
2. **Comment Major Sections**: Use comments like `<!-- End of calculator-name -->` 
3. **Validate After Moving Code**: Moving sections often leaves orphaned tags
4. **Check Parent Elements**: Use `console.log(element.parentElement)` to verify nesting
5. **Balance Testing**: After structural changes, verify total document div balance is 0

### Common Pitfalls
- **Inline Styles**: Avoid inline `style="margin-bottom: 10px"` - use CSS classes
- **Copy-Paste Errors**: Always verify closing tags match when copying calculator sections
- **Missing Initialization**: Ensure all UI components are initialized on page load
- **Function Name Typos**: Double-check function names exist before calling them

### Version Control Safety
- **NEVER commit without explicit user permission** - Always ask "Should I commit these changes?" before running git commit
- **Recommend commits before risky changes** - Before making structural changes, suggest: "I recommend committing the current working state before proceeding with [describe risky change]"
- **Staged commits for major features** - When working on complex features:
  1. Commit the working baseline first
  2. Make incremental changes with testing
  3. Commit each successful milestone
  4. Never combine multiple major changes in one session

### Preventing File Structure Corruption
- **Section Integrity Checks**: Before and after major edits, verify the three-section structure:
  ```bash
  # Verify section markers are in correct order
  grep -n "SECTION.*:" index.html
  # Should show: 1. CSS, 2. HTML, 3. JavaScript in that order
  ```
- **Never insert code between sections** - JavaScript must stay in Section 3, never between CSS and HTML
- **Line count monitoring** - Check file size before/after changes:
  ```bash
  wc -l index.html  # Should be ~18,000-19,000 lines
  ```
- **Immediate rollback on errors** - If console errors appear after changes, immediately revert instead of attempting fixes

### Safe Editing Practices for Large Changes
- **Use MultiEdit for complex modifications** - Reduces risk of misplaced content
- **Search before moving** - Always grep for the content you're about to move
- **Verify section boundaries** - When working near section transitions, double-check you're in the right section
- **Test every 100 lines** - For changes spanning >100 lines, save and test incrementally

### Emergency Recovery
- **If corruption detected**:
  1. STOP immediately - don't attempt fixes
  2. Check git diff to understand the damage
  3. Revert to last known good commit
  4. Document what was being attempted
  5. Retry with smaller, incremental changes

## HTML Structure Validation

### Before Making Structural Changes
- **Validate div balance**: Count opening and closing tags in the section you're modifying
- **Use agents or grep**: Systematically verify structure rather than assuming it's correct
- **Check parent-child relationships**: Ensure elements are inside their intended containers

### Common Structural Issues
- **Extra closing tags**: Can orphan entire sections outside their containers
- **Missing closing tags**: Can cause elements to bleed into wrong sections
- **Symptoms of structural problems**:
  - Elements appearing in wrong tabs
  - Content visible when it should be hidden
  - CSS selectors not working as expected

### Debugging Structural Issues
When elements appear where they shouldn't:
1. **Check structure first** - Don't assume it's a CSS/JS visibility issue
2. **Add debug functions** that show parent-child relationships:
   ```javascript
   console.log('Parent ID:', element.parentElement?.id);
   ```
3. **Verify div balance** in the affected sections
4. **Use browser DevTools** to inspect actual DOM structure

### Best Practices for Structural Integrity
- **Before commits**: Verify div balance in modified sections using:
  ```bash
  # Count divs in a section
  grep -c '<div' index.html
  grep -c '</div>' index.html
  ```
- **After moving content**: Check parent IDs of affected elements
- **Use agents** for systematic structural analysis when issues are complex
- **Never trust** that existing structure is correct - always verify

### Tab System Structure
Each tab must maintain proper containment:
```html
<div id="tabname" class="tab-content">
  <!-- All tab content must be inside this container -->
  <!-- Check that closing </div> doesn't close multiple levels -->
</div>
```

### Warning Signs of Structural Problems
- Category headers appearing in wrong tabs
- Content bleeding between tabs
- Elements with empty or unexpected parent IDs
- Visual issues that persist despite CSS/JS fixes