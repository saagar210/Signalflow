import { describe, it, expect } from "vitest";
import { areTypesCompatible } from "./portTypes";

describe("areTypesCompatible", () => {
  it("same types are compatible", () => {
    expect(areTypesCompatible("string", "string")).toBe(true);
    expect(areTypesCompatible("number", "number")).toBe(true);
  });

  it("any is compatible with everything", () => {
    expect(areTypesCompatible("any", "string")).toBe(true);
    expect(areTypesCompatible("number", "any")).toBe(true);
  });

  it("number can connect to string", () => {
    expect(areTypesCompatible("number", "string")).toBe(true);
  });

  it("boolean can connect to string", () => {
    expect(areTypesCompatible("boolean", "string")).toBe(true);
  });

  it("string cannot connect to number", () => {
    expect(areTypesCompatible("string", "number")).toBe(false);
  });

  it("array cannot connect to object", () => {
    expect(areTypesCompatible("array", "object")).toBe(false);
  });
});
