---
display: "Gerar Perfil de CPU"
oneline: "Emita um perfil de CPU v8 do compilador executado para depuração"

---
Essa opção dá a oportunidade para que o TypeScript emita um perfil de CPU v8 durante a depuração. O perfil de CPU pode oferecer informações sobre o porquê das suas compilações estarem lentas.

Essa opção só pode ser utilizada no CLI pelo comando: `--generateCpuProfile tsc-output.cpuprofile`.

```sh
npm run tsc --generateCpuProfile tsc-output.cpuprofile
```

Esse arquivo pode ser aberto em um navegador com base chromium, como o Chrome ou Microsoft Edge na seção [de perfil de CPU](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution). Para saber mais sobre o desempenho dos compiladores, pode visitar a [wiki do TypeScript sobre performance](https://github.com/microsoft/TypeScript/wiki/Performance).