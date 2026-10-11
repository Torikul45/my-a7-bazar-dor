export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#E5EAE5] bg-white shadow-sm">
      {" "}
      <div className="mx-auto flex min-h-17 w-full max-w-6xl flex-col items-center justify-center gap-2 px-5 py-3 text-center text-lg text-[#465047] sm:flex-row sm:justify-between sm:text-left">
        {" "}
        <p className="leading-7">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে। </p>
        <p className="leading-7">
          সকল দাম সপ্তাহান্তে; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
