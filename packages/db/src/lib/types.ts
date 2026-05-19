export type EditableFields<T> = Partial<Record<keyof T, true | undefined>>
