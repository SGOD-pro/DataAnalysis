// utils/fetcher.ts
export const fetcher = async <T>(url: string): Promise<T> => {
    console.log(url)
  const res = await fetch((process.env.NEXT_PUBLIC_SERVER||"")+url);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!res.ok) throw new Error("Network error");
  return res.json() as Promise<T>;
};