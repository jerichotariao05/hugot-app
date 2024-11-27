"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HeartIcon } from "@heroicons/react/24/outline";

const RightMenu = () => {
  const [hugotPosts, setHugotPosts] = useState([]);

  async function fetchTopHugots() {
    const url = "http://localhost/hugot-app/api/hugot.php";

    try {
      let response = await axios.get(url, {
        params: { json: "", operation: "getTopHugots" },
      });

      console.log(response);
      const hugotData = response.data;

      const initHugot = hugotData.map((hugot) => ({
        id: hugot.hugot_id,
        hugotLine: hugot.hugot_content,
        likes: hugot.heart_count,
      }));

      setHugotPosts(initHugot);
    } catch (error) {
      console.error("Failed to fetch hugot posts:", error);
    }
  }

  useEffect(() => {
    fetchTopHugots();
  }, []);

  return (
    <>
      <div className="flex fixed top-20 w-1/5">
        <Card className="w-full">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl text-slate-800  text-nowrap drop-shadow-md w-full p-4">
              <div className="flex items-center">
              <HeartIcon className="w-8 h-8 fill-pink-500 me-2"/>
              Top hugots for you
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full p-4">
            <ul>
              {hugotPosts.map((hugot) => (
                <li key={hugot.id} className="mb-2 border-b-2 border-gray-100 p-3 hover:bg-pink-200 rounded-md">
                  <div className="flex flex-col space-y-2">
                    <p className="text-lg">{hugot.hugotLine}</p>
                    <p className="text-slate-800">likes - {hugot.likes}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RightMenu;
