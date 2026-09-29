# Kalkulator parametrów skrawania

Prosty kalkulator działający w przeglądarce, pomagający obliczać prędkość
skrawania, obroty wrzeciona i posuw dla toczenia, wiercenia oraz frezowania.
Interfejs jest dostępny po polsku i dostosowuje się do ekranów telefonów.

**Otwórz kalkulator:** [cpiotr97.github.io/VC_KALKULATOR](https://cpiotr97.github.io/VC_KALKULATOR/)

## Funkcje

- Obliczanie prędkości skrawania (`Vc`) z średnicy i obrotów.
- Obliczanie obrotów wrzeciona (`n`) z prędkości skrawania i średnicy.
- Obliczanie prędkości posuwu (`Vf`) oraz posuwu na ząb lub obrót.
- Tryby dla frezowania, toczenia i wiercenia.
- Jednostki metryczne i imperialne z przeliczeniem wprowadzonych wartości.
- Orientacyjne wartości `Vc` dla wybranych materiałów.

## Uruchomienie lokalne

To statyczna strona — nie wymaga instalowania zależności ani kompilacji.

## Struktura projektu

```text
.
├── index.html      # struktura strony
├── css/
│   └── styles.css  # wygląd i układ responsywny
├── js/
│   └── app.js      # logika kalkulatora
└── README.md       # opis projektu
```

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/CPiotr97/VC_KALKULATOR.git
   cd VC_KALKULATOR
   ```

2. Otwórz `index.html` w przeglądarce albo uruchom lokalny serwer:

   ```bash
   python3 -m http.server 8000
   ```

   Następnie przejdź do [http://localhost:8000](http://localhost:8000).

## Publikacja przez GitHub Pages

Repozytorium publikuje stronę z katalogu głównego gałęzi `main`. Po wysłaniu
zmian do tej gałęzi GitHub Pages automatycznie zaktualizuje witrynę. Ustawienia
publikacji można sprawdzić w **Settings → Pages**.
