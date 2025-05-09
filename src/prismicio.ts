// prismicio.ts
import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";
import type { CreateClientConfig } from "@prismicio/next";

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
    config: prismic.ClientConfig & CreateClientConfig = {}
) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions: {
      next: {
        tags: ["prismic"],
        revalidate: process.env.NODE_ENV === "production" ? false : 5,
      },
    },
    ...config,
  });

  // enableAutoPreviews only needs the client instance
  // It will automatically look for the 'cookies' property on the client's config
  prismicNext.enableAutoPreviews({ client });

  return client;
};