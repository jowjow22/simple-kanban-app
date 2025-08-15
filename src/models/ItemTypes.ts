export const ItemTypes = {
  task: "task",
} as const;

export type ItemTypes = typeof ItemTypes[keyof typeof ItemTypes];
