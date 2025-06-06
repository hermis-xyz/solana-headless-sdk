import type { MockedFunction } from 'jest-mock';

// Add global Jest type definitions
// declare global {
//   const jest: {
//     spyOn: <T>(object: T, methodName: keyof T) => jest.SpyInstance;
//   };
// }

beforeAll(() => {
  // Spy on console methods and mock their implementation
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  // Type-safe restoration of mocked console methods
  (console.error as MockedFunction<typeof console.error>).mockRestore();
  (console.warn as MockedFunction<typeof console.warn>).mockRestore();
});