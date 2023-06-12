export function simplifyDictoryList(dictory, data) {
  let res = [dictory];
  data.forEach((item, index) => {
    if (item.path && item.path.finish) {
      let endIndex = data.findIndex(
        (k) => k.path && item.indexOf(k.path) !== 0
      );
      console.log(index, endIndex);
    } else {
      item.push(item);
    }
  });
  return res;
}
