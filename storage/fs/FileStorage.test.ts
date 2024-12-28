import { assertEquals } from "jsr:@std/assert";
import FileStorage from "./FileStorage.ts";

Deno.test("gets context correctly", async (t) => {
  let fs: FileStorage;
  await t.step("add files to root", async () => {
    await Deno.mkdir("__test/test1", { recursive: true });
    await Deno.mkdir("__test/test2", { recursive: true });
  });

  await t.step("initiate file storage", async () => {
    fs = new FileStorage("__test");
    await fs.init();
  });

  await t.step("invoke getContext", () => {
    assertEquals(fs.getContext("test1"), { id: "test1", resources: [] });
  });

  await t.step("invoke getAllContexts", () => {
    assertEquals(fs.getAllContexts(), [{ id: "test1", resources: [] }, {
      id: "test2",
      resources: [],
    }]);
  });

  await t.step("clean up file", async () => {
    await Deno.remove("__test/test1");
    await Deno.remove("__test/test2");
    await Deno.remove("__test");
  });
});
