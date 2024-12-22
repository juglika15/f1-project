"use client";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import logo from "../../../public/images/F1.svg";
import { CiLock } from "react-icons/ci";
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  //   const [message, setMessage] = useState<{ message: string; color: string }>({
  //     message: "",
  //     color: "",
  //   });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  //   const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // setMessage({ message: "Logging in...", color: "blue" });
    // router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-self-center bg-gray-100 dark:bg-gray-700 gap-28">
      <Image
        className="mt-32"
        src={logo}
        alt="f1 logo"
        width="200"
        height="200"
        priority
        style={{ width: "10rem", height: "auto" }}
      />
      <form
        className="w-full max-w-md bg-white p-8 dark:bg-dark rounded shadow text-black"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-black mb-6 dark:text-white">
          Login
        </h2>
        {/* {message.message && (
          <p className={`mb-4 text-center text-${message.color}-500`}>
            {message.message}
          </p>
        )} */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-500 mb-2">
            Username or Email
          </label>
          <div className="relative flex items-center">
            <CgProfile
              size="25"
              color="gray"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username or email"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark"
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-gray-500 mb-2">
              Password
            </label>
            <Link
              href="/reset"
              className="text-blue-500 text-sm cursor-pointer hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <CiLock
              size="25"
              color="gray"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            />
            {passwordVisible ? (
              <GoEye
                onClick={() => setPasswordVisible(false)}
                size="20"
                color="grey"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <GoEyeClosed
                onClick={() => setPasswordVisible(true)}
                size="20"
                color="grey"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm">new to F1 Plus?</span>
          <Link href={"/register"}>
            <span className="cursor-pointer text-blue-500 text-base font-bold hover:underline">
              Sign Up
            </span>
          </Link>
        </div>
        <button
          type="submit"
          className={`w-full bg-red-600 text-white font-bold py-2 px-4 rounded  hover:text-gray-100 transition-colors  hover:bg-red-800  ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
