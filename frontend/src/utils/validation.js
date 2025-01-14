export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateNumber = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && (!min || num >= min) && (!max || num <= max);
};

export const validateDate = (date) => {
  return date && !isNaN(Date.parse(date));
};