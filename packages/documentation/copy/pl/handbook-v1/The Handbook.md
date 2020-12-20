---
title: Przewodnik po TypeScript
layout: docs
permalink: /pl/docs/handbook/intro.html
oneline: Twoje pierwsze kroki w nauce TypeScript
---

## Kilka słów o Przewodniku

Prawie 20 lat po jego powstaniu, JavaScript jest dzisiaj jednym z najbardziej rozpowszechnionych języków programowania stworzonych do tej pory. Początkowo był niepozornym językiem skryptowym używanym na stronach internetowych do dodawania prostych elementów interaktywnych, jednak z biegiem czasu znacznie zwiększył swoje rozmiary i możliwości, będąc teraz często wybieranym we frontendzie i backendzie aplikacji każdego możliwego rozmiaru. Choć zarówno wielkość, zastosowanie i złożoność programów pisanych w JavaScript gwałtownie rośnie, zdolność tego języka do określenia związków pomiędzy poszczególnymi elementami kodu pozostała niezmienna. Dość osobliwa semantyka w połączeniu z tą właśnie różnicą pomiędzy złożonością języka i pisanych w nim programów stworzyły niekomfortową sytuację, gdzie tworzenie nowego oprogramowania stało się niezwykle trudne na większą skalę.

Błędy najczęściej popełniane przez programistów i programistki można określić jako błędy typów: pewna konkretna wartość została użyta tam, gdzie oczekiwany był inny rodzaj wartości. Głównymi powodami takich błędów są zazwyczaj proste literówki, nieznajomość interfejsu programistycznego (API) używanej zewnętrznej biblioteki lub też niepoprawny przewidywany wynik uruchamianego programu. TypeScript chce być statycznym kontrolerem typów dla programów napisanych w JavaScript - innymi słowy, narzędziem, które w statyczny sposób działa przed właściwym kodem, sprawdzając poprawność typów w programie.

Jeżeli stawiasz pierwsze kroki w TypeScript bez znajomości JavaScript lub innego języka programowania, zachęcamy przede wszystkim do lektury [przewodnika po JavaScript w dokumentacji Mozilli](https://developer.mozilla.org/docs/Web/JavaScript/Guide).
Jeżeli posiadasz już doświadczenie w innych językach programowania, składnia JavaScript powinna szybko stać się dla Ciebie zrozumiała po lekturze Przewodnika.

## Organizacja Przewodnika

Przewodnik po TypeScript podzielony jest na dwie sekcje:

- **Przewodnik**

  Przewodnik po TypeScript ma na celu bycie wszechstronnym źródłem wiedzy niezbędnym do tworzenia kodu codziennego użytku. Zalecaną kolejnością lektury są artykuły dostępne w nawigacji po lewej stronie, od góry do dołu.

  Każdy rozdział i strona powinny dostarczyć Ci obszernej wiedzy dotyczącej poszczególnego zagadnienia. Przewodnik po TypeScript nie jest jednak przy tym kompleksową specyfikacją języka, a raczej dogłębnym przewodnikiem po jego wszystkich funkcjonalnościach i cechach.

  Przeczytanie Przewodnika powinno nauczyć Cię:

  - jak czytać i rozumieć najczęściej używaną składnię TypeScript,
  - jak wyjaśnić efekty najważniejszych opcji kompilatora,
  - jak prawidłowo przewidywać zachowanie systemu w najczęściej spotykanych przypadkach,
  - jak stworzyć deklarację .d.ts dla prostej funkcji, obiektu lub klasy.

  Aby zachować maksymalną możliwą przejrzystość i zwięzłość, główna część Przewodnika nie skupia się na przypadkach brzegowych. Szczegóły dotyczące takich sytuacji znajdują się w materiałach źródłowych.

- **Materiały źródłowe**

  Sekcja materiałów źródłowych stworzona została po to, aby pokryć każdą funkcjonalność TypeScript kompleksowym wyjaśnieniem jej działania. Choć oczywiście artykuły te mogą być czytane jak głowna część Przewodnika - od góry do dołu - jednak ze względu na znacznie głębsze opracowanie każdego konceptu, materiały źródłowe nie są od siebie zależne.

### Pozostałe cele

Przewodnik został napisany w możliwie zwięzły sposób tak, aby jego lektura nie trwała dłużej niż kilka godzin. Z tego powodu niektóre tematy nie są poruszane dogłębnie.

Przede wszystkim, Przewodnik nie ma na celu wyjaśnienia podstawowych pojęć JavaScript, takich jak funkcje, klasy czy domknięcia. Gdziekolwiek jest to możliwe, podane są linki do materiałów zewnętrznych, zalecanych jako dodatkowa lektura w celach zapoznania się z tymi tematami.

Przewodnik ten nie jest też zastępstwem dla specyfikacji języka. W specjalnych przypadkach, artykuły pomijają opisy przypadków brzegowych czy też definicji poszczególnych zachowań systemu, aby zapewnić możliwie proste i przejrzyste wyjaśnienie tematu. Dogłębne definicje dostępne są jako osobne zasoby w materiałach źródłowych. Materiały te jednak nie są przewidziane jako źródło wiedzy dla początkujących, jako że użyte w nich zaawansowane słownictwo i tematy pokrewne mogą być dla Ciebie jeszcze nieznane.

O ile nie jest to niezbędne, Przewodnik nie wyjaśnia także jak TypeScript działa z innymi narzędziami. Konfiguracje połączenia TypeScript z webpack, rollup, parcel, react, babel, closure, lerna, rush, bazel, preact, vue, angular, svelte, jquery, yarn czy npm są poza zakresem Przewodnika - w takich przypadkach zalecamy wyszukanie odpowiednich zasobów w internecie.

## Jak zacząć?

Zanim rozpoczniesz lekturę o [Typach Podstawowych](/docs/handbook/basic-types.html) zalecamy zapoznanie się z jedną z poniższych stron wstępnych, które podkreślają kluczowe podobieństwa i różnice pomiędzy TypeScript a Twoim ulubionym językiem oraz wyjaśniają najpopularniejsze błędne wyobrażenia specyficzne dla tych języków.

- [TypeScript dla nowych programistów i programistek](/docs/handbook/typescript-from-scratch.html)
- [TypeScript dla programistów i programistek JavaScript](/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript dla programistów i programistek obiektowych](/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript dla programistów i programistek funkcyjnych](/docs/handbook/typescript-in-5-minutes-func.html)
