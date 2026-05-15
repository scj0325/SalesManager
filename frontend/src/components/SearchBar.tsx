"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  name: string;
  color: string;
  size: string;
  id: string;
  minPrice: string;
  maxPrice: string;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    color: "",
    size: "",
    id: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSearch(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div
        className="bg-white p-4 rounded-lg shadow-sm border mb-6"
        onKeyDown={handleKeyDown}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">상품명</label>
            <input
              type="text"
              name="name"
              id="name"
              value={filters.name}
              placeholder="상품명 검색"
              className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">색상</label>
            <input
              type="text"
              name="color"
              id="color"
              value={filters.color}
              placeholder="색상 검색"
              className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">사이즈</label>
            <input
              type="text"
              name="size"
              id="size"
              value={filters.size}
              placeholder="사이즈 검색"
              className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">상품번호</label>
            <input
              type="text"
              name="id"
              id="id"
              value={filters.id}
              placeholder="상품번호 검색"
              className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">가격대</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                name="minPrice"
                id="minPrice"
                value={filters.minPrice}
                placeholder="Min"
                className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
                onChange={handleChange}
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                id="maxPrice"
                value={filters.maxPrice}
                placeholder="Max"
                className="w-full border rounded px-2 py-1 text-sm focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            검색하기
          </button>
        </div>
      </div>
    </form>
  );
}
