import { HeimrBook } from "../src/types";

export const getHeimrBook = (
  $: CheerioStatic,
  $section: Cheerio,
  root: string = ""
): HeimrBook[] => {
  let html = $section.html() as string;
  const $bookHeading = $section.find(".book-heading").first();
  const sectionName = $bookHeading.text();
  const sectionPath = root + toKababCase(sectionName);
  const $subsections = getSubsections($, $section);

  const subsections: HeimrBook[] = [];
  $subsections.each((_, subsection) => {
    const $subsection = $(subsection);
    // Strip the subsections out. We'll save those separately
    const id = $subsection.attr("id") as string;
    const subHtml = $.html(`#${id}`) as string;
    html = html.replace(subHtml, "").trim();

    // Flatten all subsections
    subsections.push(...getHeimrBook($, $subsection, sectionPath + "/"));
  });

  return [
    {
      sectionName,
      sectionPath,
      html,
      subsections: subsections.map(({ sectionPath }) => sectionPath)
    },
    ...subsections
  ];
};

function getSubsections($: CheerioStatic, $section: Cheerio): Cheerio {
  const classMatch = ($section.attr("class") || "").match(/section-([0-9])/);
  let sectionLevel = 0;
  if (classMatch && parseInt(classMatch[1])) {
    sectionLevel = parseInt(classMatch[1]);
  }
  return $section.find(`.section-${sectionLevel + 1}`);
}

function toKababCase(str: string): string {
  return str
    .split(" ")
    .map((word, index) => {
      return (index !== 0 ? "-" : "") + word.toLowerCase();
    })
    .join("");
}
