"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Image from "next/image";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const HugotList = ({ user, postsUpdated }) => {
  const [hugotPosts, setHugotPosts] = useState([]);
  const router = useRouter();

  async function fetchHugots() {
    const url = "http://localhost/hugot-app/api/hugot.php";

    let response = await axios.get(url, {
      params: { json: "", operation: "getHugot" },
    });

    const hugotData = response.data;

    const initHugot = hugotData.map((hugot) => ({
      id: hugot.hugot_id,
      userId: hugot.user_id,
      username: hugot.username,
      email: hugot.email,
      avatar: hugot.avatar,
      hugotLine: hugot.hugot_content,
      createdAt: hugot.created_at,
      likes: hugot.heart_count,
      favorites: hugot.bookmark_count,
      rating: hugot.average_rating,
    }));

    setHugotPosts(initHugot);
  }

  useEffect(() => {
    fetchHugots();
  }, [postsUpdated]);

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

  const handleLike = async (hugotId) => {
    console.log(`Liked hugot with ID: ${hugotId}`);
  };

  const handleFavorite = async (hugotId) => {
    console.log(`Favorited hugot with ID: ${hugotId}`);
  };

  const handleRating = async (hugotId) => {
    console.log(`Rated hugot with ID: ${hugotId}`);
  };

  const viewComments = (hugotId) => {
    router.push(`/user/hugot/comment/${hugotId}`);
  };

  return (
    <>
      {hugotPosts.map((post) => {
        const isAuthor = user && user.user_id === post.userId;

        return (
          <Card key={post.id} className="mb-4">
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-4">
                <Image
                    src={post?.avatar || "/assets/user_profile.png"}
                    alt={`${post?.first_name || "User"} ${
                      post?.last_name || "Avatar"
                    }`}
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">
                      {post?.username || "User"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {post?.email || "john@gmail.com"} |{" "}
                      {formatCreatedAt(post?.createdAt)}
                    </p>
                  </div>
                </div>

                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full flex items-center">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Button variant="ghost" onClick={() => {}}>
                            <PencilSquareIcon className="h-6 w-6 me-2" />
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button variant="ghost" onClick={() => {}}>
                            <ArchiveBoxIcon className="h-6 w-6 me-2" />
                            Archive
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p>{post.hugotLine}</p>
              <div className="flex items-center justify-between space-x-4">
                <Button
                  variant="ghost"
                  className="p-1 text-pink-500 hover:text-pink-500"
                  onClick={() => handleLike(post.id)}
                >
                  <HeartIcon className="h-8 w-8" /> {post.likes}
                </Button>
                <Button
                  variant="ghost"
                  className="p-1 text-yellow-500 hover:text-yellow-500"
                  onClick={() => handleFavorite(post.id)}
                >
                  <BookmarkIcon className="h-8 w-8" /> {post.favorites}
                </Button>
                {/* <Button
                  variant="ghost"
                  className="p-1 text-yellow-300 hover:fill-yellow-300"
                  onClick={() => handleRating(post.id)}
                >
                  <StarIcon className="h-8 w-8" />{" "}
                  {post.rating !== undefined && post.rating !== null
                    ? Number(post.rating).toFixed(2)
                    : "N/A"}
                </Button> */}
              </div>
            </CardContent>
            <CardFooter className="p-2 flex justify-center border-t-2">
              <Button
                variant="link"
                className="text-blue-500"
                onClick={() => viewComments(post.id)}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 me-2" />
                View Comments
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

export default HugotList;
