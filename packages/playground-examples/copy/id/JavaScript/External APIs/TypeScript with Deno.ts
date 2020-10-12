//// { order: 3 }

// Deno adalah sebuah _runtime_ JavaScript dan TypeScript
// yang masih dalam proses pengembangan dan dibangun
// di atas v8 dengan fokus pada keamanan.

// https://deno.land

// Deno memiliki sebuah sistem perizinan berbasis _sandbox_ yang
// membatasi kemampuan JavaScript untuk mengakses sistem berkas
// atau jaringan dan menggunakan impor berbasis http yang diunduh
// dan di_cache_ secara lokal.

// Berikut merupakan contoh penggunaan deno untuk _scripting_:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function sapa(nama: string) {
  return `Halo, ${nama}!`;
}

function perbesarSuara(x: string) {
  return x.toUpperCase();
}

const sapaDenganKeras = compose(perbesarSuara, sapa);

// Mengembalikan "HALO, DUNIA!"
sapaDenganKeras("dunia");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// Mengembalikan "halodunia"
concat("halo", "dunia");
