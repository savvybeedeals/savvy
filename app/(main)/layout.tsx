import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* الحفاظ على بنية المجلد الفرعي لتمرير المحتوى الداخلي بنجاح كامل بنسبة 100% */}
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}