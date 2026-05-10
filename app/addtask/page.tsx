"use client"
import Image from "next/image";
import taskimg from"@/app/assets/taskimg.jpg"
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
export default function Page(){
  const router = useRouter ();
  //สร่สง state เพื่อเก็บข้อมูลที่ป้อน และเลือก
  const [title,setTitle] =useState("");
  const [detail,setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedimage,setSelectedImage]=useState<File | null>(null);

  /*ฟังก์ชั่นบันทึกข้อมูล */
  const handleSaveClick = async()=>{
    //Validate ข้อมูลที่ป้อนและเลือก
    if(title.trim() ==="" || detail.trim()==="" || !selectedimage){
      Swal.fire({
        icon:"warning",
        title:"กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "โปรดป้อน Title,Detail และเลือกภาพก่อนบันทึก",
      });
      return;
    }
    //อัพโหลดรูปภาพไปยัง supabase storage ถ้ามีการเลือกภาพ และได้ URL ของภาพกลับมา
    let image_url =""; //ตัวแปรเก็บที่อยู่รูปรึเก็บURLของภาพที่อัปโหลด
    if (selectedimage){
      const {data, error: uploadError} =await supabase.storage
      .from("task-images")
      .upload(`${Date.now()}_${selectedimage.name}`,selectedimage);
      
      if (uploadError){
        Swal.fire({
          icon:"error",
          title:"เกิดข้อผิดพลาดในการอัปโหลดภาพ",
          text: uploadError.message,
        });
        return;
      }
      //ดึง URL ของภาพที่อัปโหลดมาใช้ในการบันทึกข้อมูล
      const{data:urlData} = supabase.storage
        .from("task-images")
        .getPublicUrl(data.path)
        
      image_url = urlData.publicUrl;
    }
    
    //บันทึกข้อมูลลงใน Supabase Database
    const {error: insertError} = await supabase.from("task_bk").insert({
      title,
      detail,
      is_completed: isCompleted,
      image_url,
    });
   

    //แสดง SweeAlert2 เพื่อแจ้งผลการบันทึกข้อมูล
    if (insertError) {
      Swal.fire({
        icon:"error",
        title:"เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: insertError.message,

      });
      return
    }
    Swal.fire({
      icon:"success",
      title: "บันทึกข้อมูลสำเร็จ",
      text: "ข้อมูลได้ถูกบันทึกเรียบร้อยแล้ว"
    });

    //ย้อนกลับไปหน้าแสดงข้อมูลทั้งหมด
    router.push("/showalltask")



  };
  /*ฟังก์ชั่นล้างข้อมูล */
  const handleClearClick = async()=>{
    setTitle("");
    setDetail("");
    setIsCompleted(false);
    setImageUrl("");
  };
  

return(<>
<div className="flex flex-col mt-20 items-center">
   {/*แสดงรูปภาพ*/}
        <Image src={taskimg} alt="taskimg" width={100} height={80} />
        <Image
          src="https://www.sau.ac.th/images/left_gf.png"
          alt="sau"
          width={80}
          height={80}
        />

        {/* แสดงชื่อแอพ */}
        <h1 className="text-red-300 font-bold">Manage Task App</h1>
        <h1 className="text-red-300 font-bold">(เพิ่มงาน)</h1>
        {/*ส่วนของการป้อนข้อมูล / เลือกข้อมูล*/ }
        <div className="w-3/5 mt-10 border p-5 rounded-lg flex flex-col ">
        <h1 className="text-2xl font-bold  mb-5 text-center">เพิ่มงานใหม่</h1>
        {/*ป้อนงานที่ทำ*/ }
        <h2 className="text-lf font-bold mb-2">Title</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
        type="text" className="p-2 border rounded"  />
        {/*ป้อนรายละเอียดงานที่ทำ*/}
        <h1 className="text-lg font-bold mb-2">
          Desciption
        </h1>
        <textarea value={detail} onChange={(e) => setDetail(e.target.value)} className="p-2 border rounded" rows={4}/>
        {/*เลือกรูปภาพ */}
        <h1 className="text-lg font-bold mb-2">
          Image
          </h1>
          <input id="selectimage" 
                 type="file"
                 accept="image/*"
                 className="p-2 border rounded hidden" 
                 onChange={(e) =>{
                  if (e.target.files && e.target.files[0]){
                    setSelectedImage(e.target.files[0]);
                    setImageUrl(URL.createObjectURL(e.target.files[0]))
                  }
                 } }/>
          <label htmlFor="selectimage" className="p-2 border rounded cursor-pointer w-30 bg-amber-30 text-red-500 text-center">

            เลือกรูปภาพ
          </label>
          {/*แสดงรูปภาพที่เลือก พรีวิว */}
          {imageUrl &&(
            <div className="mt-2">
              <h2 className="text-lg font-bold mb-2">รูปภาพที่เลือก</h2>
              <Image src={imageUrl} alt="Selected Image" width={200} height={200}/>
            </div>
          )}
          {/*้เลือกสถานะเสร็จ  /  ยังไม่เสร็จ */}
          <h1 className="text-lg font-bold mb-2 mt-4">Status</h1>
          <select className="p- border rounded mt-3" value={isCompleted ? "เสร็จ ":"ยังไม่เสร็จ"}
                  onChange={(e) => setIsCompleted(e.target.value ==="เสร็จ")}>
            <option value="เสร็จ">เสร็จ</option>
            <option value="ยังไม่เสร็จ">ยังไม่เสร็จ</option>
          </select>
          {/*ปุ่มบันทึก*/}
          <button className="p- bg-green-400 text-white rounded mt-4 cursor-pointer" onClick={handleSaveClick}>
            บันทึกข้อมูล
          </button>
          <button className="p- bg-red-500 text-white rounded mt-4 cursor-pointer" onClick={handleClearClick}>
            ล้างข้อมูล
          </button>
        </div>
        {/*ลิ้งกลับไปหน้าแสดงข้อมูลทั้งหมด */}
        
        <Link href="/showalltask" className="mt5 text-yellow-400 bg-amber-950">กลับไปหน้าแสดงข้อมูลทั้งหมด</Link>
</div>
</>);
}
