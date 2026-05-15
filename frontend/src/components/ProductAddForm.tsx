"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface ProductAddFormProps {
  onProductAdded: () => void;
}

export default function ProductAddForm({
  onProductAdded,
}: ProductAddFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    product_number: "",
    size: "",
    price: "",
    color: "",
    description: "",
    grade: "silver",
    stock: "0",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("products").insert({
        name: formData.name,
        product_number: formData.product_number,
        size: formData.size,
        price: parseInt(formData.price),
        color: formData.color,
        description: formData.description,
        image_url: imageUrl,
        id: user.id,
        grade: formData.grade,
        stock: parseInt(formData.stock),
      });

      if (error) throw error;

      setIsOpen(false);
      setFormData({
        name: "",
        product_number: "",
        size: "",
        price: "",
        color: "",
        description: "",
        grade: "silver",
        stock: "0",
      });
      setImageFile(null);
      onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        + 상품 등록하기
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">새 상품 등록</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품명*
              </label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품번호*
              </label>
              <input
                name="product_number"
                required
                value={formData.product_number}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격(원)*
              </label>
              <input
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                색상
              </label>
              <input
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사이즈
              </label>
              <input
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                총 수량*
              </label>
              <input
                name="stock"
                type="number"
                required
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              노출 등급
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm bg-white"
            >
              <option value="silver">Silver (전체 공개)</option>
              <option value="gold">Gold (골드 회원 전용)</option>
              <option value="admin">Admin (운영자 전용)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-4"
          >
            {loading ? "등록 중..." : "등록 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}
