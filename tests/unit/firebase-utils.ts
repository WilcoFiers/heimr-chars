import fs from "fs";
import {
  initializeTestApp,
  loadFirestoreRules,
  apps,
  assertFails,
  assertSucceeds
} from "@firebase/testing";

type Data = {
  [propName: string]: any;
};

let rules: string;

export async function setup(
  auth?: object,
  data?: Data
): Promise<firebase.firestore.Firestore> {
  const projectId = `rules-spec-${Date.now()}`;
  const app = await initializeTestApp({ projectId, auth });
  const db = app.firestore();

  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  if (!rules) {
    rules = fs.readFileSync("./firebase/firestore.rules", "utf8");
  }

  await loadFirestoreRules({
    projectId,
    rules
  });
  return db;
}

export function tearDown() {
  Promise.all(apps().map(app => app.delete()));
}

if (expect) {
  expect.extend({
    async toBeAllowed(x) {
      try {
        await assertSucceeds(x);
        return {
          pass: true,
          message: () => "Firebased operation allowed"
        };
      } catch (e) {
        return {
          pass: false,
          message: () =>
            `Expect Firebase operation to bellowed, but errored with: ${e.message}`
        };
      }
    },

    async toBeDenied(x) {
      const message = () =>
        `Expect Firebase operation to be denied, but it failed`;
      try {
        await assertFails(x);
        return { pass: true, message };
      } catch (e) {
        return { pass: false, message };
      }
    }
  });
}

declare global {
  namespace jest {
    // required for expect(expected).toBeRandomId()
    interface Matchers<R, T> {
      toBeAllowed(): Promise<object>;
      toBeDenied(): Promise<object>;
    }
  }
}
