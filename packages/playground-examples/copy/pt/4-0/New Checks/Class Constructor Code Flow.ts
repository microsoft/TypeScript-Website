//// { compiler: { ts: "4.0.0-beta" } }
//

// No 4.0 nós usamos um fluxo de análise para
// inferir o potencial tipo de propriedades de uma
// classe com base nos valores configurados
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
