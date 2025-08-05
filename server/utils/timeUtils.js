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

// const normalizeDateOnly = (dateInput) => {
//   if (!dateInput) return dateInput;
  
//   const date = new Date(dateInput);
//   // Create a new date with just the date part (no time) in UTC
//   const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//   return normalizedDate;
// };

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

module.exports = {
  extractTimeOnly,
  formatDate,
};