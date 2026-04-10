function validateAnswer(validationType, value) {
  if (!value) {
    return { isValid: validationType === 'optional' || validationType === 'aadhaar_optional', message: 'This field is required.' };
  }

  // Helper strings
  const strValue = String(value).trim();

  switch (validationType) {
    case 'aadhaar':
    case 'aadhaar_optional':
      if (validationType === 'aadhaar_optional' && !strValue) return { isValid: true };
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(strValue)) {
        return { isValid: false, message: 'Aadhaar must be exactly 12 digits.' };
      }
      break;

    case 'mobile':
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(strValue)) {
        return { isValid: false, message: 'Mobile number must be exactly 10 digits.' };
      }
      break;

    case 'name_required':
      // Check if it's only alphabetical characters and spaces (for simplicity)
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(strValue)) {
        return { isValid: false, message: 'Name must contain only alphabets and spaces.' };
      }
      break;

    case 'pincode':
      const pinRegex = /^\d{6}$/;
      if (!pinRegex.test(strValue)) {
        return { isValid: false, message: 'PIN Code must be exactly 6 digits.' };
      }
      break;

    case 'required':
      if (strValue.length === 0) {
        return { isValid: false, message: 'This field cannot be empty.' };
      }
      break;

    case 'optional':
      break;

    default:
      break;
  }

  return { isValid: true, message: 'Valid' };
}

function processAnswer(validationType, value) {
  let processed = String(value).trim();
  if (validationType === 'name_required') {
    processed = processed.toUpperCase(); // Name must be uppercase block letters
  }
  return processed;
}

module.exports = {
  validateAnswer,
  processAnswer
};
