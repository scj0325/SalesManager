"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import SidebarCart from "@/components/SidebarCart";
import Link from "next/link";

export default function MyPage() {
  const { user, gradeInfo, loading: authLoading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (authLoading) {
    return (
      <div className="flex justify-center py-40 flex-1">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 flex-1">
        <p className="text-xl font-bold mb-4">로그인이 필요한 페이지입니다.</p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">마이페이지</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">회원 정보</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">이메일</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">회원 등급</p>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                      gradeInfo?.grade === "gold"
                        ? "bg-yellow-400 text-yellow-900 border border-yellow-500"
                        : gradeInfo?.grade === "admin"
                          ? "bg-blue-600 text-white border border-blue-700"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {gradeInfo?.grade === "gold"
                      ? "✨ GOLD"
                      : gradeInfo?.grade === "admin"
                        ? "ADMIN"
                        : "SILVER"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {gradeInfo?.grade === "gold" || gradeInfo?.grade === "admin"
                    ? "프리미엄 GOLD 상품을 자유롭게 둘러보실 수 있습니다."
                    : "골드 등급으로 가입하시면 프리미엄 상품을 보실 수 있습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">
            나의 추천 리스트
          </h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                추천 리스트에 담긴 상품이 없습니다.
              </p>
              <Link
                href="/"
                className="text-blue-600 font-bold hover:underline"
              >
                상품 둘러보기 →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.product_number}
                  className="flex gap-4 items-center border-b pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                          item.grade === "gold"
                            ? "bg-yellow-400 text-yellow-900 border-yellow-500"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {item.grade === "gold" ? "GOLD" : "SILVER"}
                      </span>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                    </div>
                    <p className="text-blue-600 font-bold ml-1">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>

                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product_number, -1)}
                      className="px-3 py-1 hover:bg-gray-100 border-r"
                    >
                      -
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_number, 1)}
                      className="px-3 py-1 hover:bg-gray-100 border-l"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="font-bold">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product_number)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t flex justify-between items-center">
                <span className="text-xl font-bold">총 합계 금액</span>
                <span className="text-2xl font-bold text-blue-600">
                  {cartItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}
                  원
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <SidebarCart items={cartItems} />
    </div>
  );
}
