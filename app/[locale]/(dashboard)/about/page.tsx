import Image from "next/image";
import { Link } from "@/i18n/routing";

const About = () => {
  return (
    <main className="flex flex-col flex-grow bg-gray-100 dark:bg-dark">
      <section className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/XPB_1225721_HiRes.webp"
          alt="F1 Track"
          fill
          className="object-cover w-full h-96"
          // width={10}
          // height={10}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            About F1 Store
          </h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <Image
              src="https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/0_MAIN-Motor-racing-Italian-Grand-Prix-Monza-Italy-5th-September-1971-Great-Britains-Peter-Gethin-le.webp"
              alt="F1 History"
              width={600}
              height={400}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="md:w-1/2 text-gray-800 dark:text-gray-100">
            <p className="text-lg">
              Welcome to F1 Store, the ultimate destination for Formula 1
              enthusiasts. Our mission is to celebrate the speed, passion, and
              legacy of Formula 1 by offering an exclusive range of merchandise,
              premium membership benefits, and unique collectibles.
            </p>
            <p className="mt-6 text-lg">
              Inspired by the thrill of the race, every product is crafted to
              capture the essence of the sport. Whether you&apos;re a longtime
              fan or new to the world of F1, you&apos;ll find something
              extraordinary in our collection. Experience the adrenaline, the
              innovation, and the history of Formula 1 with us.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-red-600 dark:bg-yellow-500 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white dark:text-gray-900">
            Join the Race
          </h2>
          <p className="mt-4 text-lg text-white dark:text-gray-900">
            Become a premium member today and gain access to exclusive deals,
            early releases, and behind-the-scenes content.
          </p>
          <Link href="/pricing">
            <button className="mt-6 px-8 py-3 bg-white dark:bg-gray-900 text-red-600 dark:text-yellow-500 font-semibold rounded-full shadow hover:shadow-lg transition duration-300">
              Subscribe Now
            </button>
          </Link>
        </div>
      </section>
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Our Legacy
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            For decades, Formula 1 has been at the pinnacle of motorsport,
            inspiring generations with its cutting-edge technology, exhilarating
            races, and unforgettable champions. We celebrate this legacy by
            bringing you the finest selection of memorabilia and merchandise
            that honors the spirit of F1.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-red-600 dark:text-yellow-500">
                Champions
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Celebrating legends and champions that made history.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-red-600 dark:text-yellow-500">
                Innovation
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Pushing the boundaries of technology and performance.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-red-600 dark:text-yellow-500">
                Heritage
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Honoring the rich heritage and storied past of F1.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
