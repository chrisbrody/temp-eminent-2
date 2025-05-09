// prismicio.ts
import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers. This list determines a Prismic document's URL.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "page", path: "/", uid: "home" },
  { type: "page", path: "/:uid" },
  { type: "featured_project", path: "/projects/:uid" },
  { type: "settings", path: "/" },
  { type: "navigation", path: "/" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (
    config: prismic.ClientConfig = {},
    // Add a second argument for Next.js specific config, including cookies
    nextConfig: { cookies?: () => ReadonlyRequestCookies } = {}
) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
        process.env.NODE_ENV === "production"
            ? { next: { tags: ["prismic"] }, cache: "force-cache" }
            : { next: { revalidate: 5 } },
    ...config,
  });

  // Pass the cookies from nextConfig to enableAutoPreviews
  prismicNext.enableAutoPreviews({ client, cookies: nextConfig.cookies });

  return client;
};
