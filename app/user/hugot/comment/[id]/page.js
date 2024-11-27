"use client";

import DefaultLayout from "@/components/default_layout";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Comments from "@/components/comments";
import CustAlertDialogue from "@/components/alert";
import Image from "next/image";

const hugotSchema = z.object({
  hugotComment: z.string().min(1, "Comment is required"),
});

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const CommentHugotPage = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [hugotSelected, setHugotSelected] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [onAlertConfirm, setOnAlertConfirm] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(hugotSchema),
  });


  async function fetchSelectedHugot() {
    try {
      const url = "http://localhost/hugot-app/api/hugot.php";
      const jsonData = {
        hugotId: id,
      };

      console.log(jsonData);

      const formData = new FormData();
      formData.append("operation", "getSelectedHugot");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const hugotData = response.data;

      if (typeof hugotData === "object" && hugotData !== null) {
        const initHugot = [hugotData].map((hugot) => ({
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

        setHugotSelected(initHugot);
      } else {
        console.error("Expected an object but received:", hugotData);
      }
    } catch (error) {
      console.error("Error fetching hugot data:", error);
    }
  }

  let selectedHugotId = hugotSelected.length > 0 ? hugotSelected[0].id : null;

  const onSubmit = async (data) => {
    if (!user) {
      console.error("User data is not available.");
      return;
    }

    try {
      const url = "http://localhost/hugot-app/api/hugot.php";
      const jsonData = {
        hugotId: selectedHugotId,
        userId: user.user_id,
        hugotComment: data.hugotComment,
      };

      const formData = new FormData();
      formData.append("operation", "addComment");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response);
      const hugotRespo = response.data;

      if (hugotRespo && hugotRespo.status === "success") {
        reset();
        setCommentUpdated(!commentUpdated);
      } else {
        setAlertTitle("Attention Required");
        setAlertDescription(
          hugotRespo.message ||
            "We're unable to post your comment. Please try again."
        );
        setOnAlertConfirm(null);
        setAlertOpen(true);
        
      }
    } catch (error) {
      setAlertTitle("Attention Required");
      setAlertDescription("An error occurred. Please try again.");
      setOnAlertConfirm(null);
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    fetchSelectedHugot();
  }, []);

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

  const handleLike = async (id) => {
    //console.log(`Liked hugot with ID: ${hugotId}`);
  };

  const handleFavorite = async (id) => {
    //console.log(`Favorited hugot with ID: ${hugotId}`);
  };

  const handleRating = async (id) => {
    // console.log(`Rated hugot with ID: ${hugotId}`);
  };

  return (
    <>
      <DefaultLayout>
        {hugotSelected.map((post) => {
          const isAuthor = user && user.user_id === post.userId;
          return (
            <Card key={post.id} className="mb-4 mt-3">
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
              <CardFooter className="p-6 bg-gradient-to-r from-slate-50 to-cyan-100">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    {" "}
                    <Image
                    src={user?.avatar || "/assets/user_profile.png"}
                    alt={`${user?.first_name || "User"} ${
                      user?.last_name || "Avatar"
                    }`}
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                    <div className="flex flex-grow gap-2">
                      <Textarea
                        id="comment"
                        type="text"
                        placeholder="Enter your comment"
                        {...register("hugotComment")}
                        className={`w-full min-h-[40px]${errors.hugotComment ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.hugotComment && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hugotComment.message}
                    </p>
                  )}
                  </div>
                  <div className="flex justify-end mt-2">
                    {" "}
                    <Button
                      className="w-32 bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-lg shadow-cyan-500/40"
                      type="submit"
                    >
                      Send comment
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          );
        })}
        {selectedHugotId && (
          <Comments hugotId={selectedHugotId} commentUpdated={commentUpdated} />
        )}
      </DefaultLayout>

      <CustAlertDialogue
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        title={alertTitle}
        description={alertDescription}
        onConfirm={onAlertConfirm}
      />
    </>
  );
};

export default CommentHugotPage;
