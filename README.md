# Sonner 2.0.1 Bug Reproduction

This repository is a minimal reproduction of an issue with the sonner toast library version 2.0.1, where toast notifications require multiple function calls to appear.

## Issue Description

When using sonner v2.0.1, calling `toast.success()` or `toast.error()` a single time doesn't consistently display a toast notification. Multiple consecutive calls to the same toast function are needed for the toast to actually appear on the screen.

### Expected Behavior

A single call to `toast.success()` or any toast variant should display a toast notification.

### Actual Behavior

Toast notifications either don't appear or appear inconsistently when called once. Multiple consecutive calls are required to reliably show the toast notification.

## Steps to Reproduce

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Click the user ID in the Profile component or submit an empty form in the PasswordSetting component
5. Observe that console logs show multiple toast function calls
6. Try modifying the code to use a single toast call and observe the inconsistent behavior

## Environment

- sonner: 2.0.1
- react: 19.2.0
- react-router 7

## Additional Notes

This issue doesn't occur in older versions of sonner (e.g., 1.2.0). The problem specifically appears in version 2.0.1.
