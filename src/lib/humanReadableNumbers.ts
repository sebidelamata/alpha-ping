const humanReadableNumbers = (num:string):string => {
  const parsed = Number(num);
  
  // validate
  if (isNaN(parsed)) {
    return 'Invalid number';
  }

  if (parsed >= 1e6) {
    return (parsed / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else {
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

export default humanReadableNumbers;