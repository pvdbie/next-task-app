import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const fonts = Kanit ({
  subsets: ['latin'],
  weight:["100","200","300","400","500","600","700","800","900"]
});
export const metadata: Metadata ={
  title :"task application",
  description:"เว็บแอพพลิเคชั่นสำหรับการจัดงานที่ต้องทำ เพิ่ม,แก้ไข้,ลบ,ดู",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return(
    <html
    lang="en"
    className={`${fonts.className}`}
    >
      <body className=" min-h-full flex flex-col">{children}</body>
    </html>
  )
}

