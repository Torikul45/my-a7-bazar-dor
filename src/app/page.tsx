import Banner from "@/components/Banner";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1F5F1] pt-3">
      {" "}
      <Banner /> <ProductList />{" "}
    </main>
  );
}
