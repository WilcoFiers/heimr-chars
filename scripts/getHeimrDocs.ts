// Make sure to run this with ./scripts/tsconfig.json
import request from "request";
import cheerio from "cheerio";
import fs from "fs";
import {
  Domain,
  RaceCard,
  SkillCard,
  ConditionCard,
  ItemCard,
  ConsumableCard,
  HeimrBook,
  GlyphCard,
  ComplicationCard
} from "../src/types";
import {
  RuleObject,
  toSkill,
  toCondition,
  toItem,
  toRace,
  toConsumable
} from "./toCardObject";
import { toGlyph } from "./toGlyph";
import { toComplication } from "./toComplication";
import { getHeimrBook } from "./getHeimrBook";

const url = "http://heimr.nl/book/export/html/1838";
const cardTypes = [
  "skill",
  "condition",
  "item",
  "race",
  "consumable",
  "glyph",
  "complication"
];

console.log("loading " + url);

// Load the page
request(url, (error, response, html) => {
  if (error) {
    throw new Error(error);
  } else if (response.statusCode != 200) {
    throw new Error(
      `Request for ${url} responded with statusCode ${response.statusCode}`
    );
  }

  const $ = cheerio.load(html);
  const races: RaceCard[] = [];
  const glyphs: GlyphCard[] = [];
  const complications: ComplicationCard[] = [];
  const domains: Domain[] = [];
  const heimrBooks: HeimrBook[] = [];

  $(".section-3").each((_, elm) => {
    const $domain = $(elm);
    const domainName = $domain
      .find("h1")
      .first()
      .text();

    const ruleObjects: RuleObject[] = [];
    $domain.find("table").each((_, elm) => {
      const $table = $(elm);
      const type = $table
        .find("th")
        .first()
        .text()
        .toLowerCase();

      const name = $table
        .find("td, th")
        .first()
        .next()
        .text();

      if (!cardTypes.includes(type)) {
        return;
      }
      const ruleObj = tableToRuleObject($, $table);
      ruleObj.name = [name];
      ruleObj.type = [type];
      if (type === "complication") {
        ruleObj.meta = [$table.prev().text()];
      }

      ruleObjects.push(ruleObj);
    });

    const skills: SkillCard[] = ruleObjects.map(toSkill).filter(notNull);
    const conditions: ConditionCard[] = ruleObjects
      .map(toCondition)
      .filter(notNull);
    const items: ItemCard[] = ruleObjects.map(toItem).filter(notNull);
    const consumables: ConsumableCard[] = ruleObjects
      .map(toConsumable)
      .filter(notNull);

    const newRaces: RaceCard[] = ruleObjects.map(toRace).filter(notNull);
    if (newRaces.length) {
      races.push(...newRaces);
    }

    glyphs.push(...ruleObjects.map(toGlyph).filter(notNull));
    complications.push(...ruleObjects.map(toComplication).filter(notNull));

    if (skills.length || conditions.length || items.length) {
      domains.push({
        domainName,
        skills,
        conditions,
        items,
        consumables
      });
      // Save the book as a domains book
      heimrBooks.push(...getHeimrBook($, $domain, "domains/"));
    } else {
      // Save the section as a book
      heimrBooks.push(...getHeimrBook($, $domain));
    }
  });

  const date = new Date().toISOString();
  const heimrData = JSON.stringify(
    { date, races, domains, glyphs, complications },
    null,
    2
  );
  console.log("creating file at /src/assets/heimr-data.json");
  fs.writeFileSync("../src/assets/heimr-data.json", heimrData, "utf-8");

  const booksString = JSON.stringify({ date, heimrBooks }, null, 2);
  console.log("creating file at /src/assets/heimr-books.json");
  fs.writeFileSync("../src/assets/heimr-books.json", booksString, "utf8");
});

function tableToRuleObject($: CheerioStatic, $table: Cheerio): RuleObject {
  let previousKey: string = "";
  const returnVal: RuleObject = {};

  $table.find("tr").each((_, elm) => {
    let key = $("th", elm)
      .first()
      .text()
      .toLowerCase();

    let val = $("td", elm)
      .first()
      .text();

    // It the first th and td are empty, and there is a second td, append it to the previous value
    // This is used in glyphs
    if (!val && !key && previousKey) {
      val = $("td", elm)
        .first()
        .next()
        .text();
      if (val) {
        key = previousKey;
      }
    }

    if (typeof returnVal[key] === "undefined") {
      returnVal[key] = [val];
    } else {
      returnVal[key].push(val);
    }
    previousKey = key;
  });
  return returnVal;
}

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}
