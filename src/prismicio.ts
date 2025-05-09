// prismicio.ts
import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";
// Import the type for the cookies object
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
 * @param config - Configuration for the Prismic client. Manually add the cookies property type.
 */
export const createClient = (
    // Manually augment the ClientConfig type to include the optional cookies property
    config: prismic.ClientConfig & { cookies?: ReadonlyRequestCookies } = {}
) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
        process.env.NODE_ENV === "production"
            ? { next: { tags: ["prismic"] }, cache: "force-cache" }
            : { next: { revalidate: 5 } },
    ...config, // Spread the config, which now is typed to allow 'cookies'
  });

  // enableAutoPreviews only needs the client instance
  // It will automatically look for the 'cookies' property on the client's config
  prismicNext.enableAutoPreviews({ client });

  return client;
};