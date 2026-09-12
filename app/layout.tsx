import type { ReactNode } from "react";

/**
 * The true root, wrapping BOTH the public site and the Payload admin.
 *
 * It deliberately imports no stylesheet. globals.css used to be imported
 * here, which meant the site's design system was also loaded into /admin —
 * and Payload ships its entire stylesheet inside `@layer payload-default`,
 * so globals.css being unlayered outranked every rule in the panel no
 * matter how specific Payload's own rule was. The visible symptom was a
 * login button with an invisible label (`button { color: inherit }` beating
 * `.btn { color: var(--color) }`), but the whole panel was being restyled by
 * a stylesheet that was never meant to reach it.
 *
 * The site's CSS now loads in app/[locale]/layout.tsx, the layout that
 * actually owns the public <html>. The admin gets @payloadcms/next/css plus
 * custom.scss and nothing else.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
