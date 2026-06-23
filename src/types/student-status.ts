export type StudentStatus = {
  id: string;
  part: string;
  reaction: string;
  action: string;
};

export function getUniqueParts(statuses: StudentStatus[]): string[] {
  const parts = new Set<string>();

  for (const status of statuses) {
    if (status.part) {
      parts.add(status.part);
    }
  }

  return [...parts];
}
