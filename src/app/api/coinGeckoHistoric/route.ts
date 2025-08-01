import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || ''
  searchParams.delete('id');
  console.log(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?${searchParams}`);
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?${searchParams}`,
      {
        headers: {
        'Accepts': 'application/json',
        "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COINGECKO_API_KEY as string
        },
      }
    )
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}