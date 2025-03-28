"use client";

import { format } from "date-fns";
import { useState } from "react";
import { CalendarIcon, LinkIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicantData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  governmentId: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  interviewMode: string;
  venue?: string;
  meetingLink?: string;
}

interface ApplicationConfirmProps {
  data: ApplicantData;
}

export function ApplicationConfirm({ data }: ApplicationConfirmProps) {
  const [showDialog, setShowDialog] = useState(false);
  
  const fullName = `${data.firstName} ${data.lastName}`;
  const initials = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();
  const formattedDOB = format(new Date(data.dateOfBirth), "MMMM dd, yyyy");
  const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{fullName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{data.jobRole}</span>
            </CardDescription>
          </div>
        </div>
        <div className="flex justify-end">
          <Badge variant={data.interviewMode === "online" ? "default" : "outline"}>
            {data.interviewMode === "online" ? "Online Interview" : "In-person Interview"}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDOB} <span className="text-xs text-muted-foreground">({age} years)</span></span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Government ID</p>
            <p className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2 cursor-default">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{data.governmentId.slice(0, 3)}•••••{data.governmentId.slice(-2)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ID is partially hidden for security</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
          <div className="grid grid-cols-1 gap-2">
            <p className="flex items-center gap-2 overflow-hidden text-ellipsis">
              <PhoneIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{data.phoneNumber}</span>
            </p>
            <p className="flex items-center gap-2 overflow-hidden text-ellipsis">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{data.email}</span>
            </p>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <p className="text-sm font-medium text-muted-foreground">Interview Details</p>
          <div className="rounded-md bg-secondary/50 p-3">
            {data.interviewMode === "online" ? (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <a href={data.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline overflow-hidden text-ellipsis">
                  {data.meetingLink}
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-primary" />
                <span>{data.venue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">View Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Full information for {fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p>{data.firstName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p>{data.lastName}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p>{formattedDOB} ({age} years)</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Government ID</p>
                <p>{data.governmentId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{data.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{data.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Job Role</p>
                <p>{data.jobRole}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Interview Mode</p>
                <p>{data.interviewMode === "online" ? "Online" : "In-person"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {data.interviewMode === "online" ? "Meeting Link" : "Venue"}
                </p>
                <p>{data.interviewMode === "online" ? data.meetingLink : data.venue}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="default">Send Reminder</Button>
      </CardFooter>
    </Card>
  );
}