"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories, useCreateCategory } from "@/lib/hooks";

type Category = { id: string; name: string };

type CategoryComboboxProps = {
  value: string;
  onChange: (categoryId: string) => void;
};

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();

  const selectedCategory = categories.find((c: Category) => c.id === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c: Category) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const exactMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? categories.some((c: Category) => c.name.toLowerCase() === q) : true;
  }, [categories, search]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch("");
    }
  }, [open]);

  function handleCreate() {
    const name = search.trim();
    if (!name) return;

    createMutation.mutate(
      { name },
      {
        onSuccess: (created) => {
          onChange(created.id);
          setSearch("");
          setOpen(false);
        },
      }
    );
  }

  function handleSelect(categoryId: string) {
    onChange(categoryId);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedCategory ? (
            selectedCategory.name
          ) : (
            <span className="text-muted-foreground">
              Seleccionar categoría...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (filtered.length === 1) {
                  handleSelect(filtered[0].id);
                } else if (!exactMatch && search.trim()) {
                  handleCreate();
                }
              }
            }}
            placeholder="Buscar o crear categoría..."
            className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-[200px] overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </div>
          ) : (
            <>
              {filtered.map((cat: Category) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelect(cat.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === cat.id && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cat.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cat.name}
                </button>
              ))}

              {filtered.length === 0 && !search.trim() && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No hay categorías
                </p>
              )}

              {!exactMatch && search.trim() && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span className="mr-2 flex h-4 w-4 items-center justify-center text-xs font-bold">
                      +
                    </span>
                  )}
                  Crear &ldquo;{search.trim()}&rdquo;
                </button>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
