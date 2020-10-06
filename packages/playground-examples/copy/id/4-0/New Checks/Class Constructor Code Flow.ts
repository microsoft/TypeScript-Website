//// { compiler: { ts: "4.0.2" } }
//
// Pada TypeScript versi 4.0, kami menggunakan analisis
// alur program untuk menyimpulkan tipe dari sebuah atribut kelas
// berdasarkan nilai yang ditetapkan pada _constructor_.

class AkunPengguna {
  id; // Tipe disimpulkan sebagai sebuah _string_ atau bilangan
  constructor(admin: boolean) {
    if (admin) {
      this.id = "admin";
    } else {
      this.id = 0;
    }
  }
}

// Pada TypeScript versi-versi sebelumnya, `id` akan 
// disimpulkan sebagai sebuah `any`.
