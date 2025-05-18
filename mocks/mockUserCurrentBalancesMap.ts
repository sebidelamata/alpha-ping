export const mockCurrentTokenBalances: Record<string, Record<string, Record<string, number>>> = {
  "1": {
    "0x8Eb270e296023E9D92081fdF967dDd7878724424": {
      "0x366bF4C8A1517E2eA6cB5085679742fF92F14B54": 1040347398004018200, // last balance seen in channel 1
    }
  },
  "2": {
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": {
      "0x366bF4C8A1517E2eA6cB5085679742fF92F14B54": 0, // All messages in channel 2 had zero token amounts
    }
  },
  "3": {
    " 0x912CE59144191C1204E64559FE8253a0e49E6548": {
      "0x366bF4C8A1517E2eA6cB5085679742fF92F14B54": 2031895911460791600, // seen multiple times in channel 3
    }
  }
}
