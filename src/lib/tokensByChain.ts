
const tokensByChain = (tokenList: TokenList, chainId: number): Token[] => {
    return tokenList.tokens.filter(token => token.chainId === chainId);
}

export default tokensByChain;