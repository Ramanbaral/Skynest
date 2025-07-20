"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  CheckCircle,
  XCircle,
  HardDrive,
  LogOut,
  User,
  ArrowLeft,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import convertBytesToMb from "@/helpers/convertBytesToMb";
import convertBytesToGb from "@/helpers/convertBytesToGb";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [email, setEmail] = useState<string>();
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageCapacity, setStorageCapacity] = useState(0);
  const [fetchingStorageInfo, setFetchingStorageInfo] = useState(true);

  const getStorageInfo = async (userId: string) => {
    try {
      setFetchingStorageInfo(true);
      const storageInfo = await axios.get<{
        success: boolean;
        message: string;
        storageInfo: {
          storageUsed: number | null;
          storageCapacity: number | null;
          id: string | null;
          userId: string;
          storageUsedPercentage: number | null;
        };
      }>(`/api/storage-info/${userId}`);
      setStorageUsed(storageInfo.data.storageInfo.storageUsed ?? 0);
      setStorageCapacity(storageInfo.data.storageInfo.storageCapacity ?? 0);
      setFetchingStorageInfo(false);
    } catch {
      toast.error("Something Went Wrong!", { position: "top-center" });
    }
  };

  const userInf = {
    name: email?.split("@")[0],
    profileImage: "/placeholder.svg?height=120&width=120",
    isActive: true,
    storage: {
      used: convertBytesToMb(storageUsed), // MB
      total: convertBytesToGb(storageCapacity), // GB
    },
  };

  const storageUsedPercentage = (storageUsed / storageCapacity) * 100;
  const storageFreePercentage = 100 - storageUsedPercentage;

  const handleSignout = () => {
    signOut({ redirectUrl: "/" });
  };

  useEffect(() => {
    if (user) {
      getStorageInfo(user.id);
      setEmail(user.primaryEmailAddress?.emailAddress);
      setIsEmailVerified(user.hasVerifiedEmailAddress);
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen py-8 px-4">
      <Button
        variant="ghost"
        className="absolute left-10 top-5 flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className=" mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.imageUrl} alt={userInf.name} />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            {!isLoaded ? (
              <Skeleton className="w-full h-7" />
            ) : (
              <CardTitle className="text-2xl">{userInf.name}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Section */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-900">{email}</span>
              </div>
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Account Status</span>
                <Badge
                  variant={userInf.isActive ? "default" : "destructive"}
                  className="flex items-center space-x-1"
                >
                  {userInf.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  <span>{userInf.isActive ? "Active" : "Inactive"}</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Email Verification
                </span>
                <Badge
                  variant={isEmailVerified ? "default" : "secondary"}
                  className="flex items-center space-x-1"
                >
                  {isEmailVerified ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  <span>{isEmailVerified ? "Verified" : "Unverified"}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        {/* Storage Usage Card */}
        {fetchingStorageInfo ? (
          <Skeleton className="w-full h-60 rounded-xl" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5" />
                <span>Storage Usage</span>
              </CardTitle>
              <CardDescription>
                Monitor your storage consumption and available space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Storage Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {userInf.storage.used} MB</span>
                  <span>Total: {userInf.storage.total} GB</span>
                </div>
                <Progress value={storageUsedPercentage} className="h-3" />
              </div>

              {/* Storage Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {storageUsedPercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Used</div>
                </div>

                <div className="text-center p-3 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {storageFreePercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600 font-medium">Free</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {userInf.storage.total}GB
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Capacity</div>
                </div>
              </div>

              {/* Storage Details */}
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Storage Used:</span>
                  <span className="font-medium">
                    {userInf.storage.used} MB ({storageUsedPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Free:</span>
                  <span className="font-medium">
                    {convertBytesToMb(storageCapacity - storageUsed)} MB (
                    {storageFreePercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Capacity:</span>
                  <span className="font-medium">{userInf.storage.total} GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logout Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium">Sign Out</h3>
                <p className="text-sm">Sign out of your account on this device</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleSignout}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
