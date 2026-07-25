export default {
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        floatSlow: {
          "0%,100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },

      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
    },
  },
};
