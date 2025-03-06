"use client"

import { Select, SelectContent, SelectTrigger, SelectValue } from "../select"
import { ChronosCategory, ChronosEvent, useChronos } from "./chronos"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, ComponentProps } from "react"
import { useForm, useFormContext } from "react-hook-form"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, XIcon } from "lucide-react"
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
  title: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string(),
  allDay: z.boolean().default(false),
  start: z.date(),
  end: z.date(),
})
type EventType = z.infer<typeof EventSchema>

type FormProps = ComponentProps<typeof PopoverPrimitive.Content> & {
  onEventChanged?: (event: ChronosEvent) => void,
  onSubmitEvent: (data: EventType) => void,
  event?: ChronosEvent,
  editMode?: boolean
}

function defaultEvent(categories: ChronosCategory[]) {
  let end = new Date()
  end.setHours(end.getHours() + 1)

  return {
    categoryId: categories[0].id,
    allDay: false,
    start: new Date(),
    end
  }
}

export function EventForm({ onSubmitEvent, onEventChanged, event, className, editMode = false, ...props }: FormProps) {
  const { categories } = useChronos()

  const form = useForm<EventType>({
    resolver: zodResolver(EventSchema),
    defaultValues: event ?? defaultEvent(categories),
  })
  
  useEffect(() => event && form.reset(event), [event, form])

  useEffect(() => {
    if (!onEventChanged || !event) return
    
    const subscription = form.watch((values) => onEventChanged({ ...event, ...values }))
    
    return () => subscription.unsubscribe()
  }, [event, form, onEventChanged])

  return (
    <PopoverContent className="w-min min-w-[400px]" {...props}>
      <Form {...form}>
        <form 
          className="space-y-4"
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={(e) => e.stopPropagation()}
          onSubmit={form.handleSubmit(onSubmitEvent)}
        >
          <h2 className="text-xl font-bold mb-4">{editMode ? "Edit event" : "Create event"}</h2>

          <PopoverPrimitive.Close asChild>
            <Button size="sm" variant="ghost" type="button" className="absolute top-4 right-4 size-8">
              <XIcon className="size-4" />
            </Button>
          </PopoverPrimitive.Close>

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
                        <div className="size-3 mr-2 rounded-full shrink-0" style={{ backgroundColor: categories.find(c => c.id === field.value)?.color }} />
                        <SelectValue placeholder="Select category" />
                        <span className="flex-1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => <CategorySelectItem key={category.id} category={category} />)}
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
              <Button type="button" variant="outline">Cancel</Button>
            </PopoverPrimitive.Close>
            <Button type="submit">{editMode ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Form>
    </PopoverContent>
  )
}

const CategorySelectItem = ({ category }: { category: ChronosCategory }) => (
  <SelectPrimitive.Item
    value={category.id.toString()}
    className={"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"}
  >
    <span className="size-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />

    <SelectPrimitive.ItemText>{category.name}</SelectPrimitive.ItemText>

    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

  </SelectPrimitive.Item>
)

function TimeRangeSection() {
  const form = useFormContext<EventType>();

  return (
    <FormField
      control={form.control}
      name="allDay"
      render={({ field }) => {
        const showTimes = !field.value;
        return (
          <FormItem className="flex flex-col space-y-0 gap-4">
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
        <FormItem className="col-span-full grid grid-cols-subgrid items-center gap-x-2 space-y-0">
          <p className="capitalize whitespace-nowrap pl-1">{name}:</p>
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full">{format(field.value, "PP")}</Button>
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
              className="w-auto mt-0"
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
