import { Footer } from "@/components/alsun/footer";
import Navbar, { NavbarThemeProvider } from "@/components/alsun/navbar";

export default async function DecoratedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative grid min-h-screen grid-rows-[auto_1fr_auto]">
      <NavbarThemeProvider>
        <Navbar />
        <div className="relative">{children}</div>
        <Footer />
      </NavbarThemeProvider>
    </div>
  );
}
