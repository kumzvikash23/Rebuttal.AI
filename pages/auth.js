import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      if (step === 1) {
        setStep(2);
      } else {
        // Redirect to dashboard after login
        router.push("/dashboard");
      }
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      // Redirect to dashboard after signup
      router.push("/dashboard");
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    setStep(1);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-900 px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          

          {/* Toggle Buttons */}
          <div className="flex mb-8 space-x-4">
            <button
              className={`flex-1 py-2 rounded-md font-semibold text-lg transition ${
                mode === "login"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                setMode("login");
                setStep(1);
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-md font-semibold text-lg transition ${
                mode === "signup"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                setMode("signup");
                setStep(1);
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Heading and Subtext */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {mode === "login" ? "Login to Rebuttal.ai" : "Create your Rebuttal.ai account"}
          </h1>
          <p className="text-gray-300 mb-8">
            {mode === "login"
              ? "Enter your email to log in. You'll be prompted for your password."
              : "Sign up to start learning and debating!"}
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-pink-400 bg-gray-900 text-white px-4 py-3 focus:ring-2 focus:ring-pink-400 text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            {mode === "login" && step === 2 && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-pink-400 bg-gray-900 text-white px-4 py-3 focus:ring-2 focus:ring-pink-400 text-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            {mode === "signup" && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-pink-400 bg-gray-900 text-white px-4 py-3 focus:ring-2 focus:ring-pink-400 text-lg"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-pink-400 bg-gray-900 text-white px-4 py-3 focus:ring-2 focus:ring-pink-400 text-lg"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-pink-600 text-white font-semibold text-lg hover:bg-pink-700 transition"
            >
              {mode === "login" ? (step === 1 ? "Next" : "Login") : "Sign Up"}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-md border border-gray-400 text-gray-200 font-semibold text-lg hover:bg-gray-800 hover:text-white transition"
              onClick={handleModeSwitch}
            >
              {mode === "login" ? "Sign Up" : "Back to Login"}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400">
            Have trouble logging in?{" "}
            <a href="#" className="text-pink-400 underline">
              Contact us.
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel Image */}
      <div className="hidden md:block md:w-1/2 h-screen relative">
        <Image
          src="/side_image.png"
          alt="Auth Side Art"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}
