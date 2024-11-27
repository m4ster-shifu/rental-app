import { Nunito } from 'next/font/google'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import RentModal from './components/modals/RentModal';
import SearchModal from './components/modals/SearchModal';
import Footer from './components/footer/footer';



export const metadata: Metadata = {
  title: "Renting App",
  description: "Renting App",
};

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <SearchModal />
        <RentModal />
        <Navbar currentUser ={currentUser} />

        </ClientOnly>
        <div className='pb-40 pt-48'>
          {children}
        </div>
        <Footer/>
      </body>
    </html>
  );
}
