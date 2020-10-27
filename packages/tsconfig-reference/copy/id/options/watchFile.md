---
display: "watchFile"
oneline: "Teknik apa yang harus digunakan oleh pengamat"
---

Strategi bagaimana setiap berkas diamati.

- `fixedPollingInterval`: Memeriksa setiap berkas apakah terjadi perubahan pada interval waktu tertentu.
- `priorityPollingInterval`: Memeriksa setiap berkas apakah terjadi perubahan, tetapi menggunakan metode heuristik untuk memeriksa tipe berkas tertentu yang jarang berubah daripada yang lain.
- `dynamicPriorityPolling`: Menggunakan antrian dinamis dimana berkas yang jarang diubah akan jarang diperiksa.
- `useFsEvents` (the default): Berusaha menggunakan even asli sistem operasi/berkas sistem untuk memeriksa perubahan berkas.
- `useFsEventsOnParentDirectory`: Berusaha menggunakan event asli sistem operasi/berkas sistem untuk memeriksa perubahan berkas pada direktori _parent_ dari berkas tersebut.
