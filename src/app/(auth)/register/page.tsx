"use client";

import { FormEvent, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import request from "@/utils/axios";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  //   const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await request.post(api.register, {
        account: account,
        code: "123",
        password: password,
      });
      if (response.status == 201) {
        //@ts-ignore
        toast.success("User registered successfully");
        router.push("/signin");
      }
    } catch (error) {
      //@ts-ignore
      const message = error?.response?.data?.message || error.message;
      return toast.error(message);
    }
  };

  return (
    <div>
      <Head>
        <title>Inference</title>
        <link rel="icon" href="/tivul-favicon.ico" />
      </Head>
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[#002D74]">Register</h2>
            <p className="text-xs mt-4 text-[#002D74]">
              Please enter your info to sign up:
            </p>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              {/* <input
                className="p-2 mt-8 rounded-xl border text-black"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code"
              /> */}
              <input
                className="p-2 mt-8 rounded-xl border text-black"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Account"
              />
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full text-black"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="gray"
                  className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              </div>
              <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">
                Submit
              </button>
            </form>

            {/* <div className="mt-6 grid grid-cols-3 items-center text-gray-400"> */}
            {/* <hr className="border-gray-400" /> */}
            <p className="text-center mt-4 text-sm whitespace-nowwrap">
              Already have an account?
            </p>
            {/* <hr className="border-gray-400" /> */}
            {/* </div> */}

            <button
              onClick={() => router.push("/signin")}
              // onClick={handle_google_sign_in}
              className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
            >
              Sign In
            </button>
            {/* 
            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div> */}

            {/* <button
              // onClick={handle_google_sign_in}
              className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
            >
              <svg
                className="mr-3"
                width="25px"
                viewBox="0 0 300 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#2DC100"
                  d="M300 255c0 24.854-20.147 45-45 45H45c-24.854 0-45-20.146-45-45V45C0 20.147 20.147 0 45 0h210c24.853 0 45 20.147 45 45v210z"
                />

                <g fill="#FFF">
                  <path d="M200.803 111.88c-24.213 1.265-45.268 8.605-62.362 25.188-17.271 16.754-25.155 37.284-23 62.734-9.464-1.172-18.084-2.462-26.753-3.192-2.994-.252-6.547.106-9.083 1.537-8.418 4.75-16.488 10.113-26.053 16.092 1.755-7.938 2.891-14.889 4.902-21.575 1.479-4.914.794-7.649-3.733-10.849-29.066-20.521-41.318-51.232-32.149-82.85 8.483-29.25 29.315-46.989 57.621-56.236 38.635-12.62 82.054.253 105.547 30.927 8.485 11.08 13.688 23.516 15.063 38.224zm-111.437-9.852c.223-5.783-4.788-10.993-10.74-11.167-6.094-.179-11.106 4.478-11.284 10.483-.18 6.086 4.475 10.963 10.613 11.119 6.085.154 11.186-4.509 11.411-10.435zm58.141-11.171c-5.974.11-11.022 5.198-10.916 11.004.109 6.018 5.061 10.726 11.204 10.652 6.159-.074 10.83-4.832 10.772-10.977-.051-6.032-4.981-10.79-11.06-10.679z" />

                  <path d="M255.201 262.83c-7.667-3.414-14.7-8.536-22.188-9.318-7.459-.779-15.3 3.524-23.104 4.322-23.771 2.432-45.067-4.193-62.627-20.432-33.397-30.89-28.625-78.254 10.014-103.568 34.341-22.498 84.704-14.998 108.916 16.219 21.129 27.24 18.646 63.4-7.148 86.284-7.464 6.623-10.15 12.073-5.361 20.804.884 1.612.985 3.653 1.498 5.689zm-87.274-84.499c4.881.005 8.9-3.815 9.085-8.636.195-5.104-3.91-9.385-9.021-9.406-5.06-.023-9.299 4.318-9.123 9.346.166 4.804 4.213 8.69 9.059 8.696zm56.261-18.022c-4.736-.033-8.76 3.844-8.953 8.629-.205 5.117 3.772 9.319 8.836 9.332 4.898.016 8.768-3.688 8.946-8.562.19-5.129-3.789-9.364-8.829-9.399z" />
                </g>
              </svg>
              Sign in with WeChat
            </button> */}
          </div>

          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl"
              src="https://images.unsplash.com/photo-1716637644831-e046c73be197?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
