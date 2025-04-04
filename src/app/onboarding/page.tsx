"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/UseToast";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { update: updateSession } = useSession();
  const [step, setStep] = useState<"choose" | "create" | "join">("choose");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessCode: "",
  });

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/business/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.businessName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create business");
      }

      const data = await response.json();

      toast({
        title: "Business created!",
        description: "You've successfully created your business.",
      });

      // Update the session with new role and businessId
      await updateSession({
        ...data.user,
        businessId: data.business.id,
      });

      // Force a page refresh to ensure all components update
      window.location.href = "/manager/dashboard";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/business/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.businessCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join business");
      }

      toast({
        title: "Welcome!",
        description: "You've successfully joined the business.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to join business. Please check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "choose") {
    return (
      <div className="container max-w-lg mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SolveCircle!</CardTitle>
            <CardDescription>
              To get started, you can either create a new business or join an
              existing one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setStep("create")}
              className="w-full mb-4"
              size="lg"
            >
              Create a New Business
            </Button>
            <Button
              onClick={() => setStep("join")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Join an Existing Business
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "create") {
    return (
      <div className="container max-w-lg mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Business</CardTitle>
            <CardDescription>
              Set up your business on SolveCircle. You'll be the owner and can
              invite others to join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("choose")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Business"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Join a Business</CardTitle>
          <CardDescription>
            Enter the business code provided by your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinBusiness} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessCode">Business Code</Label>
              <Input
                id="businessCode"
                placeholder="Enter business code"
                value={formData.businessCode}
                onChange={(e) =>
                  setFormData({ ...formData, businessCode: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose")}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Join Business"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
