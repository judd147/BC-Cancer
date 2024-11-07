import { User } from "./user";
import { Event } from "./event";

export enum ActionType {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
}

export interface EventChangeHistory {
  /**
   * Unique identifier for the change history record.
   */
  id: number;

  /**
   * The user who made the change.
   */
  user: User | null;

  /**
   * The type of action performed.
   * Examples include 'created', 'updated', etc.
   */
  action: ActionType;

  /**
   * The timestamp when the change was made.
   */
  timestamp: Date;

  /**
   * A record of the changes made.
   * Each key represents a property that was changed, with its old and new values.
   * This field is nullable, indicating that there might be no changes recorded.
   */
  changes: Record<string, { old: any; new: any }> | null;
}
