import { describe, expect, it } from "vitest";
import { mapFaqItems } from "@/src/lib/content";

describe("mapFaqItems", () => {
  it("maps sanity faq docs into ui shape", () => {
    const mapped = mapFaqItems([{ _id: "1", question: "Q?", answer: [{ _type: "block", children: [] }] }]);
    expect(mapped[0].id).toBe("1");
    expect(mapped[0].question).toBe("Q?");
  });
});
