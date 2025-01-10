export const validateFreeFireID = (id) => {
  const idRegex = /^[0-9]{6,12}$/; // ID berupa angka 6-12 digit
  return idRegex.test(id);
};
