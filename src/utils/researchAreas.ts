/**
 * Research area lookup, built from the markdown pages in src/pages/Research.
 * Lets other pages link a project's `researchArea` title to its area page.
 */

type AreaModule = {
    frontmatter: { title: string; short?: string; coverImage?: string };
    url: string;
};

const modules = import.meta.glob<AreaModule>("../pages/Research/*.md", {
    eager: true,
});

export const researchAreas = Object.values(modules).map((m) => ({
    title: m.frontmatter.title,
    url: m.url,
    coverImage: m.frontmatter.coverImage,
}));

/** URL of the research area page whose title matches, if any. */
export function researchAreaUrl(title: string | undefined): string | undefined {
    if (!title) return undefined;
    const t = title.trim().toLowerCase();
    return researchAreas.find((a) => a.title.trim().toLowerCase() === t)?.url;
}
