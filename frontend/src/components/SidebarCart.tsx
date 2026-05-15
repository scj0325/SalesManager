"use client";

import { useCart } from "@/context/CartContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product_number: string;
  grade: string;
}

interface SidebarCartProps {
  items: CartItem[];
}

export default function SidebarCart({ items }: SidebarCartProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <aside className="w-80 bg-white border-l h-[calc(100vh-64px)] p-4 flex flex-col sticky top-16 shadow-sm">
      <h2 className="text-lg font-bold mb-4 border-b pb-2">추천 리스트</h2>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            추천 리스트가 비어 있습니다.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.product_number} className="text-sm border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter border ${
                          item.grade === "gold"
                            ? "bg-yellow-400 text-yellow-900 border-yellow-500"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {item.grade === "gold" ? "GOLD" : "SILVER"}
                      </span>
                      <p className="font-medium truncate">{item.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_number)}
                    className="text-gray-400 hover:text-red-500 mt-1"
                  >
                    삭제
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.product_number, -1)}
                      className="px-2 py-0.5 hover:bg-gray-100 border-r"
                    >
                      -
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_number, 1)}
                      className="px-2 py-0.5 hover:bg-gray-100 border-l"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>합계:</span>
          <span className="text-blue-600">{total.toLocaleString()}원</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
          추천하기
        </button>
      </div>
    </aside>
  );
}
