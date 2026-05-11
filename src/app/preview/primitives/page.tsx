"use client";

import { Button } from "@/lib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/lib/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";

export default function PreviewPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">shadcn smoke test</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Button</h2>
        <Button>Start</Button>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Select</h2>
        <Select defaultValue="medium">
          <SelectTrigger>
            <SelectValue placeholder="Board size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">RadioGroup</h2>
        <RadioGroup defaultValue="medium">
          <label htmlFor="diff-easy" className="flex items-center gap-2 text-sm">
            <RadioGroupItem id="diff-easy" value="easy" /> Easy
          </label>
          <label htmlFor="diff-medium" className="flex items-center gap-2 text-sm">
            <RadioGroupItem id="diff-medium" value="medium" /> Medium
          </label>
          <label htmlFor="diff-hard" className="flex items-center gap-2 text-sm">
            <RadioGroupItem id="diff-hard" value="hard" /> Hard
          </label>
        </RadioGroup>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Dialog</h2>
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Smoke test</DialogTitle>
              <DialogDescription>If you can read this, dialogs render.</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
