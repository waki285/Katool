const config = {
  testMatch: ['**/*.test.ts'],
  transform: {
    // '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
};

export default config;
