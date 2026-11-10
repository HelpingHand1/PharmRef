const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { createAppHistory, normalizeHash } = require(path.join(validationRoot, "utils/appHistory.js"));
const { hashToState, resolveNextRoute, routeToHash } = require(path.join(validationRoot, "utils/navigationState.js"));

// A browser history stack small enough to reason about: entries, a cursor, and
// popstate delivered on a later tick, the way a real back() behaves.
function createBrowser(initialHash = "#/") {
  const entries = [{ state: null, hash: initialHash }];
  let index = 0;
  let scrollY = 0;
  const listeners = new Set();
  const deferred = [];
  const pendingPops = [];

  const env = {
    history: {
      get state() {
        return entries[index].state;
      },
      pushState(state, _unused, url) {
        entries.splice(index + 1);
        entries.push({ state, hash: url ?? entries[index].hash });
        index += 1;
      },
      replaceState(state, _unused, url) {
        entries[index] = { state, hash: url ?? entries[index].hash };
      },
      back() {
        pendingPops.push(-1);
      },
    },
    getHash: () => entries[index].hash,
    getScrollY: () => scrollY,
    onPopState(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    defer(callback) {
      deferred.push(callback);
    },
  };

  const browser = {
    env,
    entries,
    get index() {
      return index;
    },
    get hash() {
      return entries[index].hash;
    },
    get state() {
      return entries[index].state;
    },
    scrollTo(y) {
      scrollY = y;
    },
    /** Run queued deferred work and queued traversals until nothing is left. */
    settle() {
      let guard = 0;
      while ((deferred.length > 0 || pendingPops.length > 0) && guard < 100) {
        guard += 1;
        if (pendingPops.length > 0) {
          const delta = pendingPops.shift();
          const next = index + delta;
          if (next >= 0 && next < entries.length) {
            index = next;
            listeners.forEach((listener) => listener());
          }
          continue;
        }
        deferred.shift()();
      }
    },
    /**
     * The user pressing back (or forward). `react` stands in for the render the
     * popstate causes, which commits before any deferred history work runs.
     */
    userTraverse(delta, react = () => {}) {
      const next = index + delta;
      assert.ok(next >= 0 && next < entries.length, "traversal stays inside the stack");
      index = next;
      listeners.forEach((listener) => listener());
      react();
      browser.settle();
    },
  };
  return browser;
}

// The app side: what App.tsx keeps per page.
function createApp(browser) {
  const app = {
    open: {},
    q: "",
    route: browser.hash,
    restoredY: null,
    changes: [],
  };
  const history = createAppHistory(browser.env);
  history.start({
    capture: () => ({ open: app.open, q: app.q }),
    onRouteChange: (change) => {
      app.route = change.hash;
      app.open = change.open;
      app.restoredY = change.y;
      if (change.q !== null) app.q = change.q;
      app.changes.push(change);
    },
  });
  app.history = history;
  app.go = (hash) => {
    history.navigate(hash);
    app.route = normalizeHash(hash);
    app.open = {};
    browser.scrollTo(0);
    browser.settle();
  };
  return app;
}

test("each page visit is a history entry and back restores scroll and open sections", () => {
  const browser = createBrowser();
  const app = createApp(browser);

  app.go("#/cap");
  app.go("#/cap/cap-inpatient");
  app.open = { pearls: true };
  browser.scrollTo(900);
  app.go("#/uti/drug/ceftriaxone");

  assert.equal(browser.entries.length, 4);
  assert.equal(browser.hash, "#/uti/drug/ceftriaxone");

  browser.userTraverse(-1);
  assert.equal(app.route, "#/cap/cap-inpatient");
  assert.deepEqual(app.open, { pearls: true });
  assert.equal(app.restoredY, 900);

  browser.userTraverse(-1);
  assert.equal(app.route, "#/cap");
  assert.deepEqual(app.open, {});
  assert.equal(app.restoredY, 0);

  browser.userTraverse(1);
  assert.equal(app.route, "#/cap/cap-inpatient");
  assert.deepEqual(app.open, { pearls: true });
});

test("navigating to the page already showing adds nothing", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  assert.equal(app.history.navigate("#/cap"), false);
  assert.equal(browser.entries.length, 1);
  assert.equal(normalizeHash(""), "#/");
  assert.equal(normalizeHash("#"), "#/");
});

