import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col items-center bg-white border-r border-gray-200 w-20 py-8">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex flex-col items-center text-pink-500 hover:text-pink-400 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </a>
        </Link>
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 border border-gray-200 flex flex-col items-center">
          <Image
            src="/Avatar.jpg"
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-lg border-2 border-pink-400 mb-4"
            priority
          />
          <div className="text-2xl font-bold text-gray-900 mb-2">Your Name</div>
          <div className="text-gray-600 mb-6">your@email.com</div>
          <div className="bg-gray-100 rounded-lg p-6 text-gray-900 text-center border border-gray-200 w-full">
            <div className="text-lg font-semibold mb-2">Profile features coming soon!</div>
            <div className="text-gray-600">You’ll be able to update your info, see your stats, and more.</div>
          </div>
        </div>
      </main>
    </div>
  );
} 