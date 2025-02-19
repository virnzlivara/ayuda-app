 
export async function fetchWithTimeout<T>(
    url: string,
    options: RequestInit = {},
    timeout: number = 10000
  ): Promise<{ data?: T; error?: string }> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,  
      });
  
      clearTimeout(id);  
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = (await response.json()) as T;
      return { data };  
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { error:  'Request timed out'};  
      }
  
      return { error: (error as Error).message }; 
    }
  }