export const hashCode = async (code: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyCode = async (code: string, hash: string): Promise<boolean> => {
  const codeHash = await hashCode(code);
  return codeHash === hash;
};
