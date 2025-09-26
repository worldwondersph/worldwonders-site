export const metadata = { title: 'WorldWonders' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <a href="/" className="font-bold">WorldWonders</a>
            <div className="space-x-4 text-sm">
              <a href="/visa" className="underline">Visa</a>
              <a href="/contact" className="underline">Contact</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
