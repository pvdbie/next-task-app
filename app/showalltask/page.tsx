"use client";

import Image from "next/image";
import taskimg from "@/app/assets/taskimg.jpg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";

// สร้างชนิดข้อมูล
interface Task {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  update_at: string;
}

export default function Page() {
  // state เก็บข้อมูล
  const [tasks, setTasks] = useState<Task[]>([]);

  // ดึงข้อมูล
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error: fetchError } = await supabase
        .from("task_bk")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          text: fetchError.message,
        });
      } else {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, []);

  // ลบข้อมูล
  const handleDeleteClick = async (
    id: string,
    image_url: string
  ) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่",
      text: "คุณจะไม่สามารถกู้คืนกลับมาได้",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      // ลบข้อมูลจาก database
      const { error: deleteError } = await supabase
        .from("task_bk")
        .delete()
        .eq("id", id);

      // ตรวจสอบ error
      if (deleteError) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการลบข้อมูล",
          text: deleteError.message,
        });

        return;
      }

      // ลบข้อมูลออกจาก state
      setTasks(tasks.filter((task) => task.id !== id));

      Swal.fire({
        icon: "success",
        title: "ลบข้อมูลสำเร็จ",
        text: "ข้อมูลของคุณถูกลบเรียบร้อยแล้ว",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col mt-20 items-center">
        {/* รูปภาพ */}
        <Image
          src={taskimg}
          alt="taskimg"
          width={500}
          height={400}
        />

        <Image
          src="https://www.sau.ac.th/images/left_gf.png"
          alt="sau"
          width={80}
          height={80}
        />

        {/* ชื่อแอพ */}
        <h1 className="text-red-300 font-bold">
          Manage Task App
        </h1>

        <h1 className="text-red-300 font-bold">
          (แสดงข้อมูลทั้งหมด)
        </h1>

        {/* ปุ่มเพิ่ม */}
        <div className="w-3/5 flex justify-end mt-5">
          <Link
            href="/addtask"
            className="bg-amber-400 px-3 py-2 rounded"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/* ตาราง */}
        <div className="w-3/5 mt-5">
          <table className="w-full border-2">
            <thead>
              <tr className="bg-amber-200">
                <th className="border-2">รูป</th>
                <th className="border-2">Title</th>
                <th className="border-2">Detail</th>
                <th className="border-2">Status</th>
                <th className="border-2">วันที่เพิ่ม</th>
                <th className="border-2">วันที่แก้ไข</th>
                <th className="border-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="bg-amber-200"
                >
                  {/* รูป */}
                  <td className="border-2 text-center">
                    <img
                      src={task.image_url}
                      alt="task image"
                      width={120}
                      className="object-cover mx-auto"
                    />
                  </td>

                  {/* title */}
                  <td className="border-2 p-2">
                    {task.title}
                  </td>

                  {/* detail */}
                  <td className="border-2 p-2">
                    {task.detail}
                  </td>

                  {/* status */}
                  <td className="border-2 p-2 text-center">
                    {task.is_completed
                      ? "งานเสร็จแล้ว"
                      : "งานยังไม่เสร็จ"}
                  </td>

                  {/* created_at */}
                  <td className="border-2 p-2">
                    {new Date(
                      task.created_at
                    ).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>

                  {/* update_at */}
                  <td className="border-2 p-2">
                    {task.update_at
                      ? new Date(
                          task.update_at
                        ).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "-"}
                  </td>

                  {/* action */}
                  <td className="border-2 text-center">
                    <Link
                      href={`/updatetask/${task.id}`}
                      className="text-blue-600"
                    >
                      แก้ไข+
                    </Link>

                    {" | "}

                    <button
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        handleDeleteClick(
                          task.id,
                          task.image_url
                        )
                      }
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* กลับหน้าแรก */}
          <Link
            href="/"
            className="flex flex-col items-center text-center text-yellow-400 bg-amber-950 mt-5 p-2 rounded"
          >
            กลับไปหน้าแรก
          </Link>
        </div>
      </div>
    </>
  );
}