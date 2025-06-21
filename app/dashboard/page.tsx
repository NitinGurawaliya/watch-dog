"use client"
import { useSession, signOut } from 'next-auth/react'
import React from 'react'

const Page = () => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div>
        <p>Hi, {session.user.name}</p>
        <p>Hi, {session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>page</div>
  );
}

export default Page;
