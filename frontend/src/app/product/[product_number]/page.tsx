"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SidebarCart from "@/components/SidebarCart";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Product } from "@/components/ProductCard";

import { useAuth } from "@/context/AuthContext";
import CommentSection from "@/components/CommentSection";
import { useRouter } from "next/navigation";
import ProductModifyForm from "@/components/ProductModifyForm";
export default function ProductDetail() {
  const { product_number } = useParams<{ product_number: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart } = useCart();
  const { user, gradeInfo } = useAuth();

  useEffect(() => {
    if (product_number) {
      fetchProduct();
    }
  }, [product_number]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("product_number", product_number)
        .single();

      if (error) throw error;

      if (data) {
        setProduct({
          id: data.id,
          product_number: data.product_number,
          name: data.name,
          size: data.size,
          price: data.price,
          color: data.color,
          imageUrl: data.image_url,
          stock: data.stock,
          description: data.description,
          grade: data.grade,
          created_at: data.created_at,
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleModify = () => {};
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_number", product_number);
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40 flex-1">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 flex-1">
        <p className="text-xl font-bold mb-4">상품을 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            ← 목록으로 돌아가기
          </Link>

          {gradeInfo?.grade === "admin" && (
            <div className="flex gap-2">
              <ProductModifyForm
                onProductModified={() => fetchProduct()}
                pronumber={product_number}
              />
              <button
                onClick={handleDelete}
                className="text-sm border px-3 py-1 rounded text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border">
            <Image
              src={
                product.imageUrl
                  ? product.imageUrl || "/next.svg"
                  : "http://localhost:54321/storage/v1/object/public/product-images/df990d60-080a-40e3-a91d-12e4321b537f/0.07689787029485007.png"
              }
              alt={product.name}
              fill
              unoptimized
              loading="eager"
              className="object-cover"
            />
            {/* Grade Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-md border-2 ${
                  product.grade === "gold"
                    ? "bg-yellow-400 text-yellow-900 border-yellow-500"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {product.grade === "gold" ? "✨ PREMIUM GOLD" : "STANDARD SILVER"}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-mono text-gray-400 mb-2">
              상품번호: {product.product_number}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">가격</span>
                <span className="text-2xl font-bold text-blue-600">
                  {product.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">사이즈</span>
                <span>{product.size}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">색상</span>
                <span>{product.color}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-700 font-medium">구매 수량</span>
              <div className="flex items-center border rounded-lg bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100 border-r text-xl font-bold"
                >
                  -
                </button>
                <span className="px-6 font-bold text-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100 border-l text-xl font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                총 {(product.price * quantity).toLocaleString()}원
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="font-bold mb-2">상품 설명</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
            >
              추천 리스트에 추가
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="border-t pt-12">
          <CommentSection product_number={product.product_number} />
        </div>
      </div>
      <SidebarCart items={cartItems} />
    </div>
  );
}
