"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

interface CategoriesProps {
  categories: Category[];
  businessId: string;
}

export function Categories({ categories, businessId }: CategoriesProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#6366f1",
    });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingCategory
            ? formData
            : {
                ...formData,
                businessId,
              }
        ),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error ||
            `Failed to ${editingCategory ? "update" : "create"} category`
        );
      }

      toast.success(
        `Category ${editingCategory ? "updated" : "created"} successfully`
      );
      resetForm();
      setShowNewCategoryDialog(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${editingCategory ? "update" : "create"} category`
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
    setShowNewCategoryDialog(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your task categories</CardDescription>
          </div>
          <Dialog
            open={showNewCategoryDialog}
            onOpenChange={setShowNewCategoryDialog}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setShowNewCategoryDialog(true);
                }}
              >
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? "Make changes to the category here. Click save when you're done."
                    : "Create a new category to organize your tasks."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter category description"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-20 h-10 p-1"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-muted-foreground">
                      Choose a color for the category
                    </span>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim()}
                  >
                    {isSubmitting
                      ? editingCategory
                        ? "Saving..."
                        : "Creating..."
                      : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleEdit(category)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(category)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No categories found. Create one to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
