import Logo from "./_components/Logo";
import Navigation from "./_components/Navigation";
import { Josefin_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import { ReservationProvider } from "./_components/ReservationContext";
export const metadata = {
  title: "%s The Wild Oasis",
  default: "Welcome / The Wild Oasis",
  description: "The Wild Oasis is a beautiful place to relax and unwind.",
};
// This is the root layout for the application. It wraps all pages and components.
// It includes the navigation bar and the main content area.
// The metadata object contains information about the application, such as the title and description.

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

console.log(josefin.className);
function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-900 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="w-full mx-auto max-w-7xl">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
