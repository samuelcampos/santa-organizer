
import pako from 'pako';

// Encodes a string to a URL-safe Base64 string.
function toBase64(str: string): string {
    return btoa(str)
        .replace(/\+/g, '-') // Replace + with -
        .replace(/\//g, '_') // Replace / with _
        .replace(/=/g, ''); // Remove padding
}

// Decodes a URL-safe Base64 string back to a string.
function fromBase64(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/'); // Restore + and /
    while (str.length % 4) {
      str += '='; // Restore padding
    }
    return atob(str);
}


export function encodeData(data: any): string {
    const jsonString = JSON.stringify(data);
    const compressed = pako.gzip(jsonString);
    // Convert Uint8Array to a binary string
    const binaryString = String.fromCharCode.apply(null, compressed as unknown as number[]);
    return toBase64(binaryString);
}

export function decodeData<T>(encodedData: string): T {
    const binaryString = fromBase64(encodedData);
    const charData = binaryString.split('').map((x) => x.charCodeAt(0));
    const compressed = new Uint8Array(charData);
    const jsonString = pako.ungzip(compressed, { to: 'string' });
    return JSON.parse(jsonString) as T;
}
