"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("silver");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError || !data.user) {
      setError(signupError?.message || "Signup failed");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      grade,
      email,
    });

    if (profileError) {
      console.error(profileError.message);
      setError("Profile 생성 실패");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm text-center">
            회원가입이 완료되었습니다! <br /> 잠시 후 로그인 페이지로
            이동합니다.
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
              placeholder="최소 6자 이상"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회원 등급 선택
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition ${grade === "silver" ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="grade"
                  value="silver"
                  checked={grade === "silver"}
                  onChange={(e) => setGrade(e.target.value)}
                  className="hidden"
                />
                <span className="font-bold text-gray-800">Silver</span>
                <span className="text-xs text-gray-500">일반 회원</span>
              </label>
              <label
                className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition ${grade === "gold" ? "border-yellow-600 bg-yellow-50" : "hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="grade"
                  value="gold"
                  checked={grade === "gold"}
                  onChange={(e) => setGrade(e.target.value)}
                  className="hidden"
                />
                <span className="font-bold text-yellow-700">Gold</span>
                <span className="text-xs text-gray-500">프리미엄 회원</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition mt-4"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
