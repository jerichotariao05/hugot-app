'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Login() {
    const router = useRouter();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertDescription, setAlertDescription] = useState("");
    const [onAlertConfirm, setOnAlertConfirm] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const url = 'http://localhost/hugot-app/api/login.php';
            const jsonData = {
                username: data.username,
                password: data.password,
            };

            let response = await axios.get(url, {
                params: { json: JSON.stringify(jsonData), operation: 'login' },
            });

            const userData = response.data;

            if (userData && userData.status === 'success') {
                sessionStorage.setItem('HUID', userData.user.user_id);
                router.push("/user");
            } else {
                setAlertTitle("Attention Required");
                setAlertDescription(userData.message || "Registration failed. Please try again.");
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
        <div 
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/bg.png')" }}
        >
            <div className="w-full sm:max-w-lg px-4">
                <Card className='drop-shadow-lg bg-neutral-100'>
                    <CardHeader className={`space-y-1 ${styles.lobsterFont}`}>
                        <CardTitle className="text-5xl text-center text-slate-800 drop-shadow-sm mb-1">Hugot Connect</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <p className="text-3xl text-slate-800  text-center drop-shadow-sm">User Login</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2 mb-3">
                                <label htmlFor="username" className="text-sm font-medium">Username</label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    {...register("username")}
                                    className={`cust-input ${errors.username ? "border-red-500" : ""}`}
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                            </div>
                            <div className="space-y-2 mb-8 relative">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...register("password")}
                                        className={`cust-input ${errors.password ? "border-red-500" : ""}`}
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
                            </div>
                            <Button className="w-full mb-3 bg-cyan-500 shadow-lg shadow-cyan-500/40 hover:bg-cyan-400" type="submit">Login</Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <p className="text-sm text-center text-gray-700">
                            Don't have an account?
                            <Link href="/register" className="text-sky-500 hover:underline ms-2">Signup</Link>
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
            />
        </div>
    )
}
