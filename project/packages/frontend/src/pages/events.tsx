import { Payment, columns } from "@/components/event-columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

export default function Events() {
  const navigate = useNavigate();

  const data = [
    {
      id: "1",
      amount: 100,
      status: "pending",
      email: "test@gmail.com",
    },
    {
      id: "2",
      amount: 200,
      status: "processing",
      email: "test@gmail.com",
    },
    {
      id: "3",
      amount: 300,
      status: "success",
      email: "test@gmail.com",
    },
    {
      id: "4",
      amount: 400,
      status: "failed",
      email: "test@gmail.com",
    },
  ] as Payment[]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold py-4">Events</h1>
        <Button onClick={() => navigate('/create-event')}>
          Create Event
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
