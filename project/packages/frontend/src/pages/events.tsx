import { Event, columns } from "@/components/event-columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom";

export default function Events() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state;

  const data = [
    {
      id: 1,
      name: "Event 1",
      location: "New York",
      date: "2023-01-01",
    },
    {
      id: 2,
      name: "Event 2",
      location: "Los Angeles",
      date: "2023-01-02",
    },
    {
      id: 3,
      name: "Event 3",
      location: "Chicago",
      date: "2023-01-03",
    },
  ] satisfies Event[]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold py-4">Events</h1>
        {username && <p>Welcome, {username}!</p>}
        <Button onClick={() => navigate('/create-event')}>
          Create Event
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
