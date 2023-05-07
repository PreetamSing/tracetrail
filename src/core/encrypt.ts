import pako from 'pako';


const defaultKey = 'pvkQ#Z$j!E27yBn'


function compressString(str: string): string {
    const compressed: any = pako.deflate(str, { level: 9 });
    return btoa(String.fromCharCode.apply(null, compressed));
}

function decompressString(str: string): string {
    const compressed: any = atob(str).split('').map(c => c.charCodeAt(0));
    const decompressed = pako.inflate(compressed, { to: 'string' });
    return decompressed;
}

function encryptString(str: string, key: string = defaultKey): string {
    const compressed = compressString(str);
    let encrypted = "";
    for (let i = 0; i < compressed.length; i++) {
        const charCode = compressed.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
    }
    return encrypted;
}

function decryptString(str: string, key: string = defaultKey): string {
    let decrypted = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
    }
    return decompressString(decrypted);
}

String.prototype.encrypt = encryptString
String.prototype.decrypt = decryptString
String.prototype.toJSON = (string) => JSON.parse(string)
