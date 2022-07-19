export function classMates(classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(v => typeof v === "string").join(" ");
}