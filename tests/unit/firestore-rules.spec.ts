import { setup, tearDown } from "./firebase-utils";
import { Character, CharacterCol } from "@/types";

describe("db rules", () => {
  let db: firebase.firestore.Firestore,
    ref: firebase.firestore.CollectionReference;
  beforeAll(async () => {
    db = await setup();
    ref = db.collection("does-not-exist");
  });

  afterAll(async () => {
    await tearDown();
  });

  function defaultChar(data = {}): Character {
    return {
      playerID: "some-unknown",
      name: "henk",
      archive: false,
      race: "human",
      ...data
    };
  }

  describe("when signed in", () => {
    const auth = {
      uid: "heimr-fan123",
      email: "hello@heimr.nl"
    };

    it("allows creation if playerID = auth.uid", async () => {
      const db = await setup(auth);
      const charactersRef: CharacterCol = db.collection("characters");
      const newChar = defaultChar({ playerID: auth.uid });
      await expect(charactersRef.add(newChar)).toBeAllowed();
    });

    it("denies creation if playerID != auth.uid", async () => {
      const db = await setup(auth);
      const charactersRef: CharacterCol = db.collection("characters");
      const newChar = defaultChar({ playerID: "not-auth-uid" });
      await expect(charactersRef.add(newChar)).toBeDenied();
    });

    // This test is broken because of a bug in the emulator
    it.skip("allows read & update if playerID == auth.uid", async () => {
      const db = await setup(auth, {
        "characters/foo": defaultChar({ playerID: auth.uid })
      });
      const charactersRef: CharacterCol = db.collection("characters");
      const charRef = charactersRef.doc("foo");

      await expect(charRef.get()).toBeAllowed();
      await expect(charRef.set({ name: "Ghastor" })).toBeAllowed();
    });

    it("denies updating playerID", async () => {
      const db = await setup(auth, {
        "characters/foo": defaultChar({ playerID: auth.uid })
      });
      const charactersRef: CharacterCol = db.collection("characters");
      const charRef = charactersRef.doc("foo");
      await expect(charRef.set({ playerID: "char-thief" })).toBeDenied();
    });

    it("denies deletion", async () => {
      const db = await setup(auth, {
        "characters/foo": defaultChar({ playerID: auth.uid })
      });
      const charactersRef: CharacterCol = db.collection("characters");
      const charRef = charactersRef.doc("foo");
      expect(charRef.delete()).toBeDenied();
    });

    describe("rules", () => {
      it("allows adding rules for auth.uid == playerID", async () => {
        const db = await setup(auth, {
          "characters/foo": defaultChar({ playerID: auth.uid })
        });
        const rulesRef = db.collection("characters/foo/rules");
        const item = { type: "item", name: "Big damn shield" };
        expect(rulesRef.add(item)).toBeAllowed();
      });
    });

    it.skip("passes when authorised", async () => {
      const db = await setup(auth, {
        "characters/foo": {
          name: "billy",
          playerID: auth.uid,
          face: "human",
          archive: false
        }
      });
      const commentsRef = db.collection("characters");
      await expect(commentsRef.get()).toBeAllowed();
    });
  });
});
