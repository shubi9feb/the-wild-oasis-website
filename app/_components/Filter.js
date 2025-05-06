"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    console.log(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="border border-primary-800 flex">
      <button onClick={() => handleFilter("all")}>All Cabins</button>
      <button onClick={() => handleFilter("small")}>1&mdash;3 guests</button>
      <button onClick={() => handleFilter("medium")}>4&mdash;7 guests</button>
      <button onClick={() => handleFilter("large")}>7&mdash;12 guests</button>
    </div>
  );
}

export default Filter;
