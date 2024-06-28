import { defineConfig, presetIcons, presetTypography, transformerCompileClass } from "unocss";

export default defineConfig({
    content: {
        pipeline: {
            include: ["./**/*.{vue,ts}"],
        },
    },
    presets: [
        presetTypography(),
        presetIcons({
            extraProperties: {
                height: "1.2rem",
                width: "1.2rem",
            },
        }),
    ],
    transformers: [transformerCompileClass()],
});
