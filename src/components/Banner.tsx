import Image from "next/image";
import BannerImage from "@/assets/bazar-hero.png";

export default function Banner() {
  return (
    <section className="mx-auto max-w-300 px-4 pt-0 pb-4 md:pt-0 md:pb-5">
      <div className="relative overflow-hidden rounded-[22px] border border-[#DFE8E1] bg-[#FBFDFB]">
        <div className="grid min-h-95 items-center md:grid-cols-[1.4fr_0.6fr]">
          {/* Left Content */}
          <div className="relative z-10 px-6 py-8 md:px-10">
            {/* Date */}
            <span className="mb-4 inline-block rounded-full bg-[#E4F4E8] px-4 py-2 text-sm font-medium text-[#238B50]">
              {new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {/* Heading */}
            <h1 className="mt-4 whitespace-nowrap text-2xl font-bold leading-tight text-[#202A23] sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Description */}
            <p className="mt-5 text-base leading-7 text-[#69736C] lg:text-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-
              <br />
              সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Button */}
            <a
              href="#সব-পণ্য"
              className="mt-7 inline-block rounded-lg bg-[#078B43] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#067638]"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          {/* Right Image */}
          <div className="relative h-72 md:h-95">
            <Image
              src={BannerImage}
              alt="বাজারের পণ্য"
              fill
              priority
              className="object-contain object-bottom-right"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
