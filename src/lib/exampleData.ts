import { ChronosEvent, ChronosCategory } from '@/components/ui/chronos/chronos'

export const CATEGORIES: ChronosCategory[] = [
  {
    id: "1",
    name: "Work",
    color: "#0ea5e9" // sky-500
  },
  {
    id: "2",
    name: "Personal",
    color: "#22c55e" // green-500
  },
  {
    id: "3",
    name: "Social",
    color: "#f97316" // orange-500
  },
  {
    id: "4",
    name: "Health",
    color: "#ec4899" // pink-500
  },
  {
    id: "5",
    name: "Family",
    color: "#8b5cf6" // violet-500
  }
]

export const EVENTS: ChronosEvent[] = [
  {
    id: "1",
    title: "Team Planning Meeting",
    start: new Date("2025-02-20T09:00:00"),
    end: new Date("2025-02-20T11:00:00"),
    description: "Quarterly planning session with product team",
    categoryId: "1",
    location: "Conference Room A"
  },
  {
    id: "2",
    title: "Dentist Appointment",
    start: new Date("2025-02-21T14:30:00"),
    end: new Date("2025-02-21T16:00:00"),
    description: "Regular checkup and cleaning",
    categoryId: "2",
    location: "Dr. Smith's Dental Office"
  },
  {
    id: "3",
    title: "Birthday Party",
    start: new Date("2025-02-22T18:00:00"),
    end: new Date("2025-02-22T22:00:00"),
    description: "Sarah's 30th birthday celebration",
    categoryId: "3",
    location: "The Local Bar & Grill"
  },
  {
    id: "4",
    title: "Gym Session",
    start: new Date("2025-02-23T07:00:00"),
    end: new Date("2025-02-23T09:00:00"),
    description: "Personal training session",
    categoryId: "4",
    location: "Fitness Plus Gym"
  },
  {
    id: "5",
    title: "Client Presentation",
    start: new Date("2025-02-24T13:00:00"),
    end: new Date("2025-02-24T15:30:00"),
    description: "Project progress review with stakeholders",
    categoryId: "1",
    location: "Client HQ - Meeting Room 3"
  },
  {
    id: "6",
    title: "Movie Night",
    start: new Date("2025-02-25T19:00:00"),
    end: new Date("2025-02-25T22:00:00"),
    description: "Watch new sci-fi release with friends",
    categoryId: "3",
    location: "Cineplex Downtown"
  },
  {
    id: "7",
    title: "Parent-Teacher Conference",
    start: new Date("2025-02-26T16:00:00"),
    end: new Date("2025-02-26T17:30:00"),
    description: "Mid-semester progress discussion",
    categoryId: "5",
    location: "Lincoln Elementary School"
  },
  {
    id: "8",
    title: "Tech Workshop",
    start: new Date("2025-02-27T10:00:00"),
    end: new Date("2025-02-27T13:00:00"),
    description: "React Advanced Patterns Workshop",
    categoryId: "1",
    location: "Tech Hub - Training Room"
  },
  {
    id: "9",
    title: "House Viewing",
    start: new Date("2025-02-28T11:00:00"),
    end: new Date("2025-02-28T12:30:00"),
    description: "Property viewing with real estate agent",
    categoryId: "2",
    location: "123 Oak Street"
  },
  {
    id: "10",
    title: "Weekly Team Sync",
    start: new Date("2025-02-28T15:00:00"),
    end: new Date("2025-02-28T16:30:00"),
    description: "Regular team status update",
    categoryId: "1",
    location: "Conference Room B"
  },
  {
    id: "11",
    title: "Morning Yoga",
    start: new Date("2025-02-01T07:00:00"),
    end: new Date("2025-02-01T08:00:00"),
    description: "Morning yoga session",
    categoryId: "4",
    location: "Zen Yoga Studio"
  },
  {
    id: "12",
    title: "Coffee with Alex",
    start: new Date("2025-02-01T10:30:00"),
    end: new Date("2025-02-01T11:30:00"),
    description: "Catch up over coffee",
    categoryId: "3",
    location: "Starbucks Downtown"
  },
  {
    id: "13",
    title: "Code Review",
    start: new Date("2025-02-02T14:00:00"),
    end: new Date("2025-02-02T15:00:00"),
    description: "Review sprint PRs",
    categoryId: "1",
    location: "Virtual - Zoom"
  },
  {
    id: "14",
    title: "Family Dinner",
    start: new Date("2025-02-02T18:00:00"),
    end: new Date("2025-02-02T20:00:00"),
    description: "Monthly family dinner",
    categoryId: "5",
    location: "Mom's House"
  },
  {
    id: "15",
    title: "Sprint Planning",
    start: new Date("2025-02-03T09:00:00"),
    end: new Date("2025-02-03T11:00:00"),
    description: "Plan next sprint tasks",
    categoryId: "1",
    location: "Conference Room A"
  },
  {
    id: "16",
    title: "Grocery Shopping",
    start: new Date("2025-02-03T17:00:00"),
    end: new Date("2025-02-03T18:00:00"),
    description: "Weekly grocery run",
    categoryId: "2",
    location: "Whole Foods Market"
  },
  {
    id: "17",
    title: "Book Club",
    start: new Date("2025-02-04T19:00:00"),
    end: new Date("2025-02-04T20:30:00"),
    description: "Discussion of 'Project Hail Mary'",
    categoryId: "3",
    location: "City Library"
  },
  {
    id: "18",
    title: "Physical Therapy",
    start: new Date("2025-02-05T11:00:00"),
    end: new Date("2025-02-05T12:00:00"),
    description: "Knee rehabilitation session",
    categoryId: "4",
    location: "PhysioHealth Center"
  },
  {
    id: "19",
    title: "Team Lunch",
    start: new Date("2025-02-05T12:30:00"),
    end: new Date("2025-02-05T13:30:00"),
    description: "Monthly team bonding lunch",
    categoryId: "1",
    location: "Italian Restaurant"
  },
  {
    id: "20",
    title: "Car Service",
    start: new Date("2025-02-06T09:00:00"),
    end: new Date("2025-02-06T11:00:00"),
    description: "Regular maintenance check",
    categoryId: "2",
    location: "AutoCare Center"
  },
  {
    id: "21",
    title: "Sister's Recital",
    start: new Date("2025-02-06T19:00:00"),
    end: new Date("2025-02-06T21:00:00"),
    description: "Piano performance",
    categoryId: "5",
    location: "Community Music Hall"
  },
  {
    id: "22",
    title: "Design Review",
    start: new Date("2025-02-07T10:00:00"),
    end: new Date("2025-02-07T11:30:00"),
    description: "Review new UI designs",
    categoryId: "1",
    location: "Design Lab"
  },
  {
    id: "23",
    title: "Game Night",
    start: new Date("2025-02-07T19:00:00"),
    end: new Date("2025-02-07T23:00:00"),
    description: "Board games with friends",
    categoryId: "3",
    location: "Jake's Place"
  },
  {
    id: "24",
    title: "Weekend Run",
    start: new Date("2025-02-08T08:00:00"),
    end: new Date("2025-02-08T09:30:00"),
    description: "10k training run",
    categoryId: "4",
    location: "Riverside Park"
  },
  {
    id: "25",
    title: "Home Cleaning",
    start: new Date("2025-02-08T14:00:00"),
    end: new Date("2025-02-08T16:00:00"),
    description: "Deep clean apartment",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "26",
    title: "Tech Meetup",
    start: new Date("2025-02-09T18:00:00"),
    end: new Date("2025-02-09T20:00:00"),
    description: "Local developer meetup",
    categoryId: "1",
    location: "Tech Hub"
  },
  {
    id: "27",
    title: "Cooking Class",
    start: new Date("2025-02-10T18:00:00"),
    end: new Date("2025-02-10T20:00:00"),
    description: "Italian cooking basics",
    categoryId: "2",
    location: "Culinary Institute"
  },
  {
    id: "28",
    title: "Product Demo",
    start: new Date("2025-02-11T13:00:00"),
    end: new Date("2025-02-11T14:00:00"),
    description: "Demo new features to stakeholders",
    categoryId: "1",
    location: "Main Conference Room"
  },
  {
    id: "29",
    title: "Valentine's Shopping",
    start: new Date("2025-02-11T17:00:00"),
    end: new Date("2025-02-11T19:00:00"),
    description: "Buy Valentine's Day gifts",
    categoryId: "2",
    location: "Shopping Mall"
  },
  {
    id: "30",
    title: "Basketball Game",
    start: new Date("2025-02-12T19:30:00"),
    end: new Date("2025-02-12T21:30:00"),
    description: "Local league game",
    categoryId: "4",
    location: "Community Center"
  },
  {
    id: "31",
    title: "Dentist Check-up",
    start: new Date("2025-02-13T09:00:00"),
    end: new Date("2025-02-13T10:00:00"),
    description: "Regular dental check-up",
    categoryId: "4",
    location: "Smile Dental Clinic"
  },
  {
    id: "32",
    title: "Valentine's Dinner",
    start: new Date("2025-02-14T19:00:00"),
    end: new Date("2025-02-14T21:00:00"),
    description: "Romantic dinner date",
    categoryId: "3",
    location: "Le Petit Bistro"
  },
  {
    id: "33",
    title: "Weekend Brunch",
    start: new Date("2025-02-15T11:00:00"),
    end: new Date("2025-02-15T12:30:00"),
    description: "Brunch with college friends",
    categoryId: "3",
    location: "Cafe Sunrise"
  },
  {
    id: "34",
    title: "Home Repairs",
    start: new Date("2025-02-15T14:00:00"),
    end: new Date("2025-02-15T16:00:00"),
    description: "Fix kitchen sink",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "35",
    title: "Family Movie",
    start: new Date("2025-02-16T15:00:00"),
    end: new Date("2025-02-16T17:30:00"),
    description: "Watch new animated film",
    categoryId: "5",
    location: "Cinema City"
  },
  {
    id: "36",
    title: "Team Building",
    start: new Date("2025-02-17T13:00:00"),
    end: new Date("2025-02-17T17:00:00"),
    description: "Escape room challenge",
    categoryId: "1",
    location: "Escape Room Downtown"
  },
  {
    id: "37",
    title: "Massage Appointment",
    start: new Date("2025-02-18T16:00:00"),
    end: new Date("2025-02-18T17:00:00"),
    description: "Monthly relaxation massage",
    categoryId: "4",
    location: "Wellness Spa"
  },
  {
    id: "38",
    title: "Client Meeting",
    start: new Date("2025-02-19T10:00:00"),
    end: new Date("2025-02-19T11:30:00"),
    description: "Quarterly review meeting",
    categoryId: "1",
    location: "Client Office"
  },
  {
    id: "39",
    title: "Art Class",
    start: new Date("2025-02-19T18:00:00"),
    end: new Date("2025-02-19T20:00:00"),
    description: "Watercolor painting basics",
    categoryId: "2",
    location: "Art Studio"
  },
  {
    id: "40",
    title: "Family Game Night",
    start: new Date("2025-02-19T20:30:00"),
    end: new Date("2025-02-19T22:30:00"),
    description: "Monthly family game night",
    categoryId: "5",
    location: "Dad's House"
  }
]