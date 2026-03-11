const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  WORK_SESSION_TTL_MS,
  buildPersistedEnvelope,
  readPersistedEnvelope,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/utils/persistenceEnvelope.js"));

test("persistence envelopes include expiry for work-session data", () => {
  const envelope = buildPersistedEnvelope({ patient: true }, { ttlMs: WORK_SESSION_TTL_MS }, 1_000);
  assert.deepEqual(envelope, {
    value: { patient: true },
    savedAt: 1_000,
    expiresAt: 1_000 + WORK_SESSION_TTL_MS,
  });
});

test("persistence envelope reader supports legacy values and expires stale work data", () => {
  assert.deepEqual(
    readPersistedEnvelope(JSON.stringify(["legacy"]), [], 5_000),
    { value: ["legacy"], expired: false },
  );

  assert.deepEqual(
    readPersistedEnvelope(
      JSON.stringify({ value: { active: true }, savedAt: 1_000, expiresAt: 2_000 }),
      { active: false },
      3_000,
    ),
    { value: { active: false }, expired: true },
  );
});
