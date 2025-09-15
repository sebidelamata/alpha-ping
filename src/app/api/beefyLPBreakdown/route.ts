
export async function GET() {
  
  try {
    console.log('Fetching Beefy LP Breakdown data from Beefy API...');
    const res = await fetch(
      `https://api.beefy.finance/lps/breakdown`,
      {
        headers: {
        'Accepts': '*/*',
        },
      }
    );
    console.log('Fetching Beefy LP Breakdown data from Beefy API...', res);
    const data = await res.json();
console.log('Beefy LP Breakdown data fetched:', await data);
    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}