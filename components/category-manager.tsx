"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/hooks";

type CategoryManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryManager({ open, onOpenChange }: CategoryManagerProps) {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  function startEdit(id: string, name: string) {
    setEditingId(id);
    setEditName(name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function saveEdit(id: string) {
    const name = editName.trim();
    if (!name) return;

    updateMutation.mutate(
      { id, data: { name } },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada");
          cancelEdit();
        },
        onError: (err) => {
          toast.error(err.message || "Error al actualizar la categoría");
        },
      }
    );
  }

  function handleDelete(id: string, name: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success(`"${name}" eliminada`),
      onError: (err) => toast.error(err.message),
    });
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;

    createMutation.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Categoría creada");
          setNewName("");
        },
        onError: () => toast.error("Error al crear la categoría"),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Categorías</DialogTitle>
          <DialogDescription>
            Agregá, editá o eliminá categorías.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Nueva categoría..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleCreate}
            disabled={!newName.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="max-h-[320px] space-y-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay categorías creadas
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
              >
                {editingId === cat.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEdit(cat.id);
                        }
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="h-8"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => saveEdit(cat.id)}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => startEdit(cat.id, cat.name)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
