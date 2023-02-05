import { BigNumber, utils } from "ethers";

export const genFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function onInputNumberChange(e, f) {
  const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  if (e.target.value === "" || re.test(e.target.value)) {
    f(e.target.value);
  }
}

export function compareNonTokenWithToken(tokenValue, nonTokenValue, decimals) {
    if (
      tokenValue == undefined ||
      tokenValue == "" ||
      nonTokenValue == undefined ||
      nonTokenValue == ""
    ) {
      return;
    }
  
    const convertedValue = utils.parseUnits(nonTokenValue, decimals);
  
    if (BigNumber.from(tokenValue).lt(convertedValue)) {
      return -1;
    } else if (BigNumber.from(tokenValue).gt(convertedValue)) {
      return 1;
    } else {
      return 0;
    }
  }

export function parseDecimals(num, decimals) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (decimals || -1) + "})?");
  return num.toString().match(re)[0];
}
