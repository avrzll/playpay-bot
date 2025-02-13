export const validateFreeFireID = (id) => {
  const idRegex = /^[0-9]{8,12}$/;
  return idRegex.test(id);
};

export const validateMobileLegendsID = (id, zone) => {
  const idRegex = /^[0-9]{6,14}$/;
  const zoneRegex = /^[0-9]{4,6}$/;
  return idRegex.test(id) && zoneRegex.test(zone);
};
