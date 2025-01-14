export const validateFreeFireID = (id) => {
  const idRegex = /^[0-9]{6,12}$/;
  return idRegex.test(id);
};
