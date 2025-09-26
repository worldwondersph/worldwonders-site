export const metadata = { title: 'WorldWonders' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <link href="/" className="font-bold">WorldWonders</link>
            <div className="space-x-4 text-sm">
              <link href="/visa" className="underline">Visa</link>
              <link href="/contact" className="underline">Contact</link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
