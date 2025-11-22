import {
  ensureBaseMarkup,
  dashBoardPageRender,
  createNuvAuth,
  createNuvDashboard,
  authPageRender,
  showAlert,
  aboutPageRender,
} from "./view.js";

describe("view layer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("ensureBaseMarkup adds header", () => {
    ensureBaseMarkup();
    expect(document.querySelector("h1")).not.toBeNull();
  });

  test("dashBoardPageRender renders table", () => {
    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    header.appendChild(h1);
    document.body.appendChild(header);

    dashBoardPageRender([]);

    expect(document.querySelector("table")).not.toBeNull();
  });

  test("dashBoardPageRender with files shows data", () => {
    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    header.appendChild(h1);
    document.body.appendChild(header);

    const files = [
      {
        name: "test.txt",
        description: "test",
        tag: "work",
        path: "files/1/test.txt",
      },
    ];
    dashBoardPageRender(files);

    expect(document.querySelector("tbody")).not.toBeNull();
  });

  test("ensureBaseMarkup does not duplicate header", () => {
    ensureBaseMarkup();
    const firstH1 = document.querySelector("h1");

    ensureBaseMarkup();
    const allH1s = document.querySelectorAll("h1");

    expect(allH1s.length).toBe(1);
    expect(firstH1).toBe(allH1s[0]);
  });

  test("createNuvAuth creates auth navigation", () => {
    const nav = createNuvAuth();
    expect(nav.tagName).toBe("NAV");
    expect(nav.querySelector("a")).not.toBeNull();
  });

  test("createNuvDashboard creates dashboard navigation", () => {
    const nav = createNuvDashboard();
    expect(nav.tagName).toBe("NAV");
    expect(nav.querySelectorAll("a").length).toBe(2);
  });

  test("authPageRender creates login form", () => {
    ensureBaseMarkup();
    authPageRender();
    expect(document.querySelector("#login-btn")).not.toBeNull();
    expect(document.querySelector("#signup-btn")).not.toBeNull();
  });

  test("authPageRender replaces existing nav", () => {
    ensureBaseMarkup();
    const oldNav = createNuvDashboard();
    document.body.appendChild(oldNav);

    authPageRender();

    const navs = document.querySelectorAll("nav");
    expect(navs.length).toBe(1);
  });

  test("authPageRender removes old elements", () => {
    ensureBaseMarkup();
    const table = document.createElement("table");
    const addBtn = document.createElement("button");
    addBtn.id = "add-file-btn";
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    document.body.append(table, addBtn, logoutBtn);

    authPageRender();

    expect(document.querySelector("table")).toBeNull();
    expect(document.querySelector("#add-file-btn")).toBeNull();
    expect(document.querySelector("#logout-btn")).toBeNull();
  });

  test("showAlert creates new alert", () => {
    showAlert("Test message");
    const alert = document.querySelector(".alert");
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe("Test message");
  });

  test("showAlert reuses existing alert", () => {
    showAlert("First message");
    showAlert("Second message");
    const alerts = document.querySelectorAll(".alert");
    expect(alerts.length).toBe(1);
    expect(alerts[0].textContent).toBe("Second message");
  });

  test("aboutPageRender shows about content", () => {
    ensureBaseMarkup();
    aboutPageRender();
    expect(document.querySelector("#about-content")).not.toBeNull();
  });

  test("aboutPageRender removes old elements", () => {
    ensureBaseMarkup();
    const table = document.createElement("table");
    const addBtn = document.createElement("button");
    addBtn.id = "add-file-btn";
    document.body.append(table, addBtn);

    aboutPageRender();

    expect(document.querySelector("table")).toBeNull();
    expect(document.querySelector("#add-file-btn")).toBeNull();
  });

  test("aboutPageRender replaces existing nav", () => {
    ensureBaseMarkup();
    const oldNav = createNuvAuth();
    document.body.appendChild(oldNav);

    aboutPageRender();

    const navs = document.querySelectorAll("nav");
    expect(navs.length).toBe(1);
  });

  test("dashBoardPageRender replaces nav", () => {
    ensureBaseMarkup();
    const oldNav = createNuvAuth();
    document.body.appendChild(oldNav);

    dashBoardPageRender([]);

    const navs = document.querySelectorAll("nav");
    expect(navs.length).toBe(1);
  });

  test("dashBoardPageRender removes inputs and buttons", () => {
    ensureBaseMarkup();
    const input = document.createElement("input");
    const button = document.createElement("button");
    const signupBtn = document.createElement("button");
    signupBtn.id = "signup-btn";
    document.body.append(input, button, signupBtn);

    dashBoardPageRender([]);

    expect(document.querySelectorAll("input").length).toBe(0);
    expect(document.querySelector("#signup-btn")).toBeNull();
  });
});
