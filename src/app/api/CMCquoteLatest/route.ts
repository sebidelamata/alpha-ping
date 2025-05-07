import { console } from "inspector";
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

    console.log(
      "cmc quote latest api",
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${searchParams}`
    );

    console.log("price data", data);

    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}