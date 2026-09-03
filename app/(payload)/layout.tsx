import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";
import "./custom.scss";

/**
 * The admin has its own root layout, separate from the public site's.
 * Payload renders its own <html> with the direction set from the admin
 * language, so the site's RTL chrome and design tokens must not leak in.
 */
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
