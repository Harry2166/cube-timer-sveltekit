declare module 'https://cdn.cubing.net/v0/js/cubing/scramble' {
    export function randomScrambleForEvent(event: string): Promise<{ toString(): string }>;
}

declare module "https://cdn.cubing.net/v0/js/cubing/twisty" 