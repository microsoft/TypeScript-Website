//// { compiler: { ts: "4.0.0-beta" } }
//

// No 4.0 nós usamos um fluxo de anlise para
// interfir o potencial tipo de uma uma classe
// proprietaria base nos quais valores são configurados
// durante sua construção

class UserAccount {
  id; // O tipo é inferido como string | número
  constructor(isAdmin: boolean) {
    if (isAdmin) {
      this.id = "admin";
    } else {
      this.id = 0;
    }
  }
}

// Nas versões anteriores do TypeScript, `id`
// poderia ser classificado como `any` (qualquer)
