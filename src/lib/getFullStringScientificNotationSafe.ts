// Helper function to convert scientific notation to string
const getFullStringScientificNotationSafe = (value: string | number): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') {
        // Convert to string without scientific notation
        return value.toLocaleString('fullwide', { useGrouping: false });
    }
    return String(value);
}

export default getFullStringScientificNotationSafe