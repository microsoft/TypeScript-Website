---
display: "watchDirectory"
oneline: "Menentukan bagaimana direktori-direktori diperhatikan"
---

Strategi untuk bagaimana seluruh direktori diperhatikan dalam sistem yang tidak memiliki fungsi pengawasan berkas secara rekursif.

- `fixedPollingInterval`: Memeriksa setiap direktori untuk memantau perubahan beberapa kali dalam satu detik secara periodik pada interval yang telah ditentukan.
- `dynamicPriorityPolling`: Menggunakan sebuah _queue_ dinamis dimana direktori-direktori yang jarang mengalami modifikasi akan lebih jarang diperiksa.
- `useFsEvents` (the default): Mencoba menggunakan sistem operasi / kejadian asli dari sistem berkas untuk perubahan direktori.
