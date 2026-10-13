/** Prefix an internal path with the site's base path (e.g. "/MARC-Website-Redesign"). */
export function withBase(path: string): string {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    return `${base}${path}`;
}
