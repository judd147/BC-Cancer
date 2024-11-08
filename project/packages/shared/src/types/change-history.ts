import { User } from "./user";
import type { Event, CreateEventDto } from "./event";

export enum ActionType {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
}

export type PropertyChangeMap = {
  [K in keyof CreateEventDto]?: {
    previous: CreateEventDto[K];
    current: CreateEventDto[K];
  };
};

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
  action: ActionType;

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
