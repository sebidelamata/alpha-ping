
export async function GET() {
  
  try {
    const res = await fetch(
      `https://api.beefy.finance/vaults/`,
      {
        headers: {
        'Accepts': '*/*',
        },
      }
    );
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}