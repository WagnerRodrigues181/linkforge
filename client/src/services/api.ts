const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Link {
  id: string;
  slug: string;
  targetUrl: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
}

export async function createLink(targetUrl: string): Promise<Link> {
  const response = await fetch(`${API_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUrl }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
}
