"use client"

import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { ChronosEvent, useChronos } from "./chronos"
import { useForm, useFormContext } from "react-hook-form"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "./separator"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./button"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { z } from "zod"

const EventSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  categoryId: z.string(),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean(),
  location: z.string().optional(),
  description: z.string().optional(),
})
type EventType = z.infer<typeof EventSchema>

type FormProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  event?: ChronosEvent,
  onSubmit: (data: EventType) => void,
}

function EventForm({ event, onSubmit, className, ...props }: FormProps) {
  const { categories } = useChronos()
  const form = useForm<EventType>({
    resolver: zodResolver(EventSchema),
    defaultValues: event ? {
      ...event,
      categoryId: event.categoryId?.toString() || ""
    } : {
      title: "",
      categoryId: categories.length > 0 ? categories[0].id.toString() : "",
      start: new Date(),
      end: new Date(),
      allDay: false,
      location: "",
      description: ""
    }
  })

  return (
    <PopoverContent className="w-min min-w-[400px]" {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">{event ? "Edit event" : "Create event"}</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex gap-4 [&>*]:flex-1">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <span className="size-3 mr-1 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator className="mt-6 mb-5" />

          <TimeRangeSection />

          <div className="flex justify-center gap-3 pt-4">
            <PopoverPrimitive.Close asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </PopoverPrimitive.Close>
            <Button type="submit">
              {event ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </PopoverContent>
  )
}

function TimeRangeSection() {
  const form = useFormContext<EventType>();

  return (
    <FormField
      control={form.control}
      name="allDay"
      render={({ field }) => (
        <FormItem>
          <Tabs value={field.value ? "date" : "datetime"} onValueChange={(value: string) => field.onChange(value === "date")} className="w-full gap-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="datetime">Date & Time</TabsTrigger>
              <TabsTrigger value="date">Date Only</TabsTrigger>
            </TabsList>
            <TabsContent value="datetime">
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-2 gap-y-3">
                <DateTimeField name="start" />
                <DateTimeField name="end" />
              </div>
            </TabsContent>
            <TabsContent value="date">
              <Calendar
                initialFocus
                mode="range"
                numberOfMonths={2}
                defaultMonth={form.watch("start")}
                selected={{ from: form.watch("start"), to: form.watch("end") }}
                onSelect={(range) => {
                  if (!range?.from) return;
                  form.setValue("start", range.from);
                  form.setValue("end", range.to || range.from);
                }}
              />
            </TabsContent>
          </Tabs>
        </FormItem>
      )}
    />
  );
}

function DateTimeField({ name }: { name: "start" | "end" }) {
  const form = useFormContext<EventType>();

  const validateAndUpdateRange = (newDate: Date) => {
    const otherField = name === "start" ? "end" : "start";
    const otherValue = form.getValues(otherField);

    if (name === "start" && newDate > otherValue) {
      form.setValue(otherField, newDate);
    } else if (name === "end" && newDate < otherValue) {
      form.setValue(otherField, newDate);
    }
    return newDate;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-full grid grid-cols-subgrid items-center gap-x-2">
          <p className="capitalize">{name}:</p>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="flex-1">
                  {format(field.value || new Date(), "PP")}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  if (!date) return
                  const currentTime = field.value;
                  date.setHours(currentTime.getHours())
                  date.setMinutes(currentTime.getMinutes())
                  field.onChange(validateAndUpdateRange(date))
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={field.value ? format(field.value, "HH:mm") : ""}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":")
              const newDate = new Date(field.value)
              newDate.setHours(parseInt(hours))
              newDate.setMinutes(parseInt(minutes))
              field.onChange(validateAndUpdateRange(newDate))
            }}
          />
        </FormItem>
      )}
    />
  );
}

export { EventForm }