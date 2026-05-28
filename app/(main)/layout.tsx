import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* تمت إزالة Header و Footer من هنا لمنع التكرار 
          لأن RootLayout في app/layout.tsx يقوم بعرضهم بالفعل 
      */}
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}