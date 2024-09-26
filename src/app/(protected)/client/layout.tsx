"use client";
import { logOut } from "@/app/lib/redux/features/auth/auth_slice";
import { useAppDispatch } from "@/app/lib/redux/hooks";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const rotuter = useRouter();

  return (
    <main>
      <section className="bg-slate-300 p-2 flex justify-end fixed top-0 w-full">
        <Button
          variant={"outline"}
          onClick={() => {
            dispatch(logOut());
            rotuter.push("/");
          }}
        >
          Log out
        </Button>
      </section>
      {children}
      <footer></footer>
    </main>
  );
}
