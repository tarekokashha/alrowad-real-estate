import type { ReactNode } from "react";
import "./globals.css";

// The locale layout owns <html lang/dir>; this root only carries the shell.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