test("back closes an open dialog instead of leaving the page", () => {
  const browser = createBrowser("#/cap/cap-inpatient");
  const app = createApp(browser);
  browser.scrollTo(640);
  app.open = { empiric: true };

  let dialogOpen = true;
  const close = app.history.openOverlay(() => {
    dialogOpen = false;
  });
  browser.settle();

  assert.equal(browser.entries.length, 2, "one overlay entry on top of the page");
  assert.equal(browser.state.kind, "overlay");
  assert.equal(browser.hash, "#/cap/cap-inpatient");

  browser.userTraverse(-1);
  close();
  browser.settle();

  assert.equal(dialogOpen, false);
  assert.equal(app.route, "#/cap/cap-inpatient", "still on the page");
  assert.equal(app.restoredY, 640);
  assert.deepEqual(app.open, { empiric: true });
  assert.equal(app.history.inspect().overlayCount, 0);
  assert.equal(browser.index, 0);
});

test("closing a dialog from its own button removes its history entry", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  const close = app.history.openOverlay(() => assert.fail("dismiss is only for back"));
  browser.settle();
  assert.equal(browser.index, 1);

  close();
  browser.settle();

  assert.equal(browser.index, 0, "stepped back off the overlay entry");
  assert.equal(app.route, "#/cap");
  assert.equal(app.history.inspect().selfBackPending, false);
});

test("several open layers share one entry and back peels them one at a time", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  const closed = [];
  const closeSheet = app.history.openOverlay(() => closed.push("sheet"));
  const closeDialog = app.history.openOverlay(() => closed.push("dialog"));
  browser.settle();
  assert.equal(browser.entries.length, 2);

  browser.userTraverse(-1);
  closeDialog();
  browser.settle();
  assert.deepEqual(closed, ["dialog"]);
  assert.equal(browser.state.kind, "overlay", "the remaining layer gets its entry back");

  browser.userTraverse(-1);
  closeSheet();
  browser.settle();
  assert.deepEqual(closed, ["dialog", "sheet"]);
  assert.equal(browser.index, 0);
});

test("swapping one layer for another in the same tick keeps a single entry", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  const closeSheet = app.history.openOverlay(() => {});
  browser.settle();
  closeSheet();
  const closeDialog = app.history.openOverlay(() => {});
  browser.settle();

  assert.equal(browser.entries.length, 2);
  assert.equal(browser.index, 1);
  closeDialog();
  browser.settle();
  assert.equal(browser.index, 0);
});

test("a search result opens on top of the results, and back returns to them", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);
  browser.scrollTo(300);

  // Typing activates search.
  app.q = "cefep";
  let closeSearch = app.history.openOverlay(() => {
    app.q = "";
  });
  browser.settle();
  browser.scrollTo(120);

  // Tapping a result: the app clears search after navigating.
  app.history.navigate("#/hap-vap/drug/cefepime");
  app.route = "#/hap-vap/drug/cefepime";
  app.q = "";
  closeSearch();
  browser.settle();

  assert.deepEqual(
    browser.entries.map((entry) => [entry.hash, entry.state?.kind, entry.state?.q ?? ""]),
    [
      ["#/cap", "route", ""],
      ["#/cap", "overlay", "cefep"],
      ["#/hap-vap/drug/cefepime", "route", ""],
    ],
  );

  // Back: results come back, at the offset they were left, and the restored
  // search claims the entry it came from.
  browser.userTraverse(-1, () => {
    assert.equal(app.q, "cefep");
    closeSearch = app.history.openOverlay(() => {
      app.q = "";
    });
  });
  assert.equal(app.route, "#/cap");
  assert.equal(app.restoredY, 120);
  assert.equal(browser.index, 1, "the kept entry is reused, not duplicated");
  assert.equal(browser.entries.length, 3);

  // Back again: search closes and the page underneath is where it was.
  browser.userTraverse(-1);
  closeSearch();
  browser.settle();
  assert.equal(app.q, "");
  assert.equal(app.route, "#/cap");
  assert.equal(app.restoredY, 300);
  assert.equal(browser.index, 0);
});

