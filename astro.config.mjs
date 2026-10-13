// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";

// On GitHub Actions, serve from /<repo-name> unless the repo is a <user>.github.io site.
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isProjectSite = repo && !repo.endsWith(".github.io");

export default defineConfig({
  site: owner ? `https://${owner.toLowerCase()}.github.io` : undefined,
  base: isProjectSite ? `/${repo}` : undefined,

  // Projects now live inside their research areas on /Research.
  // Keep the old index URL working.
  redirects: {
    "/projects": `${isProjectSite ? `/${repo}` : ""}/Research`,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), preact()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});