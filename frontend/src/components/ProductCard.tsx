"use client";

import Image from "next/image";
import Link from "next/link";
export interface Product {
  id: string;
  product_number: string;
  name: string;
  size: string;
  price: number;
  color: string;
  imageUrl: string;
  stock: number;
  description: string;
  grade: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isSelected: boolean;
  onSelect: (product_number: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  isSelected,
  onSelect,
}: ProductCardProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow group relative">
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.product_number)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>
      <Link href={`/product/${product.product_number}`} className="block">
        <div className="relative aspect-square w-full bg-gray-100">
          <Image
            src={
              product.imageUrl
                ? product.imageUrl
                : "http://localhost:54321/storage/v1/object/public/product-images/df990d60-080a-40e3-a91d-12e4321b537f/0.07689787029485007.png"
            }
            alt={product.name}
            fill
            unoptimized
            loading="eager"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Grade Badge */}
          <div className="absolute top-2 right-2 z-10">
            <span
              className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                product.grade === "gold"
                  ? "bg-yellow-400 text-yellow-900 border-yellow-500"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              {product.grade === "gold" ? "✨ GOLD" : "SILVER"}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <Link
            href={`/product/${product.product_number}`}
            className="hover:text-blue-600 transition"
          >
            <h3 className="font-bold text-lg truncate">{product.name}</h3>
          </Link>
        </div>
        <div className="space-y-1 mb-4 text-sm text-gray-600">
          <p>코드번호: {product.product_number}</p>
          <p>사이즈: {product.size}</p>
          <p>색상: {product.color}</p>
          <p>
            남은 수량:{" "}
            <span
              className={product.stock < 10 ? "text-red-500 font-bold" : ""}
            >
              {product.stock}개
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