test("kept search results that nothing re-opens are stepped over", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  app.q = "vanc";
  const closeSearch = app.history.openOverlay(() => {});
  browser.settle();
  app.history.navigate("#/calculators");
  app.q = "";
  closeSearch();
  browser.settle();

  // Back, but the app never restores the search (nothing claims the entry).
  browser.userTraverse(-1);
  assert.equal(browser.index, 0, "falls through to the page instead of stranding on a dead entry");
  assert.equal(app.route, "#/cap");
});

test("a dialog that launches a navigation hands its entry to the new page", () => {
  const browser = createBrowser("#/cap");
  const app = createApp(browser);

  const closePalette = app.history.openOverlay(() => {});
  browser.settle();

  closePalette();
  app.history.navigate("#/calculators");
  app.route = "#/calculators";
  browser.settle();

  assert.deepEqual(browser.entries.map((entry) => entry.hash), ["#/cap", "#/calculators"]);
  assert.equal(browser.state.kind, "route");

  browser.userTraverse(-1);
  assert.equal(app.route, "#/cap");
});

test("redirects replace the current entry", () => {
  const browser = createBrowser("#/cap/drug/ceftriaxone");
  const app = createApp(browser);

  app.history.navigate("#/uti/drug/ceftriaxone", { replace: true });
  assert.equal(browser.entries.length, 1);
  assert.equal(browser.hash, "#/uti/drug/ceftriaxone");
});

test("a reload that lands on a leftover overlay entry starts as a plain page", () => {
  const browser = createBrowser("#/cap");
  browser.env.history.replaceState({ __pr: true, kind: "overlay" }, "");
  const app = createApp(browser);

  assert.equal(browser.state.kind, "route");
  app.go("#/sepsis");
  assert.equal(browser.entries.length, 2);
});

test("history writes that throw do not break navigation", () => {
  const browser = createBrowser("#/cap");
  browser.env.history.pushState = () => {
    throw new Error("SecurityError");
  };
  const app = createApp(browser);

  assert.doesNotThrow(() => app.history.navigate("#/sepsis"));
  assert.doesNotThrow(() => {
    app.history.openOverlay(() => {});
    browser.settle();
  });
});

test("navigateTo resolves the next route from the current one", () => {
  const home = hashToState("#/");
  const pathway = resolveNextRoute(home, "subcategory", { diseaseId: "cap", subcategoryId: "cap-inpatient" });
  assert.equal(routeToHash(pathway), "#/cap/cap-inpatient");

  // A monograph opened from a pathway keeps the topic unless told otherwise.
  const monograph = resolveNextRoute(pathway, "monograph", { monograph: { id: "ceftriaxone" } });
  assert.equal(routeToHash(monograph), "#/cap/drug/ceftriaxone");

  const overview = resolveNextRoute(monograph, "disease_overview");
  assert.deepEqual(overview, { ...hashToState("#/cap") });

  const calculators = resolveNextRoute(monograph, "calculators");
  assert.equal(routeToHash(calculators), "#/calculators");
  assert.equal(calculators.diseaseId, null);

  const pathogen = resolveNextRoute(home, "pathogen", { pathogenId: "mrsa" });
  assert.equal(routeToHash(pathogen), "#/pathogen/mrsa");
});
