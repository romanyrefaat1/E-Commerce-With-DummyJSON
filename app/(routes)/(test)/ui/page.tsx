export default function TestUIPage() {
  console.log(1 / 0.93);
  return (
    <div className="p-4 bg-red-500 w-screen">
      <button
        className="transition duration-150 btn btn-secondary group hover:scale-[.96] hover:rounded-box
      active:scale-[.93]"
      >
        <span
          className="transition duration-150 group-hover:opacity-90 group-hover:scale-[1.0416]
        group-active:scale-[1.0752]"
        >
          Click me
        </span>
      </button>
      {/* <button className="btn btn-secondary ml-2">Secondary</button> */}
    </div>
  );
}
