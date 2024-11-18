import { useQuery } from "@tanstack/react-query";
import { getEventChangeHistory } from "@/api/queries";
import { Separator } from "@/components/ui/separator";
import { Clock, User, ArrowRightLeft } from "lucide-react";
import { Donor } from "@bc-cancer/shared/src/types/donor";
import { format, parseISO } from "date-fns";

// Helper function to find status changes considering three states
const findStatusChanges = (
  oldInvited: number[] = [],
  newInvited: number[] = [],
  oldExcluded: number[] = [],
  newExcluded: number[] = [],
) => {
  const changes = {
    newlyInvited: [] as number[],
    newlyExcluded: [] as number[],
    movedFromInvitedToExcluded: [] as number[],
    movedFromExcludedToInvited: [] as number[],
  };

  // Handle transitions from preview state to invited/excluded
  // Preview state is implied by not being in either invited or excluded
  newInvited.forEach((id) => {
    if (!oldInvited.includes(id) && !oldExcluded.includes(id)) {
      changes.newlyInvited.push(id);
    }
  });

  newExcluded.forEach((id) => {
    if (!oldExcluded.includes(id) && !oldInvited.includes(id)) {
      changes.newlyExcluded.push(id);
    }
  });

  oldInvited.forEach((id) => {
    if (newExcluded.includes(id)) {
      changes.movedFromInvitedToExcluded.push(id);
    }
  });

  oldExcluded.forEach((id) => {
    if (newInvited.includes(id)) {
      changes.movedFromExcludedToInvited.push(id);
    }
  });

  return changes;
};

interface ChangeHistoryProps {
  eventId: number;
  donors: Donor[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function ChangeHistoryScroll({ eventId, donors }: ChangeHistoryProps) {
  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
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

  const getDonorName = (donorId: number) => {
    const donor = donors.find((d) => d.id === donorId);
    return donor ? donor.firstName + " " + donor.lastName : String(donorId);
  };

  const formatUserList = (userIds: number[]) => {
    if (!userIds?.length) return "";
    return userIds.map(getDonorName).join(", ");
  };

  return (
    <div className="space-y-4">
      {history.map((entry) => {
        const statusChanges = entry.changes
          ? findStatusChanges(
              entry.changes.invited?.old,
              entry.changes.invited?.new,
              entry.changes.excluded?.old,
              entry.changes.excluded?.new,
            )
          : null;

        return (
          <div key={entry.id} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{formatDate(entry.timestamp.toString())}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 flex-shrink-0" />
              <span>{entry.user?.username || "Deleted User"}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">{entry.action}</span>
            </div>

            <div className="mt-4">
              {/* Display donor status changes */}
              {statusChanges && (
                <div className="space-y-2 mb-4">
                  {statusChanges.newlyInvited.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ArrowRightLeft className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="break-words">
                          <span className="font-medium">
                            Invited from preview:{" "}
                          </span>
                          {formatUserList(statusChanges.newlyInvited)}
                        </p>
                      </div>
                    </div>
                  )}

                  {statusChanges.newlyExcluded.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ArrowRightLeft className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="break-words">
                          <span className="font-medium">
                            Excluded from preview:{" "}
                          </span>
                          {formatUserList(statusChanges.newlyExcluded)}
                        </p>
                      </div>
                    </div>
                  )}

                  {statusChanges.movedFromInvitedToExcluded.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ArrowRightLeft className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="break-words">
                          <span className="font-medium">
                            Excluded from invited:{" "}
                          </span>
                          {formatUserList(
                            statusChanges.movedFromInvitedToExcluded,
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {statusChanges.movedFromExcludedToInvited.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ArrowRightLeft className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="break-words">
                          <span className="font-medium">
                            Invited from excluded:{" "}
                          </span>
                          {formatUserList(
                            statusChanges.movedFromExcludedToInvited,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Display other types of changes */}
              {entry.changes &&
                Object.entries(entry.changes).map(([key, change]) => {
                  // Skip donor changes as they're handled above
                  if (
                    key === "invited" ||
                    key === "excluded" ||
                    key === "preview"
                  )
                    return null;

                  let oldValue = String(change.old);
                  let newValue = String(change.new);

                  oldValue =
                    key === "date"
                      ? format(parseISO(oldValue), "PPP")
                      : oldValue;
                  newValue =
                    key === "date"
                      ? format(parseISO(newValue), "PPP")
                      : newValue;

                  return (
                    <div key={key} className="mt-2">
                      <span className="font-medium">{key}: </span>
                      <span className="text-red-500">{oldValue}</span>
                      {" → "}
                      <span className="text-green-500">{newValue}</span>
                    </div>
                  );
                })}
            </div>
            <Separator className="my-4" />
          </div>
        );
      })}
    </div>
  );
}
