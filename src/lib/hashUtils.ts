// Simulated SHA-256 hash generation for demo purposes

export async function generateHash(data: unknown): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  
  // Use Web Crypto API for real SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function truncateHash(hash: string, length: number = 16): string {
  if (hash.length <= length) return hash;
  return `${hash.slice(0, length / 2)}...${hash.slice(-length / 2)}`;
}

export function verifyHash(originalHash: string, currentHash: string): boolean {
  return originalHash === currentHash;
}
