import pako from 'pako';

// Encodes a string to a URL-safe Base64 string.
function toBase64(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Decodes a URL-safe Base64 string back to a string.
function fromBase64(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(str),
          (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );
}


export function encodeData(data: any): string {
    const jsonString = JSON.stringify(data);
    const compressed = pako.gzip(jsonString, { to: 'string' });
    return toBase64(compressed as string);
}

export function decodeData<T>(encodedData: string): T {
    const compressedString = fromBase64(encodedData);
    const jsonString = pako.ungzip(compressedString, { to: 'string' });
    return JSON.parse(jsonString) as T;
}
