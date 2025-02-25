"use client"

import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChronosEvent, useChronos } from "./chronos"
import { useForm, useFormContext } from "react-hook-form"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
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
  onSubmit: (data: EventType) => void,
  event?: ChronosEvent,
  editMode?: boolean
}

export function EventForm({ onSubmit, event, className, editMode = false, ...props }: FormProps) {
  const { categories } = useChronos()
  const defaultCategoryId = categories.length > 0 ? categories[0].id : ""

  const form = useForm<EventType>({
    resolver: zodResolver(EventSchema),
    defaultValues: event ? {
      ...event,
      categoryId: event.categoryId ?? defaultCategoryId
    } : {
      title: "",
      categoryId: defaultCategoryId,
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
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()} 
          className="space-y-4"
        >
          <h2 className="text-xl font-bold mb-4">{editMode ? "Edit event" : "Create event"}</h2>

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
                  <Textarea placeholder="Description" className="max-h-40" {...field} />
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
              {editMode ? "Update" : "Create"}
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
      render={({ field }) => {
        const showTimes = !field.value;
        return (
          <FormItem className="gap-4">
            <Tabs 
              value={showTimes ? "datetime" : "date"} 
              onValueChange={(value: string) => field.onChange(value === "date")} 
              className="w-full gap-4"
            >
              <TabsList className="grid w-full grid-cols-2 [&>*]:transition-all">
                <TabsTrigger value="datetime">Times</TabsTrigger>
                <TabsTrigger value="date">Full Days</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className={cn(
              "grid items-center gap-x-3 gap-y-4 grid-rows-2",
              showTimes ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[auto_1fr]'
            )}>
              <DateTimeField name="start" showTime={showTimes} />
              <DateTimeField name="end" showTime={showTimes} />
            </div>
          </FormItem>
        );
      }}
    />
  );
}

function DateTimeField({ name, showTime }: { name: "start" | "end", showTime: boolean }) {
  const form = useFormContext<EventType>();

  const validateAndUpdateRange = (newDate: Date) => {
    const otherField = name === "start" ? "end" : "start";
    const otherDate = form.getValues(otherField);

    if (name === "start" && newDate > otherDate) form.setValue(otherField, newDate);
    else if (name === "end" && newDate < otherDate) form.setValue(otherField, newDate);

    return newDate;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-full gap grid-cols-subgrid items-center gap-x-2">
          <p className="capitalize whitespace-nowrap pl-1">{name}:</p>
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full">
                    {format(field.value, "PP")}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={field.value}
                  onSelect={(date) => {
                    if (!date) return
                    const time = field.value;
                    date.setHours(time.getHours())
                    date.setMinutes(time.getMinutes())
                    field.onChange(validateAndUpdateRange(date))
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {showTime && (
            <Input
              type="time"
              className="w-auto"
              value={field.value ? format(field.value, "HH:mm") : ""}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":")
                const newDate = new Date(field.value)
                newDate.setHours(parseInt(hours))
                newDate.setMinutes(parseInt(minutes))
                field.onChange(validateAndUpdateRange(newDate))
              }}
            />
          )}
        </FormItem>
      )}
    />
  );
}
