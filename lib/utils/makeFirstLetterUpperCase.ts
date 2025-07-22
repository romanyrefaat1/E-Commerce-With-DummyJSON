export default function makeFirstLetterUpperCase(text: string | null | undefined) {
    if (typeof text !== "string" || text.length === 0) return "";
    
    return text.charAt(0).toUpperCase() + text.slice(1);
}