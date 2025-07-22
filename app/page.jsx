// import MinimizedProducts from "./components/Products/minimized-products";

import MinimizedProducts from "./components/Products/minimized-products";

export default async function Home() {
  return (
    <section className="flex flex-col gap-[32px]">
      <div className="flex flex-col l-container">
        <h1>Welcome to the future of T-Shirts</h1>
        <p>Wear clothes that matter.</p>
      </div>
      <div className="l-container">
        <MinimizedProducts />
      </div>
    </section>
  );
}
