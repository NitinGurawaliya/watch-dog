'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => signIn('google')}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
