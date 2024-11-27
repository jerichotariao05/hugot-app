'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import styles from '../../../css/text.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import CustAlertDialogue from "@/components/alert";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const checkPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[\W_]/.test(password)) strength++;

  if (strength === 5) return "Strong";
  if (strength >= 3) return "Fair";
  return "Weak";
};

const loginSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[\d]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPass: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ["confirmPass"],
    message: "Passwords do not match",
  });

export default function Login() {
  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [onAlertConfirm, setOnAlertConfirm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {

      const url = 'http://localhost/hugot-app/api/user.php';
      const jsonData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPass: data.confirmPass,
      };

      const formData = new FormData();
      formData.append("operation", "registerUser");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const user = response.data;

      if (user && user.status === 'success') {
        setAlertTitle("Success");
        setAlertDescription(user.message);
        setOnAlertConfirm(() => () => router.push("/login"));
        setAlertOpen(true);
      } else {
        setAlertTitle("Attention Required");
        setAlertDescription(user.message || "Registration failed. Please try again.");
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

  
  const password = watch("password", "");
  

  useEffect(() => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength("");
    }
  }, [password]);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/bg.png')" }}
    >
      <div className="w-full sm:max-w-lg px-4">
        <Card className="drop-shadow-lg bg-neutral-100 max-h-[calc(100vh-152px)] overflow-y-auto">
        <CardHeader className={`space-y-1 ${styles.lobsterFont}`}>
            <CardTitle className="text-5xl text-center text-slate-800 drop-shadow-sm mb-1">Hugot Connect</CardTitle>
        </CardHeader>
          <CardContent className="grid gap-6">
          <p className="text-3xl text-slate-800  text-center drop-shadow-sm">User Signup</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="text-sm font-medium">
                    First name
                  </label>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    {...register("firstName")}
                    className={`cust-input ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastname" className="text-sm font-medium">
                    Last name
                  </label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    {...register("lastName")}
                    className={`cust-input ${errors.lastName ? "border-red-500" : ""} `}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className= {`cust-input ${errors.username ? "border-red-500" : ""} `}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 mb-3">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className= {`cust-input ${errors.email ? "border-red-500" : ""} `}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
              {/* <div className="space-y-2 mb-3">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                {password && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === "Strong"
                        ? "text-green-500"
                        : passwordStrength === "Fair"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </p>
                )}
              </div> */}

              <div className="space-y-2 mb-3 relative">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                      <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...register("password")}
                          className= {`cust-input ${errors.password ? "border-red-500" : ""} `}
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                      >
                          {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                              <EyeIcon className="h-5 w-5" />
                          )}
                      </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  {password && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === "Strong"
                        ? "text-green-500"
                        : passwordStrength === "Fair"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </p>
                )}
              </div>
              {/* <div className="space-y-2 mb-8">
                <label
                  htmlFor="confirmpassword"
                  className="text-sm font-medium"
                >
                  Confirm password
                </label>
                <Input
                  id="confirmpassword"
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPass")}
                  className={errors.confirmPass ? "border-red-500" : ""}
                />
                {errors.confirmPass && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPass.message}
                  </p>
                )}
              </div> */}
              <div className="space-y-2 mb-8 relative">
                  <label htmlFor="confirmpassword" className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                      <Input
                          id="confirmpassword"
                          type={showConfirmPass ? "text" : "password"}
                          placeholder="Enter password"
                          {...register("confirmPass")}
                          className= {`cust-input ${errors.confirmPass ? "border-red-500" : ""} `}
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                      >
                          {showConfirmPass ? (
                              <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                              <EyeIcon className="h-5 w-5" />
                          )}
                      </button>
                  </div>
                  {errors.confirmPass && <p className="text-red-500 text-sm mt-1">{errors.confirmPass.message}</p>}
              </div>
              <Button
                className="w-full mb-3 bg-cyan-500 shadow-lg shadow-cyan-500/40 hover:bg-cyan-400"
                type="submit"
              >
                Signup
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-center text-gray-700">
              Already have an account?
              <Link
                href="/login"
                className="text-sky-500 hover:underline ms-2"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <CustAlertDialogue
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        title={alertTitle}
        description={alertDescription}
        onConfirm={onAlertConfirm}
        // onCancel={() => setAlertOpen(false)}
      />
    </div>
  );
}
