// import MinimizedProducts from "./components/Products/minimized-products";

import MinimizedProducts from "./components/Products/minimized-products";

export default async function Home() {
  return (
    <div className="flex flex-col gap-[32px]">
        <div className="l-container flex flex-col items-center justify-center">
          <h1 className="text-6xl">Welcome to the future of T Shirts</h1>
          <p>Wear clothes that matter.</p>
          <div>
           
          </div>
        </div>
        <div className="l-container">
          <MinimizedProducts />
        </div>
    </div>
  );
}
