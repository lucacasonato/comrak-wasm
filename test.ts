import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { init, markdownToHTML } from "./mod.ts";

await init();

Deno.test("markdown to html", () => {
  const actual = markdownToHTML("Hello, **世界**!");
  assertEquals(actual, "<p>Hello, <strong>世界</strong>!</p>\n");
});
