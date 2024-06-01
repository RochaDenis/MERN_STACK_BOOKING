import Footer from "../assets/components/Footer";
import Header from "../assets/components/Header";
import Hero from "../assets/components/Hero";

interface Props {
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto py-10 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
