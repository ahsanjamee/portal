import { Button, createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "#10B981",
        variant: "outline",
        radius: "xl",
        size: "sm",
        fz: "sm",
        bg: "white",
        fw: 700,
        style: {
          borderColor: "#E0E0E0",
        },
      },
    }),
  },
  fontFamily: "Plus Jakarta Sans, sans-serif",
});
