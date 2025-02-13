import toRupiah from "@develoka/angka-rupiah-js";

export const toIDR = (nominal) => {
  return toRupiah(nominal, { formal: false, floatingPoint: 0 });
};
