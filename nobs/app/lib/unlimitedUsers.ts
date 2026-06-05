const UNLIMITED_USERS = new Set([
  "aba56af3-7687-43f0-ac78-84c09c9e0baf",
]);

export function isUnlimitedUser(userId: string | null | undefined) {
  return UNLIMITED_USERS.has(String(userId ?? "").trim());
}