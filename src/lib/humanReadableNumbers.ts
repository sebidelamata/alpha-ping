const humanReadableNumbers = (num: string): string => {
  const parsed = Number(num);
  
  // validate
  if (isNaN(parsed)) {
    return 'Invalid number';
  }

  if (parsed >= 1e9) {
    return (parsed / 1e9).toFixed(2) + 'B';
  } else if (parsed >= 1e6) {
    return (parsed / 1e6).toFixed(2) + 'M';
  } else if (parsed >= 1e3) {
    return (parsed / 1e3).toFixed(2) + 'K';
  } else {
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

export default humanReadableNumbers;