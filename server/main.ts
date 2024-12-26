import FileStorage from "../storage/fs/FileStorage.ts";

const filestorage = new FileStorage();
filestorage.setEndpoint({
  name: "foobar",
  context: "copyTest",
});

filestorage.setEndpoint({
  name: "mr black",
  context: "pink_cats",
});

filestorage.setEndpoint({
  name: "mr yellow",
  context: "yellow_dogs",
});
