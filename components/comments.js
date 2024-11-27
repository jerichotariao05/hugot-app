"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Image from "next/image";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const Comments = ({ hugotId, commentUpdated }) => {
  const [hugotComments, setHugotComments] = useState([]);

  async function fetchComments() {
    const url = "http://localhost/hugot-app/api/hugot.php";

    console.log(`hugot ID PASSED-> ${hugotId}`)

    const jsonData = {
      hugotId: hugotId,
    };

    console.log(`JSON DATA ${jsonData.hugotId}`);

    const formData = new FormData();
    formData.append("operation", "getHugotComments");
    formData.append("json", JSON.stringify(jsonData));

    let response = await axios({
      url: url,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const hugotComments = response.data;

    const initComments = hugotComments.map((comment) => ({
    id: comment.comment_id,
    username: comment.username,
    avatar: comment.avatar,
    hugotComment: comment.hugot_comment,
    createdAt: comment.created_at,
    }));

    setHugotComments(initComments);
  }

  useEffect(() => {
    fetchComments();
  }, [commentUpdated]);

  const formatCreatedAt = (createdAt) => {
    const now = dayjs();
    const createdTime = dayjs(createdAt);
    const diffInDays = now.diff(createdTime, "day");

    if (diffInDays >= 1) {
      return createdTime.format("MMMM D, YYYY h:mm A");
    } else {
      return createdTime.fromNow();
    }
  };

  return (
    <>
      {hugotComments.map((comment) => {

        return (
          <Card key={comment.id}>
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-4">
                  <Image
                    src={comment?.avatar || "/assets/user_profile.png"}
                    alt={`${comment?.username || "User"}`}
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">
                      {comment?.username || "User"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatCreatedAt(comment?.createdAt)}
                    </p>
                  </div>
                </div>

              </div>
              <p>{comment.hugotComment}</p>
              </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default Comments;
