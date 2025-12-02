import { onRequestPost as __api_contact_ts_onRequestPost } from "C:\\Users\\Gigabyte\\Documents\\galion-initiative-web\\functions\\api\\contact.ts"
import { onRequestOptions as __api_newsletter_ts_onRequestOptions } from "C:\\Users\\Gigabyte\\Documents\\galion-initiative-web\\functions\\api\\newsletter.ts"
import { onRequestPost as __api_newsletter_ts_onRequestPost } from "C:\\Users\\Gigabyte\\Documents\\galion-initiative-web\\functions\\api\\newsletter.ts"

export const routes = [
    {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/api/newsletter",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_newsletter_ts_onRequestOptions],
    },
  {
      routePath: "/api/newsletter",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_newsletter_ts_onRequestPost],
    },
  ]