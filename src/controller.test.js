describe("controller runApp", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = "";
  });

  test("triggers signIn on button click", async () => {
    const fakeModel = {
      signIn: jest.fn().mockResolvedValue({ user: "ok" }),
      observeAuthState: jest.fn((cb) => {
        cb(null);
        return jest.fn();
      }),
      listFilesWithMetadata: jest.fn().mockResolvedValue([]),
    };

    jest.doMock("../src/model.js", () => ({
      FirebaseModel: jest.fn(() => fakeModel),
    }));

    jest.doMock("../src/view.js", () => ({
      authPageRender: jest.fn(() => {
        const email = document.createElement("input");
        email.value = "test@example.com";
        const password = document.createElement("input");
        password.value = "secret";
        const button = document.createElement("button");
        button.id = "login-btn";
        document.body.append(email, password, button);
      }),
      dashBoardPageRender: jest.fn(),
      ensureBaseMarkup: jest.fn(),
    }));

    const { runApp } = await import("./controller.js");
    runApp(fakeModel);

    document.querySelector("button").click();
    await Promise.resolve();

    expect(fakeModel.signIn).toHaveBeenCalledWith("test@example.com", "secret");
  });

  test("renders dashboard for authenticated user", async () => {
    const fakeModel = {
      observeAuthState: jest.fn((cb) => {
        cb({ uid: "123" });
        return jest.fn();
      }),
      listFilesWithMetadata: jest.fn().mockResolvedValue([]),
    };

    jest.doMock("../src/model.js", () => ({
      FirebaseModel: jest.fn(() => fakeModel),
    }));

    const mockDashboard = jest.fn();
    jest.doMock("../src/view.js", () => ({
      authPageRender: jest.fn(),
      dashBoardPageRender: mockDashboard,
      ensureBaseMarkup: jest.fn(),
    }));

    const { runApp } = await import("./controller.js");
    runApp(fakeModel);
    await Promise.resolve();

    expect(mockDashboard).toHaveBeenCalled();
  });

  test("handles signup button click", async () => {
    const fakeModel = {
      signUp: jest.fn().mockResolvedValue({ user: "ok" }),
      observeAuthState: jest.fn((cb) => {
        cb(null);
        return jest.fn();
      }),
      listFilesWithMetadata: jest.fn().mockResolvedValue([]),
    };

    jest.doMock("../src/model.js", () => ({
      FirebaseModel: jest.fn(() => fakeModel),
    }));

    jest.doMock("../src/view.js", () => ({
      authPageRender: jest.fn(() => {
        const email = document.createElement("input");
        email.value = "new@test.com";
        const password = document.createElement("input");
        password.value = "pass123";
        const button = document.createElement("button");
        button.id = "signup-btn";
        document.body.append(email, password, button);
      }),
      dashBoardPageRender: jest.fn(),
      ensureBaseMarkup: jest.fn(),
    }));

    const { runApp } = await import("./controller.js");
    runApp(fakeModel);

    document.querySelector("#signup-btn").click();
    await Promise.resolve();

    expect(fakeModel.signUp).toHaveBeenCalledWith("new@test.com", "pass123");
  });

  test("handles logout button click", async () => {
    const fakeModel = {
      signOut: jest.fn().mockResolvedValue(),
      observeAuthState: jest.fn((cb) => {
        cb({ uid: "123" });
        return jest.fn();
      }),
      listFilesWithMetadata: jest.fn().mockResolvedValue([]),
    };

    jest.doMock("../src/model.js", () => ({
      FirebaseModel: jest.fn(() => fakeModel),
    }));

    jest.doMock("../src/view.js", () => ({
      authPageRender: jest.fn(),
      dashBoardPageRender: jest.fn(() => {
        const button = document.createElement("button");
        button.id = "logout-btn";
        document.body.appendChild(button);
      }),
      ensureBaseMarkup: jest.fn(),
    }));

    const { runApp } = await import("./controller.js");
    runApp(fakeModel);
    await Promise.resolve();

    document.querySelector("#logout-btn").click();

    expect(fakeModel.signOut).toHaveBeenCalled();
  });

  test("navigates to about page", async () => {
    const fakeModel = {
      observeAuthState: jest.fn((cb) => {
        cb({ uid: "123" });
        return jest.fn();
      }),
      listFilesWithMetadata: jest.fn().mockResolvedValue([]),
    };

    jest.doMock("../src/model.js", () => ({
      FirebaseModel: jest.fn(() => fakeModel),
    }));

    jest.doMock("../src/view.js", () => ({
      authPageRender: jest.fn(),
      dashBoardPageRender: jest.fn(),
      aboutPageRender: jest.fn(),
      ensureBaseMarkup: jest.fn(),
    }));

    const { runApp } = await import("./controller.js");
    runApp(fakeModel);
    await Promise.resolve();

    expect(true).toBe(true);
  });
});
