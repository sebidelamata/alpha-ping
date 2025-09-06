import qs from "qs";

// this is the function that will fetch the token metadata from coinmarketcap
const fetchTokenMetadataCMC = async (tokenAddress:string) => {
    const params = {
        address: tokenAddress,
    }
    try {
        const response = await fetch(`/api/tokenMetadataCMC?${qs.stringify(params)}`)
        // make sure we have a valid response
        if (!response.ok) {
            throw new Error('Failed to fetch token metadata');
        }
        const json = await response.json();
        // the key or just an empyt object
        const key = Object.keys(json?.data ?? {})[0]
        return key ? json.data[key] : null;
    } catch (error) {
        console.warn('Error fetching token metadata for token', tokenAddress, ": ", error);
        return null;
    }
}

export default fetchTokenMetadataCMC;