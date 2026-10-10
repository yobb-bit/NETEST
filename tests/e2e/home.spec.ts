import { expect, test } from "@playwright/test";

test("homepage presents the NETEST study workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/NETEST/);
  await expect(page.getByRole("heading", { name: /Build your confidence/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explore study areas" })).toBeVisible();
});

test("learner can browse topics and open an original study note", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View all topics" }).click();
  await expect(page).toHaveURL(/\/topics$/);
  await expect(page.getByRole("heading", { name: "Study topics" })).toBeVisible();
  await page.getByRole("link", { name: /Network fundamentals/ }).first().click();
  await expect(page).toHaveURL(/\/topics\/network-fundamentals$/);
  await expect(page.getByRole("heading", { name: "Devices have different jobs" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key ideas" }).first()).toBeVisible();
});

test("unknown topic shows a helpful not-found state", async ({ page }) => {
  await page.goto("/topics/not-a-topic");
  await expect(page.getByRole("heading", { name: "That study area isn’t here." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse study topics/ })).toBeVisible();
});

test("learner can finish a quiz and see the saved result after reload", async ({ page }) => {
  await page.goto("/quizzes");
  await expect(page.getByRole("heading", { name: "Quiz practice" })).toBeVisible();
  await page.getByRole("button", { name: /Start quiz/ }).click();
  await expect(page).toHaveURL(/\/quizzes\/[^/]+$/);

  const questionGroups = page.getByRole("group");
  await expect(questionGroups).toHaveCount(6);
  for (let index = 0; index < 6; index += 1) {
    await questionGroups.nth(index).getByRole("radio").first().check();
  }

  await page.getByRole("button", { name: "Submit answers" }).click();
  await expect(page.getByRole("heading", { name: "Your results" })).toBeVisible();
  await expect(page.getByText("6 / 6")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Answer review" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your results" })).toBeVisible();
  await expect(page.getByText("6 / 6")).toBeVisible();
  await expect(page.getByText("Completed")).toBeVisible();
});
