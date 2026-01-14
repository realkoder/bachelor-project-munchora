import { Outlet } from "react-router";
import { Footer } from "./Footer";
import Navbar from "./Navbar";
import SignedInNavbar from "./SignedInNavbar";
import { useAtomValue } from "jotai";
import { curUserAtom } from "~/atoms/curUserAtom";

export default function layoutNavbar() {
  const curUser = useAtomValue(curUserAtom);

  return (
    <div className="min-h-screen text-center flex flex-col">
      {curUser?.status === "SIGNED_IN" ? <SignedInNavbar /> : <Navbar />}
      <div className={"flex-1"}>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
