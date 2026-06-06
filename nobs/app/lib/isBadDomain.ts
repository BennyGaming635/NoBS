import { BAD_DOMAINS } from "./badDomains";

export function isBadDomain(url: string): boolean {
    try {
        const hostname = new URL(url).hostname
            .replace(/^www\./, "")
            .toLowerCase();
        
        return BAD_DOMAINS.some(
            (domain) =>
                hostname === domain ||
                hostname.endsWith("." + domain)
        );
    } catch {
        return false; // If the URL is invalid, we consider it not a bad domain (validation will catch it later)
    }
}