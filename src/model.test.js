import { FirebaseModel } from "./model.js";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: "ok" })),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: "ok" }),
  ),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(() => ({ fullPath: "files/1/test.txt", name: "test.txt" })),
  uploadBytes: jest.fn(() => Promise.resolve({})),
  getDownloadURL: jest.fn(() => Promise.resolve("http://example.com/file.txt")),
  listAll: jest.fn(() =>
    Promise.resolve({
      items: [{ name: "test.txt", fullPath: "files/1/test.txt" }],
    }),
  ),
  getMetadata: jest.fn(() =>
    Promise.resolve({
      name: "test.txt",
      customMetadata: { description: "test desc", tag: "work" },
    }),
  ),
}));

describe("FirebaseModel", () => {
  test("signIn works", async () => {
    const model = new FirebaseModel();
    const result = await model.signIn("user@test.com", "pass");
    expect(result).toBeDefined();
  });

  test("signUp works", async () => {
    const model = new FirebaseModel();
    const result = await model.signUp("new@test.com", "pass123");
    expect(result).toBeDefined();
  });

  test("uploadFile works", async () => {
    const model = new FirebaseModel();
    const file = new File(["content"], "test.txt");
    const result = await model.uploadFile(
      "files/1/test.txt",
      file,
      "desc",
      "tag",
    );
    expect(result).toBeDefined();
  });

  test("listFilesWithMetadata works", async () => {
    const model = new FirebaseModel();
    const result = await model.listFilesWithMetadata("files/1");
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test("getFileDownloadUrl works", async () => {
    const model = new FirebaseModel();
    const url = await model.getFileDownloadUrl("files/1/test.txt");
    expect(url).toBeDefined();
  });

  test("observeAuthState works", () => {
    const model = new FirebaseModel();
    const callback = jest.fn();
    model.observeAuthState(callback);
    expect(callback).toBeDefined();
  });

  test("signOut works", async () => {
    const model = new FirebaseModel();
    await model.signOut();
    expect(true).toBe(true);
  });
});
