import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginClient } from "@kubb/swagger-client";
import { pluginTs } from "@kubb/swagger-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "./swagger.json",
  },
  output: {
    path: "./src/gen",
    clean: true,
  },
  plugins: [
    pluginOas({
      output: false,
      validate: true,
    }),
    pluginTs(),

    pluginClient({
      output: {
        path: "client",
      },
      group: {
        type: "tag",
        output: "./client/{{tag}}Service",
      },
      client: {
        importPath: "@/client",
      },
      dataReturnType: "full",
    }),
  ],

  hooks: {
    done: ["npx prettier --write ."],
  },
});
