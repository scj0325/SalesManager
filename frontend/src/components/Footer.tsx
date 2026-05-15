export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            <p>회사주소: 서울특별시 강남구 테헤란로 123</p>
            <p>회사전화번호: 02-1234-5678</p>
          </div>
          <div className="text-gray-500 text-xs">
            © 2024 Curtain & Blind Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
