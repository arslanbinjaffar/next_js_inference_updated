"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "@/app/components/global/Loader";
import StoreProvider from "./store_provider";
import { Toaster } from "react-hot-toast";
import Event_listener from "./lib/event_listener";
import { useAppDispatch, useAppSelector } from "./lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { initialize } from "./lib/redux/features/auth/auth_slice";
import { ADMIN_ACCOUNT } from "./page";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        if (config.headers.has("isAsyncUpdate")) return config;
        setIsLoading(true);
        return config;
      },
      (error) => {
        setIsLoading(false);
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => {
        setIsLoading(false);
        return Promise.reject(error);
      }
    );
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <LoadingSpinner show={isLoading} />
        <StoreProvider>
          <Auth />
          <Event_listener />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

const Auth = () => {
  const { isInitialized, userInfo } = useAppSelector(
    (state) => state.auth_slice
  );
  const router = useRouter();

  const path = usePathname();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      (isInitialized && path.startsWith("/admin")) ||
      path.startsWith("/client")
    )
      return;
    if (isInitialized && userInfo.account === ADMIN_ACCOUNT)
      router.push("/admin");
    else if (isInitialized) router.push("/client");
    else if (localStorage.getItem("user_info")) {
      dispatch(initialize(JSON.parse(localStorage.getItem("user_info")!)));
    }
  }, [isInitialized]);

  return <></>;
};
