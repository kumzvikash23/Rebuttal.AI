import Head from "next/head";
import Navbar from "../components/Navbar";
import Marquee from "react-fast-marquee";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Head>  
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* make a container that has two divs that take up half a row on the same row, when in mobile view, make them stack on top of eachother */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-[2px] border-black">
        <div className="bg-[#ff90e8] border-r-[2px] border-black">
          <h1 className="text-6xl md:text-7xl md:font-normal  font-bold text-left align-center pt-20 pl-20 xs:text-6xl">
            Welcome to
            <br /> Rebuttal.AI 
          </h1>
          <p className="text-2xl md:text-left align-center pt-10 pl-20 pr-28 xs:text-center">
            Join live debates, challenge your friends, and improve your argumentation skills.<br />
            Explore trending topics or start your own debate now!
          </p>
          <div className="flex justify-center pt-10 pb-10 ">
            <Link href="/auth" legacyBehavior>
              <a className="bg-black text-white text-2xl py-3 px-10 rounded-md w-3/5 flex items-center justify-center hover:bg-pink-600 transition">
                Start Debating
              </a>
            </Link>
          </div>
        </div>

        <div className="bg-[#ffc900]">
          <img
            src="/Landing Page Image.avif"
            alt="Debate illustration"
            className="w-3/5 mx-auto pt-20"
          />
          <h1 className="text-2xl md:text-2xl md:font-normal text-left align-center pt-20 pl-1 xs:text-6xl">
            Engage in thought-provoking discussions
          </h1>
        </div>
      </div>

      <Marquee
        gradient={false}
        speed={20}
        className="bg-black text-7xl text-center pt-10 pb-10 text-white"
      >
        <h1>
          {" "}
          Debate • Discuss • Challenge • Learn • Debate • Discuss • Challenge • Learn •
        </h1>
      </Marquee>
    </>
  );
};

export default Home;
