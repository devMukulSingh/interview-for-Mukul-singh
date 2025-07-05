import type { MetaFunction } from "@remix-run/node";
import Header from "~/components/header";

export const meta: MetaFunction = () => {
  return [
    { title: "Spacex" },
    {
      name: "description",
      content: "Aerospace manufacturer and space transportator",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header/>
      
    </div>
  );
}