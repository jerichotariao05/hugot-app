"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CustAlertDialogue from "@/components/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import HugotList from "./hugot_post";
import Image from "next/image";

const hugotSchema = z.object({
  hugotLine: z.string().min(1, "Hugot line is required"),
});

const AddHugot = () => {
  const { user } = useUser();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [onAlertConfirm, setOnAlertConfirm] = useState(null);
  const [postsUpdated, setPostsUpdated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(hugotSchema),
  });

  const onSubmit = async (data) => {
    if (!user) {
      console.error("User data is not available.");
      return;
    }

    try {
      const url = "http://localhost/hugot-app/api/hugot.php";
      const jsonData = {
        userId: user.user_id,
        hugotLine: data.hugotLine,
      };

      const formData = new FormData();
      formData.append("operation", "addHugot");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const hugotRespo = response.data;

      if (hugotRespo && hugotRespo.status === "success") {
        reset();
        setAlertTitle("Success!");
        setAlertDescription(
          hugotRespo.message || "Your hugot has been successfully posted."
        );
        setOnAlertConfirm(null);
        setAlertOpen(true);
        setPostsUpdated(!postsUpdated);
      } else {
        setAlertTitle("Attention Required");
        setAlertDescription(
          hugotRespo.message ||
            "We're unable to post your hugot. Please try again."
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

  return (
    <>
      <div>
        <Card className="w-full mt-3">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start space-x-4 mb-3">
                  <Image
                    src={user?.avatar || "/assets/user_profile.png"}
                    alt={`${user?.first_name || "User"} ${
                      user?.last_name || "Avatar"
                    }`}
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                <div className="flex flex-col gap-2 w-full">
                  <Textarea
                    id="hugotline"
                    type="text"
                    placeholder="What's on your mind?"
                    {...register("hugotLine")}
                    className={errors.hugotLine ? "border-red-500" : ""}
                  />
                  {errors.hugotLine && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hugotLine.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="w-28 bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-lg shadow-cyan-500/40"
                  type="submit"
                >
                  Post hugot
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <HugotList user={user} postsUpdated={postsUpdated} />

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

export default AddHugot;
