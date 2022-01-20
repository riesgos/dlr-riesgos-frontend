# PIA

workflow eq-schäden und opfer

neue expositionsdaten santiago
4 damage classes
    slight moderate heavy destroyed
7 methods
    comuna, linear, grid-absolute, sub-grid-rel, ref (nur zwei veröffentlichen)
4 scenarios (intensities)
    50% in 50a
    30% in 50a
    10% in 50a
    10% 475a
    eingangsdaten: tiff dateien mit PGA, SA aus Openquake für eine gegebene Intensität <-- selbst ausgeführt, mit als Eingangsdaten: Eintrittswahrscheinlichkeit und Katalog
    = wiederkehr-raten P(I)
        Die dafür verwendeten Scenarien (PGA/location, Magnitude, Tiefe, ) liegen bei Chris vor
Umrechnung damage zu Verletzte und Tote (empirisch)


Langfristig soll PIA für ganz Chile ausgeweitet werden.



Man könnte die Shakyground-Outputs als Input für PIA verwenden.




## Aufwand
30 intensities
3 methods (comuna, linear, dasymetric)
3700 gridcells (Santiago)
Einmal lokal gemacht, kann auf Desktop geschehen



## Interface
in: intensity (pga, sa03, sa10) as Tiff  & method (comuna, linear, dasymetric)
out: damage (building-damage-class & casualties)


## Mapping
Chris' Vorschlag:
```python
for row in precalculatedDamage:
    for precalculatedDamageXY in row:
        intensity = pgaTiff(x, y)
        damage = precalculatedDamageXY[intensity]
```

### Mapping pga-tiff to exposure grid
- for each exposure grid cell, 
  - calculate centroid
  - take closest pixel from intensity-tiff

## Aufgaben
- Chris: legt Daten auf Kopierer ab
- Michael: verwendet Daten um neuen Prototyp von PIA aufzusetzen
- Von Michael an Chris & Patrick: min- und max-Intensitäten und resolution


## Timing
- Zunächst keine Deadline 
- Michael beginnt in 3 Wochen