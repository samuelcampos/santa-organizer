import pako from 'pako';

// Helper function to encode data to a URL-safe string
function toBase64(data: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(data)));
}

// Helper function to decode data from a URL-safe string
function fromBase64(str: string): Uint8Array {
    const binaryString = atob(str);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export function encodeData(data: any): string {
    const jsonString = JSON.stringify(data);
    const compressed = pako.gzip(jsonString);
    return toBase64(compressed);
}

export function decodeData<T>(encodedData: string): T {
    const compressed = fromBase64(encodedData);
    const jsonString = pako.ungzip(compressed, { to: 'string' });
    return JSON.parse(jsonString) as T;
}
