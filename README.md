# Kreator oferty PDF

Prosta aplikacja webowa do przygotowania oferty i zapisania jej do PDF.

## Jak uruchomić

1. Wejdź do folderu projektu:
   ```bash
   cd /workspace/paba-sukces.github.io
   ```
2. Uruchom lokalny serwer:
   ```bash
   python3 -m http.server 8000
   ```
3. Otwórz w przeglądarce:
   - http://localhost:8000
   - lub http://127.0.0.1:8000

## Użycie

1. Wpisz temat i treść oferty.
2. (Opcjonalnie) Dodaj odbiorcę i obrazek.
3. Kliknij **Generuj PDF**.
4. Kliknij **Pobierz PDF** i dołącz plik do maila.

## Uwaga o plikach binarnych

Repozytorium zawiera teraz wyłącznie pliki tekstowe aplikacji (`HTML`, `CSS`, `JS`, `README`),
aby uniknąć problemów typu „pliki binarne nie są obsługiwane” podczas podglądu zmian.
