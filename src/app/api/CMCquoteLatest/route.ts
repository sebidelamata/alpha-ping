import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${searchParams}`,
      {
        headers: {
        'Accepts': 'application/json',
        "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY as string
        },
      }
    );
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}