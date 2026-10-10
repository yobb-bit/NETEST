import { describe, expect, it } from "vitest";
import { getTopicBySlug, topics } from "../../src/features/reviewer/topics";

describe("reviewer topics", () => {
  it("includes all six CCNA v1.1 study domains", () => {
    expect(topics).toHaveLength(6);
    expect(topics.every((topic) => topic.objective.includes("CCNA v1.1"))).toBe(true);
  });

  it("looks up a topic by its route slug", () => {
    expect(getTopicBySlug("network-fundamentals")?.title).toBe("Network fundamentals");
    expect(getTopicBySlug("missing-topic")).toBeUndefined();
  });

  it("provides at least one explanatory note per topic", () => {
    expect(topics.every((topic) => topic.notes.length > 0)).toBe(true);
    expect(topics.every((topic) => topic.notes.every((note) => note.takeaways.length > 0))).toBe(true);
  });
});
