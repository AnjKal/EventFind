import "./globals.css";

export const metadata = {
  title: "EventFind",
  description: "Web-scraped Bangalore tech and AI events by major companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
