// Helper function to format tax basis points to percentage
const formatTax = (taxBps: string) => {
    return (parseFloat(taxBps) / 100).toFixed(2);
}

export default formatTax;