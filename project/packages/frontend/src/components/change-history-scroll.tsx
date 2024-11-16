import { useQuery } from "@tanstack/react-query";
import { getEventChangeHistory } from "@/api/queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChangeHistoryProps {
  eventId: number;
}

export function ChangeHistoryScroll({ eventId }: ChangeHistoryProps) {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ["eventHistory", eventId],
    queryFn: () => getEventChangeHistory(eventId),
  });

  if (isLoading) return <p className="p-4">Loading change history...</p>;
  if (error)
    return (
      <p className="p-4">Error fetching change history: {String(error)}</p>
    );

  if (!history || history.length === 0) {
    return <p className="p-4">No changes have been made to this event.</p>;
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id}>
          <p>
            <strong>Action:</strong> {entry.action}
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(entry.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>User:</strong> {entry.user?.username || "Deleted User"}
          </p>
          {entry.changes && (
            <>
              <strong>Changes:</strong>
              <ul className="list-disc pl-6">
                {Object.entries(entry.changes).map(([key, change]) => (
                  <li key={key}>
                    <strong>{key}:</strong> from{" "}
                    <span className="text-red-500">{String(change.old)}</span>{" "}
                    to{" "}
                    <span className="text-green-500">{String(change.new)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Separator className="my-2" />
        </div>
      ))}
    </div>
  );
}
