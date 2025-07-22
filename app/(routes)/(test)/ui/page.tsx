import { Button } from "@/components/ui/button";

export default function TestUIPage() {
  return (
    <div className="p-4 w-screen flex justify-center gap-4 flex-wrap wrap">
      <button
        className="transition duration-150 btn btn-primary group hover:scale-[.96] hover:rounded-box
      active:scale-[.93]"
      >
        <span
          className="transition duration-150 group-hover:opacity-90 group-hover:scale-[1.0416]
        group-active:scale-[1.0752]"
        >
          Click me
        </span>
      </button>
      <Button>Buy Now</Button>
      <Button variant="destructive">Buy Now</Button>
      <Button variant="outline">Buy Now</Button>
      <Button variant="ghost">Buy Now</Button>
      <Button variant="secondary">Buy Now</Button>
      {/* <button className="btn btn-secondary ml-2">Secondary</button> */}
    </div>
  );
}
