/**
 * Plain-text excerpt from a markdown body: drops images, links' URLs,
 * headings markers and emphasis, collapses whitespace, and trims to
 * `max` characters on a word boundary.
 */
export function excerpt(markdown: string | undefined, max = 180): string {
    if (!markdown) return "";
    const text = markdown
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
        .replace(/^#+\s*/gm, "") // heading markers
        .replace(/[*_`>]/g, "") // emphasis / code / quotes
        .replace(/\s+/g, " ")
        .trim();
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/** "5 Feb 2025" style date. */
export function formatDate(d: Date | string, opts?: Intl.DateTimeFormatOptions): string {
    return new Date(d).toLocaleDateString(
        "en-GB",
        opts ?? { day: "numeric", month: "short", year: "numeric" },
    );
}
