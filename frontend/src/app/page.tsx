"use client";
import { useEffect, useState } from "react";
import SidebarCart from "@/components/SidebarCart";
import SearchBar from "@/components/SearchBar";
import ProductCard, { Product } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

import { useAuth } from "@/context/AuthContext";
import ProductAddForm from "@/components/ProductAddForm";

export default function Home() {
  const { cartItems, addToCart } = useCart();
  const { user, gradeInfo } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [gradeInfo]);

  const fetchProducts = async (filters?: any) => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (gradeInfo?.grade) {
        if (gradeInfo?.grade === "silver")
          query = query.eq("grade", gradeInfo.grade);
      } else {
        query = query.eq("grade", "silver");
      }

      if (filters) {
        if (filters.name) query = query.ilike("name", `%${filters.name}%`);
        if (filters.color) query = query.ilike("color", `%${filters.color}%`);
        if (filters.size) query = query.ilike("size", `%${filters.size}%`);
        if (filters.id) query = query.eq("product_number", filters.id);
        if (filters.minPrice)
          query = query.gte("price", Number(filters.minPrice));
        if (filters.maxPrice)
          query = query.lte("price", Number(filters.maxPrice));
        if (filters.maxPrice)
          query = query.lte("price", Number(filters.maxPrice));
        if (filters.maxPrice)
          query = query.lte("price", Number(filters.maxPrice));
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedData = data.map((item: any) => ({
        id: item.id,
        product_number: item.product_number,
        name: item.name,
        size: item.size,
        price: item.price,
        color: item.color,
        imageUrl: item.image_url,
        stock: item.stock,
        description: item.description,
        created_at: item.created_at,
        grade: item.grade,
      }));

      setProducts(mappedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  /*  const imagehandler = (path: string) => {
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };*/
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleAddSelectedToCart = async () => {
    const selectedProducts = products.filter((p) =>
      selectedIds.includes(p.product_number),
    );
    
    for (const product of selectedProducts) {
      await addToCart(product);
    }
    
    setSelectedIds([]); // Clear selection after adding
    alert(`${selectedProducts.length}개의 상품을 장바구니에 담았습니다.`);
  };

  const handleSelect = (product_number: string) => {
    setSelectedIds((prev) =>
      prev.includes(product_number)
        ? prev.filter((i) => i !== product_number)
        : [...prev, product_number],
    );
  };

  const handleSearch = (filters: any) => {
    fetchProducts(filters);
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">인테리어 추천: 커튼 & 블라인드</h1>
          {gradeInfo?.grade === "admin" && (
            <ProductAddForm onProductAdded={() => fetchProducts()} />
          )}
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">총 {products.length}개의 상품</p>
          <div className="flex gap-2">
            <button
              className="text-sm text-gray-500 hover:text-blue-600 border px-3 py-1 rounded"
              onClick={() =>
                setSelectedIds(products.map((p) => p.product_number))
              }
            >
              전체 선택
            </button>
            <button
              className="text-sm text-gray-500 hover:text-blue-600 border px-3 py-1 rounded"
              onClick={() => setSelectedIds([])}
            >
              선택 해제
            </button>
            <button
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded disabled:bg-gray-300 transition"
              disabled={selectedIds.length === 0}
              onClick={handleAddSelectedToCart}
            >
              선택 상품 담기 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.product_number}
                product={product}
                onAddToCart={handleAddToCart}
                isSelected={selectedIds.includes(product.product_number)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      <SidebarCart items={cartItems} />
    </div>
  );
}
