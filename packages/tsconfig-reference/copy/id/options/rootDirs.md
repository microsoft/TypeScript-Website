---
display: "Root Dirs"
oneline: "Mengatur banyak direktori root"
---

Dengan menggunakan `rootDirs`, Anda dapat memberi tahu kompilator bahwa ada banyak direktori "virtual" yang bertindak sebagai salah satu akar (root).
Hal ini memungkinkan kompilator untuk menyelesaikan impor pada modul relatif dalam direktori "virtual", seolah-olah digabungkan menjadi satu direktori.

Sebagai contoh:

```
 src
 └── views
     └── view1.ts (bisa impor "./template1", "./view2`)
     └── view2.ts (bisa impor "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (bisa impor "./view1", "./view2")
```

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

Ini tidak memengaruhi bagaimana Typescript menghasilkan Javascript, ini hanya mengemulasi asumsi bahwa mereka akan mampu melakukan perkerjaan melalui Jalur relatif tersebut saat runtime.
