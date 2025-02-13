export const getPriceFF = async () => {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: apiData,
    });
    data = await res.json();

    if (data.status) {
      const filteredData = data.data.filter(
        (items) => items.games == "Free Fire B" && items.id === kodeProduk
      );
      const price = filteredData[0].price.gold;
      console.log(price);
      return parseInt(price);
    }
  } catch (err) {
    console.error(`Get price FF error: ${err}`);
  }
};
