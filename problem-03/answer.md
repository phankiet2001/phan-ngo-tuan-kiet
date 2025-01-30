# Code Review: Computational Inefficiencies & Anti-Patterns

## 1. Interface & Type Safety Issues 🔍
- Empty interface `Props extends BoxProps {}`
- Using `any` type for blockchain parameter instead of proper type union
- Inconsistent use of types between `FormattedWalletBalance` and `WalletBalance`
- No type safety for blockchain strings in `getPriority`

## 2. Sorting & Filtering Logic Problems ⚠️
- Incorrect and inefficient `sortedBalances` filter logic:
  - Uses undefined `lhsPriority` variable
  - Illogical filter condition (returns true when amount <= 0)
  - Sort comparator doesn't handle equal priorities
  - Redundant priority calculations for same blockchains

## 3. Unnecessary Double Processing 🔄
- Creates `sortedBalances`, then `formattedBalances`, but uses `sortedBalances` again
- Should use final processed version (`formattedBalances`) for row mapping
- Redundant array transformations causing performance overhead

## 4. Memory Inefficiencies 🧮
- `useMemo` dependency includes unused `prices` variable
- Multiple intermediate arrays created (`sortedBalances`, `formattedBalances`)
- Could optimize to single-pass operation

## 5. React-Specific Anti-Patterns ⚛️
- Using array index as key in `WalletRow` mapping
- Missing component memoization leading to potential unnecessary re-renders

## 6. Code Structure Issues 🏗️
- `getPriority` function should be outside component (no state dependencies)
- Missing error handling for numerical operations
- Blockchain priorities could be constants

## 7. Reference Errors 🐛
- `classes.row` is referenced but not defined anywhere
  - Could cause runtime errors
  - Should either:
    ```typescript
    // Option 1: Define styles using CSS modules
    import classes from './WalletPage.module.css';
    
    // Option 2: Use inline styles or styled-components
    const WalletRow = styled.div`
      // styles here
    `;
    
    // Option 3: Remove className prop if styles aren't needed
    <WalletRow
      key={`${balance.blockchain}-${balance.currency}`}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
    ```
- Similarly, `lhsPriority` is used in filter function but not defined
  - This would cause a runtime error
  - Shows lack of proper error checking and variable scoping

## Optimized Solution 🚀

## Key Improvements 🎯

1. **Type Safety**: Added proper typing for blockchains and interfaces
2. **Performance**: Eliminated redundant processing and optimized memory usage
3. **React Best Practices**: Proper key usage and memoization
4. **Maintainability**: Moved constants and utility functions outside component
5. **Error Handling**: Better structure for handling edge cases
6. **Code Organization**: Cleaner, more logical flow of data transformation

These improvements result in more maintainable, performant, and type-safe code while following React best practices.

## Additional Notes on React Optimization ⚡

### Use `useMemo` Judiciously 🤔
- Only use `useMemo` when there's a clear performance benefit
- Unnecessary memoization can:
  - Add complexity to the code
  - Increase memory usage
  - Create performance overhead from the memoization itself
- Good cases for `useMemo`:
  - Expensive calculations
  - Complex object creation needed by child components
  - Values used in dependency arrays of other hooks

