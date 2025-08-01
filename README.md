# fabricQA

This project is a Playwright-based automation framework for testing the ParaBank application.  
It covers both UI and API scenarios, including user registration, login, account management, fund transfers, bill payments, and transaction validation.

## How to Use

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Run all tests:**
   ```
   npx playwright test
   ```

3. **View the test report:**
   ```
   npx playwright show-report
   ```

4. **Framework Best Practices:**  
  - Page Object Model for maintainable UI code
  - Utility and helper functions for data and schema validation
  - Step-wise test reporting using `test.step`
  - Reusable JSON schema validation with AJV

## Structure

- `tests/` - Test cases for UI and API
- `pages/` - Page Object Model classes
- `utils/` - Helper functions and schema validation
- `data/` - Static data and constants
- `.env` - Base URL

## Notes
- some test data is added within Test file, can be updated as needed
- Update test data and configuration as needed.
- Make sure the ParaBank demo site is accessible before running