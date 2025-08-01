import { afterEach, describe, expect, it, vi } from "vitest";

// Helper to build expected relative path
const EXPECTED_RELATIVE_PATH = "../../lingo/dictionary.js";

afterEach(() => {
  // Reset module registry and any mocks so each test gets a fresh copy
  vi.resetModules();
  vi.clearAllMocks();
  vi.unmock("path");
});

describe("getDictionaryPath", () => {
  it("returns POSIX-style relative path on POSIX", async () => {
    // Import fresh copy with the real Node "path" module (POSIX on *nix, win32 on Windows)
    const { getDictionaryPath } = await import("./_utils");

    const result = getDictionaryPath({
      sourceRoot: "/project/src",
      lingoDir: "lingo",
      relativeFilePath: "/project/src/components/Button.tsx",
    });

    expect(result).toBe(EXPECTED_RELATIVE_PATH);
    // Ensure no back-slashes slip through
    expect(result).not.toMatch(/\\/);
  });

  it('returns the same POSIX-style path when the Node "path" API uses win32 semantics (mock Windows)', async () => {
    // Force every call to "path.*" inside _utils to use the Windows implementation
    vi.mock("path", () => {
      const nodePath = require("path") as typeof import("path");
      return { ...nodePath.win32, default: nodePath.win32 };
    });

    const { getDictionaryPath } = await import("./_utils");

    const result = getDictionaryPath({
      sourceRoot: "C:\\project\\src",
      lingoDir: "lingo",
      relativeFilePath: "C:\\project\\src\\components\\Button.tsx",
    });

    expect(result).toBe(EXPECTED_RELATIVE_PATH);
    expect(result).not.toMatch(/\\/);
  });
});