### Consider React Compiler 🔄
- React Compiler (available in React Canary) ([babel-plugin-react-compiler](https://www.npmjs.com/package/babel-plugin-react-compiler)) can automatically optimize:
  - Memoization of components
  - Hoisting of static content
  - Function creation
- Benefits:
  - Reduces manual optimization work
  - More consistent performance optimizations
  - Zero runtime overhead
  - Catches optimization opportunities developers might miss
- Recommendation: If possible, adopt React Compiler for production builds to get these optimizations automatically

These considerations help balance performance optimization with code maintainability.

### Type Safety Best Practices: `unknown` vs `any` 🛡️
- When dealing with runtime data where type is uncertain:
  - Use `unknown` instead of `any`
  - `unknown` is the type-safe counterpart to `any`
  - Forces explicit type checking before use
- Benefits of `unknown`:
  - Prevents implicit access to properties
  - Requires type narrowing/assertion
  - Maintains type safety throughout the codebase
- Example usage:
  ```typescript
  // ❌ Bad: Using any
  function processData(data: any) {
    return data.value; // No type safety!
  }

  // ✅ Good: Using unknown with type checking
  function processData(data: unknown) {
    if (typeof data === 'object' && data && 'value' in data) {
      return data.value;
    }
    throw new Error('Invalid data format');
  }
  ```

This approach ensures better type safety while still handling dynamic/unknown data types at runtime.

### React Key Best Practices: When to Use Index as Key 🔑
- Using index as key is acceptable when:
  - List is static (no additions/deletions)
  - Items are never reordered
  - List items have no unique IDs
  - List is read-only

- Avoid index as key when:
  ```typescript
  // ❌ Bad: Using index as key for dynamic/reorderable list
  {items.map((item, index) => (
    <ListItem key={index} data={item} />
  ))}

  // ✅ Good: Using unique identifier
  {items.map((item) => (
    <ListItem key={item.id} data={item} />
  ))}
  ```

- Why proper keys matter:
  - Helps React identify which items changed/moved
  - Maintains component state correctly during updates
  - Prevents UI glitches during list modifications
  - Improves performance by minimizing re-renders

Remember: When in doubt, use a unique identifier. The small overhead of generating/storing unique IDs is worth the reliability and predictability it provides.

### Avoiding Nested Conditions 🔀
- The original code has confusing nested logic:
  ```typescript
  // ❌ Bad: Nested conditions are hard to follow
  if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
  ```

- Better approaches:
  ```typescript
  // ✅ Good: Early return with clear conditions
  if (lhsPriority <= -99) return false;
  return balance.amount <= 0;

  // ✅ Even better: Single line with logical operators
  return lhsPriority > -99 && balance.amount <= 0;
  
  // ✅ Best: Clear intention with named conditions
  const isValidPriority = lhsPriority > -99;
  const hasNoBalance = balance.amount <= 0;
  return isValidPriority && hasNoBalance;
  ```

Benefits of flattening conditions:
- Improved readability
- Reduced cognitive complexity
- Easier to debug and maintain
- Clearer logic flow
- Better testability

### Type Extension Best Practices 🔄
- Current interface definition doesn't properly extend the base type:
  ```typescript
  // ❌ Bad: Duplicating properties from WalletBalance
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  ```

- Better approach using extension:
  ```typescript
  // ✅ Good: Properly extending WalletBalance
  interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain;
  }

  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  ```

Benefits of proper type extension:
- DRY (Don't Repeat Yourself) principle
- Easier maintenance when base type changes
- Clear relationship between types
- Better type inheritance
- Reduced chance of inconsistencies

When modifying the base interface `WalletBalance`, all extended interfaces automatically receive the changes, ensuring type consistency throughout the codebase.

### Number Formatting Best Practices 🔢
- Current implementation has potential issues:
  ```typescript
  // ❌ Bad: Using toFixed() without parameters
  formatted: balance.amount.toFixed()
  ```

- Problems with current approach:
  - `toFixed()` without arguments defaults to 0 decimals
  - Doesn't handle large numbers well
  - No localization support
  - Might lose precision for certain values

- Better approaches:
  ```typescript
  // ✅ Good: Specify decimal places and handle edge cases
  formatted: balance.amount.toFixed(2) // For consistent 2 decimal places

  // ✅ Better: Use Intl.NumberFormat for localization
  formatted: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance.amount)

  // ✅ Best: Comprehensive solution with error handling
  formatted: formatBalance(balance.amount)

  // Helper function
  function formatBalance(amount: number): string {
    if (!isFinite(amount)) return '0.00';
    try {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
        notation: 'standard',
      }).format(amount);
    } catch {
      return amount.toFixed(2);
    }
  }
  ```

Benefits of improved number formatting:
- Proper decimal place handling
- Internationalization support
- Better error handling
- Consistent number display
- Handles edge cases (Infinity, NaN)
- More precise representation of financial values
