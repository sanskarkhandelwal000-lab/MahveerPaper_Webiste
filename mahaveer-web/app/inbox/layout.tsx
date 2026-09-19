import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#008069",
};

export default function InboxRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 overflow-hidden bg-wa-panel font-inter text-wa-ink">{children}</div>;
}
