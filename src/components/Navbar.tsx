import Image from "next/image";
import Link from "next/link";
import { Noto_Serif_Bengali } from "next/font/google";
import Logo from "@/assets/logo-icon.png";
import CategoryMenu from "@/components/CategoryMenu";
import PriceTicker from "@/components/PriceTicker";
import NavbarAuth from "@/components/NavbarAuth";
import { getCategories } from "@/lib/categories";

const bengaliFont = Noto_Serif_Bengali({
subsets: ["latin", "bengali"],
});

function getBanglaDate() {
return new Intl.DateTimeFormat("bn-BD", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
timeZone: "Asia/Dhaka",
}).format(new Date());
}

export default async function Navbar() {
const categories = await getCategories();
const currentDate = getBanglaDate();

return (
<>
{/* Fixed Navbar */} <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
{/* Header row */} <div className="h-15.5 border-b border-gray-200 bg-white"> <div className="mx-auto flex h-full max-w-300 items-center justify-between px-4"> <Link href="/" className="flex shrink-0 items-center gap-2"> <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#05893E]"> <Image
               src={Logo}
               alt="বাজার দর"
               width={32}
               height={32}
               quality={75}
               className="object-contain"
               priority
             /> </div>


          <div className="leading-tight">
            <h1 className="text-xl font-bold text-gray-900">
              বাজার দর
            </h1>

            <p
              className={`${bengaliFont.className} text-[10px] text-gray-500`}
            >
              {currentDate}
            </p>
          </div>
        </Link>

        <NavbarAuth />
      </div>
    </div>

    {/* Category row */}
    <nav className="h-13 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-300 items-center px-2 sm:px-4">
        <CategoryMenu categories={categories} />
      </div>
    </nav>

    {/* Price ticker */}
    <div className="min-h-9 bg-white">
      <PriceTicker />
    </div>
  </header>

  {/* Reserve space for the fixed navbar */}
  <div aria-hidden="true" className="h-37.5" />
</>


);
}
