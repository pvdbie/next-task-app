import Image from "next/image";
import taskimg from "@/app/assets/taskimg.jpg";
import Link from "next/link";
export default function Page (){
  return(
  <>
  <div className="flex flex-col mt-20 items-center">
    <Image src={taskimg} alt="taskimg" width={500} height={400}/>  
    <Image src= {"https://www.sau.ac.th/images/left_gf.png"}
    alt="sau" width={80} height={80}/>
    {/*แสดงชื่อแอพ */}
    <h1 className="text-red-300 font-bold">Manage Task App</h1>  

    {/*ปุ่มเข้าใช้งาน*/}
    <Link href="/showalltask" className="w-1/4 py-5 bg-blue-600 mt-5 text-center text-white">
    เข้าใช้งาน
    </Link>
    </div>
  </>
  );
}