"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { checkWebsiteStatus } from "@/actions/monitor";
import { Monitor } from "@/utils";

const formSchema = z.object({
  monitorType: z.enum(["http", "tcp", "udp"], {
    required_error: "Please select a monitor type.",
  }),
  name: z.string().min(2, {
    message: "Monitor name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  interval: z.number().min(1).max(60),
});
type Data = {
  id: string;
  url: string;
};

export default function Component() {
  const [open, setOpen] = useState(false);
  const mutation = trpc.createMonitor.useMutation({
    onSuccess: (data) => {
      console.log("djafskld", data);
      checkWebsiteStatus(data.data[0] as Data);
      toast.success("created successfully", { position: "top-center" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monitorType: "http",
      name: "",
      url: "",
      interval: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const data = await mutation.mutateAsync({
      url: values.url,
      interval: values.interval,
      name: values.name,
    });
    console.log(data.data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        New Monitor
      </Button>
      <DialogContent className="sm:max-w-[425px] bg-[#1e2530] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            New Monitor
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Advanced HTTP settings and SSL certificate expiration alerts are
            available on paid accounts only.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="monitorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitor Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#2a3441] border-gray-600">
                        <SelectValue placeholder="Select monitor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#2a3441]">
                      <SelectItem value="http">HTTP(S)</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitor name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter monitor name"
                      {...field}
                      className="bg-[#2a3441] border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      className="bg-[#2a3441] border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Interval</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between text-sm text-gray-400">
                    <span>1 min</span>
                    <span>{field.value} min</span>
                    <span>60 min</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Monitor
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
