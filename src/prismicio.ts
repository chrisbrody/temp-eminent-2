// prismicio.ts
import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import {ClientConfig} from "@prismicio/client";

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
 * @param nextConfig - Configuration specific to Next.js, like cookies.
 */
export const createClient = (
    config: prismic.ClientConfig = {},
    nextConfig: { cookies?: ReadonlyRequestCookies } = {}
) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
        process.env.NODE_ENV === "production"
            ? { next: { tags: ["prismic"] }, cache: "force-cache" }
            : { next: { revalidate: 5 } },
    ...config,
  });

  // **Conditional call:** Only enable auto-previews if cookies are provided
  if (nextConfig.cookies) {
    prismicNext.enableAutoPreviews({ client, cookies: nextConfig.cookies });
  }


  return client;
};