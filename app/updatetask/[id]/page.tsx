"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // ดึงข้อมูลเดิม
  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("task_bk")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.message,
        });
        return;
      }

      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
    };

    fetchTask();
  }, [id]);

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    const { error } = await supabase
      .from("task_bk")
      .update({
        title,
        detail,
        is_completed: isCompleted,
      })
      .eq("id", id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "แก้ไขไม่สำเร็จ",
        text: error.message,
      });

      return;
    }

    Swal.fire({
      icon: "success",
      title: "แก้ไขสำเร็จ",
    });

    router.push("/showalltask");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="w-3/5 border p-5 rounded-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-5">
          แก้ไขงาน
        </h1>

        <input
          type="text"
          className="border p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="border p-2 rounded mb-3"
          rows={4}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detail"
        />

        <select
          className="border p-2 rounded mb-3"
          value={isCompleted ? "เสร็จ" : "ยังไม่เสร็จ"}
          onChange={(e) =>
            setIsCompleted(e.target.value === "เสร็จ")
          }
        >
          <option value="เสร็จ">เสร็จ</option>

          <option value="ยังไม่เสร็จ">
            ยังไม่เสร็จ
          </option>
        </select>

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white p-2 rounded"
        >
          บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
}