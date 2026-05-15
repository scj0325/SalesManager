'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Curtain & Blind
            </Link>
          </div>
          <div className="flex space-x-8 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-blue-600">{user.email}</span>님이 접속하셨습니다
                </span>
                <Link href="/mypage" className="text-gray-700 hover:text-blue-600 text-sm">MyPage</Link>
                <button 
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 text-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 text-sm">로그인</Link>
                <Link href="/signup" className="text-gray-700 hover:text-blue-600 text-sm">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
