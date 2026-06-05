export function generateCode(length = 6) {
    const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}