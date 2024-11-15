import { User } from "./user";
import type { UpdateEventDto } from "./event";
import { DonorStatus } from "./donor";

/**
 * Type representing the structure of changes for event properties.
 * Each key corresponds to a property from UpdateEventDto with its old and new values.
 */
type EventPropertyChangeMap = {
  [K in keyof UpdateEventDto]?: {
    old: UpdateEventDto[K];
    new: UpdateEventDto[K];
  };
};

/**
 * Type representing the structure of changes for donor statuses.
 * Each key corresponds to a DonorStatus with its old and new arrays of Donor IDs.
 */
type DonorStatusChangeMap = {
  [K in DonorStatus]?: {
    old: number[];
    new: number[];
  };
};

export type PropertyChangeMap = EventPropertyChangeMap & DonorStatusChangeMap;

/**
 * Represents a change history record for an event.
 * The response from "GET /events/:id/history" endpoint.
 */
export interface EventChangeHistory {
  /**
   * Unique identifier for the change history record.
   */
  id: number;

  /**
   * The user who made the change.
   * Null if user's account was deleted.
   */
  user: User | null;

  /**
   * The type of action performed.
   * Examples include 'created', 'updated', etc.
   */
  action: "created" | "updated" | "deleted";

  /**
   * The timestamp when the change was made.
   * e.g. "2024-11-08T08:42:10.000Z"
   */
  timestamp: Date | string;

  /**
   * A record of the changes made.
   * Each key represents a property that was changed, with its old and new values.
   * Null if the action is 'created' or 'deleted'.
   */
  changes: PropertyChangeMap | null;
}
