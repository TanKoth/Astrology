const extractTimeOnly = (timeInput) => {
  if (!timeInput) return timeInput;
  
  // If it's already in HH:MM or HH:MM:SS format, return as is
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeInput)) {
    // If it has seconds, remove them
    return timeInput.split(':').slice(0, 2).join(':');
  }
  
  // If it's a full ISO date string, extract time
  if (typeof timeInput === 'string' && timeInput.includes('T')) {
    const date = new Date(timeInput);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // If it's a Date object
  if (timeInput instanceof Date) {
    const hours = String(timeInput.getHours()).padStart(2, '0');
    const minutes = String(timeInput.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return timeInput;
};

const formatDate = (dateInput) => {
   if (!dateInput) return null;
  
  // If already in YYYY-MM-DD format, return as is
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateInput;
  }
  
  const date = new Date(dateInput);
  // Use UTC to avoid timezone issues
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

module.exports = {
  extractTimeOnly,
  formatDate,
};