import Navigation from "@/app/components/admin/Navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <section className="bg-slate-300 p-2">
        <Navigation />
      </section>
      {children}
      <footer></footer>
    </main>
  );
}
