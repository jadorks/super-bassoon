/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter_reg: ["Inter-Regular", "sans-serif"],
        proxima_soft: ["Proxima-Soft", "sans-serif"],
        alien_solid: ["Alien-Encounters-Solid", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function({addUtilities, theme}){
      const dlcTypography = {
        ".alien-14": {
          fontFamily: theme("fontFamily.alien_solid"),
          fontSize: "14px"
        },
        ".alien-16": {
          fontFamily: theme("fontFamily.alien_solid"),
          fontSize: "16px"
        },
        ".alien-19": {
          fontFamily: theme("fontFamily.alien_solid"),
          fontSize: "19px"
        },
        ".alien-22": {
          fontFamily: theme("fontFamily.alien_solid"),
          fontSize: "22px"
        },
        ".alien-30": {
          fontFamily: theme("fontFamily.alien_solid"),
          fontSize: "30px"
        },
        ".inter-reg-11":{
          fontFamily: theme("fontFamily.inter_reg"),
          fontSize: "11px",
        },
        ".inter-reg-14":{
          fontFamily: theme("fontFamily.inter_reg"),
          fontSize: "14px",
        },
        ".proxima-reg-17":{
          fontFamily: theme("fontFamily.inter_reg"),
          fontSize: "17px",
        },
      };

      addUtilities(dlcTypography, ["responsive"])
    })
  ],
};
