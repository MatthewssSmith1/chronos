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
    title: "Dentist Checkup",
    start: new Date("2025-02-18T16:00:00"),
    end: new Date("2025-02-18T17:00:00"),
    description: "Biannual teeth cleaning and exam",
    categoryId: "4",
    location: "Bright Smile Dental"
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
  },
  {
    id: "41",
    title: "March Planning Meeting",
    start: new Date("2025-03-01T09:00:00"),
    end: new Date("2025-03-01T11:00:00"),
    description: "Monthly planning session with team",
    categoryId: "1",
    location: "Conference Room A"
  },
  {
    id: "42",
    title: "Weekend Hike",
    start: new Date("2025-03-01T14:00:00"),
    end: new Date("2025-03-01T17:00:00"),
    description: "Hiking at nature reserve",
    categoryId: "4",
    location: "Eagle Mountain Trail"
  },
  {
    id: "43",
    title: "Sunday Brunch",
    start: new Date("2025-03-02T11:00:00"),
    end: new Date("2025-03-02T13:00:00"),
    description: "Brunch with friends",
    categoryId: "3",
    location: "Sunrise Cafe"
  },
  {
    id: "44",
    title: "Home Organization",
    start: new Date("2025-03-02T15:00:00"),
    end: new Date("2025-03-02T18:00:00"),
    description: "Spring cleaning and organization",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "45",
    title: "Sprint Kickoff",
    start: new Date("2025-03-03T09:30:00"),
    end: new Date("2025-03-03T11:30:00"),
    description: "Start of new development sprint",
    categoryId: "1",
    location: "Main Conference Room"
  },
  {
    id: "46",
    title: "Dentist Follow-up",
    start: new Date("2025-03-03T15:00:00"),
    end: new Date("2025-03-03T16:00:00"),
    description: "Follow-up appointment",
    categoryId: "4",
    location: "Dr. Smith's Dental Office"
  },
  {
    id: "47",
    title: "Book Club Meeting",
    start: new Date("2025-03-04T19:00:00"),
    end: new Date("2025-03-04T21:00:00"),
    description: "Discussion of 'The Midnight Library'",
    categoryId: "3",
  },
  {
    id: "48",
    title: "Team Workshop",
    start: new Date("2025-03-05T10:00:00"),
    end: new Date("2025-03-05T12:30:00"),
    description: "Agile methodology workshop",
    categoryId: "1",
    location: "Training Room B"
  },
  {
    id: "49",
    title: "Grocery Shopping",
    start: new Date("2025-03-05T17:30:00"),
    end: new Date("2025-03-05T18:30:00"),
    description: "Weekly grocery run",
    categoryId: "2",
    location: "Whole Foods Market"
  },
  {
    id: "50",
    title: "Parent-Teacher Meeting",
    start: new Date("2025-03-06T16:00:00"),
    end: new Date("2025-03-06T17:00:00"),
    description: "Discuss academic progress",
    categoryId: "5",
    location: "Lincoln Elementary School"
  },
  {
    id: "51",
    title: "Movie Night",
    start: new Date("2025-03-06T19:30:00"),
    end: new Date("2025-03-06T22:00:00"),
    description: "Watch new release with friends",
    categoryId: "3",
    location: "Cineplex Downtown"
  },
  {
    id: "52",
    title: "Code Review",
    start: new Date("2025-03-07T14:00:00"),
    end: new Date("2025-03-07T15:30:00"),
    description: "Review pull requests",
    categoryId: "1",
    location: "Virtual - Zoom"
  },
  {
    id: "53",
    title: "Weekend Market",
    start: new Date("2025-03-08T09:00:00"),
    end: new Date("2025-03-08T11:00:00"),
    description: "Visit farmers market",
    categoryId: "2",
    location: "Downtown Market Square"
  },
  {
    id: "54",
    title: "Yoga Class",
    start: new Date("2025-03-08T16:00:00"),
    end: new Date("2025-03-08T17:30:00"),
    description: "Vinyasa flow class",
    categoryId: "4",
    location: "Zen Yoga Studio"
  },
  {
    id: "55",
    title: "Family Dinner",
    start: new Date("2025-03-09T18:00:00"),
    end: new Date("2025-03-09T20:30:00"),
    description: "Monthly family dinner",
    categoryId: "5",
    location: "Mom's House"
  },
  {
    id: "56",
    title: "Client Presentation",
    start: new Date("2025-03-10T10:00:00"),
    end: new Date("2025-03-10T12:00:00"),
    description: "Present project progress",
    categoryId: "1",
    location: "Client HQ"
  },
  {
    id: "57",
    title: "Car Maintenance",
    start: new Date("2025-03-10T15:00:00"),
    end: new Date("2025-03-10T16:30:00"),
    description: "Oil change and inspection",
    categoryId: "2",
    location: "AutoCare Center"
  },
  {
    id: "58",
    title: "Basketball Game",
    start: new Date("2025-03-11T19:00:00"),
    end: new Date("2025-03-11T21:00:00"),
    description: "Local league game",
    categoryId: "4",
    location: "Community Center"
  },
  {
    id: "59",
    title: "Team Lunch",
    start: new Date("2025-03-12T12:00:00"),
    end: new Date("2025-03-12T13:30:00"),
    description: "Monthly team bonding lunch",
    categoryId: "1",
    location: "Italian Restaurant"
  },
  {
    id: "60",
    title: "Coffee with Alex",
    start: new Date("2025-03-12T16:00:00"),
    end: new Date("2025-03-12T17:00:00"),
    description: "Catch up over coffee",
    categoryId: "3",
    location: "Starbucks Downtown"
  },
  {
    id: "61",
    title: "Doctor's Appointment",
    start: new Date("2025-03-13T10:30:00"),
    end: new Date("2025-03-13T11:30:00"),
    description: "Annual physical checkup",
    categoryId: "4",
    location: "Medical Center"
  },
  {
    id: "62",
    title: "Home Repairs",
    start: new Date("2025-03-14T14:00:00"),
    end: new Date("2025-03-14T16:00:00"),
    description: "Fix bathroom sink",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "63",
    title: "Game Night",
    start: new Date("2025-03-14T19:00:00"),
    end: new Date("2025-03-14T23:00:00"),
    description: "Board games with friends",
    categoryId: "3",
    location: "Jake's Place"
  },
  {
    id: "64",
    title: "Weekend Run",
    start: new Date("2025-03-15T08:00:00"),
    end: new Date("2025-03-15T09:30:00"),
    description: "10k training run",
    categoryId: "4",
    location: "Riverside Park"
  },
  {
    id: "65",
    title: "Shopping Trip",
    start: new Date("2025-03-15T13:00:00"),
    end: new Date("2025-03-15T16:00:00"),
    description: "Spring wardrobe shopping",
    categoryId: "2",
    location: "Downtown Mall"
  },
  {
    id: "66",
    title: "Family Movie",
    start: new Date("2025-03-16T15:00:00"),
    end: new Date("2025-03-16T17:30:00"),
    description: "Watch new animated film",
    categoryId: "5",
    location: "Cinema City"
  },
  {
    id: "67",
    title: "Design Review",
    start: new Date("2025-03-17T10:00:00"),
    end: new Date("2025-03-17T11:30:00"),
    description: "Review new UI designs",
    categoryId: "1",
    location: "Design Lab"
  },
  {
    id: "68",
    title: "Cooking Class",
    start: new Date("2025-03-17T18:00:00"),
    end: new Date("2025-03-17T20:00:00"),
    description: "Asian cuisine basics",
    categoryId: "2",
    location: "Culinary Institute"
  },
  {
    id: "69",
    title: "Tech Meetup",
    start: new Date("2025-03-18T18:00:00"),
    end: new Date("2025-03-18T20:00:00"),
    description: "Local developer networking",
    categoryId: "1",
    location: "Tech Hub"
  },
  {
    id: "70",
    title: "Massage Appointment",
    start: new Date("2025-03-19T16:00:00"),
    end: new Date("2025-03-19T17:00:00"),
    description: "Monthly relaxation massage",
    categoryId: "4",
    location: "Wellness Spa"
  },
  {
    id: "71",
    title: "Art Exhibition",
    start: new Date("2025-03-20T18:30:00"),
    end: new Date("2025-03-20T20:30:00"),
    description: "Local artists showcase",
    categoryId: "3",
    location: "City Gallery"
  },
  {
    id: "72",
    title: "Spring Equinox Celebration",
    start: new Date("2025-03-21T17:00:00"),
    end: new Date("2025-03-21T19:00:00"),
    description: "Community celebration of spring",
    categoryId: "5",
    location: "Community Park"
  },
  {
    id: "73",
    title: "Weekend Workshop",
    start: new Date("2025-03-22T10:00:00"),
    end: new Date("2025-03-22T13:00:00"),
    description: "DIY home decor workshop",
    categoryId: "2",
    location: "Craft Center"
  },
  {
    id: "74",
    title: "Cycling Group",
    start: new Date("2025-03-22T15:00:00"),
    end: new Date("2025-03-22T17:00:00"),
    description: "Group cycling event",
    categoryId: "4",
    location: "Lakeside Trail"
  },
  {
    id: "75",
    title: "Sunday Brunch",
    start: new Date("2025-03-23T11:00:00"),
    end: new Date("2025-03-23T13:00:00"),
    description: "Brunch with college friends",
    categoryId: "3",
    location: "Cafe Sunrise"
  },
  {
    id: "76",
    title: "Project Deadline",
    start: new Date("2025-03-24T09:00:00"),
    end: new Date("2025-03-24T17:00:00"),
    description: "Final submission of Q1 project",
    categoryId: "1",
    location: "Office"
  },
  {
    id: "77",
    title: "Parent-Teacher Conference",
    start: new Date("2025-03-25T16:00:00"),
    end: new Date("2025-03-25T17:00:00"),
    description: "End of quarter progress review",
    categoryId: "5",
    location: "Lincoln Elementary School"
  },
  {
    id: "78",
    title: "Team Building",
    start: new Date("2025-03-26T13:00:00"),
    end: new Date("2025-03-26T17:00:00"),
    description: "Outdoor team building activities",
    categoryId: "1",
    location: "Adventure Park"
  },
  {
    id: "79",
    title: "Concert",
    start: new Date("2025-03-27T19:30:00"),
    end: new Date("2025-03-27T22:30:00"),
    description: "Live music performance",
    categoryId: "3",
    location: "City Concert Hall"
  },
  {
    id: "80",
    title: "Quarterly Review",
    start: new Date("2025-03-28T10:00:00"),
    end: new Date("2025-03-28T12:00:00"),
    description: "Q1 performance review",
    categoryId: "1",
    location: "Meeting Room C"
  },
  {
    id: "81",
    title: "Dinner Party",
    start: new Date("2025-03-28T19:00:00"),
    end: new Date("2025-03-28T22:00:00"),
    description: "Dinner party with neighbors",
    categoryId: "3",
    location: "Home"
  },
  {
    id: "82",
    title: "Weekend Getaway Planning",
    start: new Date("2025-03-29T10:00:00"),
    end: new Date("2025-03-29T12:00:00"),
    description: "Plan upcoming weekend trip",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "83",
    title: "Fitness Class",
    start: new Date("2025-03-29T15:00:00"),
    end: new Date("2025-03-29T16:00:00"),
    description: "HIIT workout class",
    categoryId: "4",
    location: "Fitness Plus Gym"
  },
  {
    id: "84",
    title: "Family Game Day",
    start: new Date("2025-03-30T14:00:00"),
    end: new Date("2025-03-30T17:00:00"),
    description: "Board games with family",
    categoryId: "5",
    location: "Sister's House"
  },
  {
    id: "85",
    title: "Month-End Reports",
    start: new Date("2025-03-31T09:00:00"),
    end: new Date("2025-03-31T12:00:00"),
    description: "Prepare monthly reports",
    categoryId: "1",
    location: "Office"
  },
  {
    id: "86",
    title: "Haircut Appointment",
    start: new Date("2025-03-31T16:30:00"),
    end: new Date("2025-03-31T17:30:00"),
    description: "Regular haircut",
    categoryId: "2",
    location: "Style Studio"
  },
  {
    id: "87",
    title: "Spring Tech Conference",
    start: new Date("2025-03-03T12:00:00"),
    end: new Date("2025-03-05T12:00:00"),
    allDay: true,
    description: "Annual technology conference with workshops and networking",
    categoryId: "1",
    location: "Convention Center"
  },
  {
    id: "88",
    title: "Family Reunion",
    start: new Date("2025-03-08T12:00:00"),
    end: new Date("2025-03-10T12:00:00"),
    allDay: true,
    description: "Annual family gathering with relatives from across the country",
    categoryId: "5",
    location: "Grandparents' Farm"
  },
  {
    id: "89",
    title: "Home Renovation",
    start: new Date("2025-03-12T12:00:00"),
    end: new Date("2025-03-15T12:00:00"),
    allDay: true,
    description: "Kitchen remodeling project",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "90",
    title: "Charity Fundraiser",
    start: new Date("2025-03-17T12:00:00"),
    end: new Date("2025-03-17T12:00:00"),
    allDay: true,
    description: "Annual fundraising event for local children's hospital",
    categoryId: "3",
    location: "City Park"
  },
  {
    id: "91",
    title: "Wellness Retreat",
    start: new Date("2025-03-21T12:00:00"),
    end: new Date("2025-03-23T12:00:00"),
    allDay: true,
    description: "Weekend meditation and yoga retreat",
    categoryId: "4",
    location: "Mountain View Resort"
  },
  {
    id: "92",
    title: "Product Launch",
    start: new Date("2025-03-25T12:00:00"),
    end: new Date("2025-03-25T12:00:00"),
    allDay: true,
    description: "New product line launch event",
    categoryId: "1",
    location: "Company Headquarters"
  },
  {
    id: "93",
    title: "School Holiday",
    start: new Date("2025-03-27T12:00:00"),
    end: new Date("2025-03-27T12:00:00"),
    allDay: true,
    description: "Kids' day off from school",
    categoryId: "5",
    location: "Home"
  },
  {
    id: "94",
    title: "Industry Trade Show",
    start: new Date("2025-03-18T12:00:00"),
    end: new Date("2025-03-20T12:00:00"),
    allDay: true,
    description: "Networking and showcasing at annual industry event",
    categoryId: "1",
    location: "Expo Center"
  },
  {
    id: "95",
    title: "Home Maintenance Day",
    start: new Date("2025-03-22T12:00:00"),
    end: new Date("2025-03-22T12:00:00"),
    allDay: true,
    description: "Seasonal home maintenance tasks",
    categoryId: "2",
    location: "Home"
  },
  {
    id: "96",
    title: "Volunteer Work",
    start: new Date("2025-03-29T12:00:00"),
    end: new Date("2025-03-29T12:00:00"),
    allDay: true,
    description: "Community garden planting day",
    categoryId: "3",
    location: "Community Garden"
  },
  {
    id: "97",
    title: "Medical Check-up",
    start: new Date("2025-03-14T12:00:00"),
    end: new Date("2025-03-14T12:00:00"),
    allDay: true,
    description: "Annual physical examination",
    categoryId: "4",
    location: "Medical Center"
  },
  {
    id: "98",
    title: "Spring Break",
    start: new Date("2025-03-24T12:00:00"),
    end: new Date("2025-03-28T12:00:00"),
    allDay: true,
    description: "Kids' spring break from school",
    categoryId: "5",
    location: "Various"
  },
  {
    id: "99",
    title: "Business Strategy Planning",
    start: new Date("2025-03-06T12:00:00"),
    end: new Date("2025-03-07T12:00:00"),
    allDay: true,
    description: "Quarterly strategy planning sessions",
    categoryId: "1",
    location: "Corporate Retreat Center"
  },
  {
    id: "100",
    title: "House Hunting Weekend",
    start: new Date("2025-03-15T12:00:00"),
    end: new Date("2025-03-16T12:00:00"),
    allDay: true,
    description: "Viewing potential new homes with realtor",
    categoryId: "2",
    location: "Various Neighborhoods"
  },
  {
    id: "101",
    title: "Music Festival",
    start: new Date("2025-03-06T12:00:00"),
    end: new Date("2025-03-10T12:00:00"),
    allDay: true,
    description: "Annual spring music festival featuring local and national acts",
    categoryId: "3",
    location: "Riverside Park"
  }
]