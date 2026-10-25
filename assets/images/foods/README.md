# Fotos de alimentos

Pon aquí las fotos de los alimentos. La app las carga automáticamente si el nombre del archivo
coincide exactamente con el `id` del alimento. Si no hay foto, se muestra el emoji de fondo.

## Formato

- **Tamaño:** 400 × 400 px (cuadrada 1:1) — se recorta automáticamente
- **Formato:** `.jpg` o `.png` (preferiblemente `.jpg` para menor peso)
- **Peso máximo:** 100 KB por foto
- **Nombre:** exactamente el id del alimento, en minúsculas, con extensión `.jpg`

## Cómo activar una foto nueva

Después de añadir el archivo, descomenta su línea en `app/(tabs)/diet.tsx`
dentro del objeto `imageMap` de la función `getLocalFoodImage()`.

---

## 🥩 PROTEÍNAS — 15 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `prot_01.jpg` | Pechuga de pollo (cocida) | 165 kcal · P31g · C0g · G3.6g | "cooked chicken breast" |
| `prot_02.jpg` | Pechuga de pavo (cocida) | 135 kcal · P30g · C0g · G1g | "turkey breast sliced" |
| `prot_03.jpg` | Ternera magra (filete) | 158 kcal · P26g · C0g · G5.5g | "lean beef steak" |
| `prot_04.jpg` | Salmón (filete) | 208 kcal · P20g · C0g · G13g | "salmon fillet" |
| `prot_05.jpg` | Atún al natural (lata) | 116 kcal · P26g · C0g · G1g | "canned tuna natural" |
| `prot_06.jpg` | Merluza (filete) | 86 kcal · P17g · C0g · G1.6g | "hake fish fillet" |
| `prot_07.jpg` | Huevo entero | 155 kcal · P13g · C1g · G11g | "whole eggs raw" |
| `prot_08.jpg` | Clara de huevo | 52 kcal · P11g · C0.7g · G0.2g | "egg whites bowl" |
| `prot_09.jpg` | Proteína Whey (polvo) | 400 kcal · P80g · C10g · G5g | "whey protein powder scoop" |
| `prot_10.jpg` | Bacalao (filete) | 82 kcal · P18g · C0g · G0.7g | "cod fish fillet" |
| `prot_11.jpg` | Sardinas en aceite | 208 kcal · P25g · C0g · G11g | "canned sardines" |
| `prot_12.jpg` | Gambas (cocidas) | 99 kcal · P24g · C0g · G1g | "cooked shrimp prawns" |
| `prot_13.jpg` | Lomo de cerdo | 143 kcal · P22g · C0g · G6g | "pork loin cooked" |
| `prot_14.jpg` | Jamón serrano | 241 kcal · P31g · C0g · G13g | "spanish serrano ham sliced" |
| `prot_15.jpg` | Ternera picada (magra) | 150 kcal · P22g · C0g · G6g | "lean ground beef raw" |

---

## 🌾 CARBOHIDRATOS — 15 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `carb_01.jpg` | Arroz blanco (cocido) | 130 kcal · P2.7g · C28g · G0.3g | "white rice cooked bowl" |
| `carb_02.jpg` | Arroz integral (cocido) | 111 kcal · P2.6g · C23g · G0.9g | "brown rice cooked bowl" |
| `carb_03.jpg` | Avena (cruda) | 389 kcal · P17g · C66g · G7g | "oats raw bowl" |
| `carb_04.jpg` | Pan integral (rebanada) | 247 kcal · P13g · C41g · G3.4g | "whole grain bread sliced" |
| `carb_05.jpg` | Pasta (cocida) | 131 kcal · P5g · C25g · G1.1g | "pasta cooked plate" |
| `carb_06.jpg` | Batata (cocida) | 86 kcal · P1.6g · C20g · G0.1g | "sweet potato cooked" |
| `carb_07.jpg` | Patata (cocida) | 77 kcal · P2g · C17g · G0.1g | "boiled potato white" |
| `carb_08.jpg` | Quinoa (cocida) | 120 kcal · P4.4g · C21g · G1.9g | "quinoa cooked bowl" |
| `carb_09.jpg` | Tortitas de arroz | 387 kcal · P7g · C81g · G3g | "rice cakes plain" |
| `carb_10.jpg` | Cuscús (cocido) | 112 kcal · P3.8g · C23g · G0.2g | "couscous cooked bowl" |
| `carb_11.jpg` | Trigo sarraceno (cocido) | 92 kcal · P3.4g · C20g · G0.6g | "buckwheat cooked" |
| `carb_12.jpg` | Maíz (cocido) | 96 kcal · P3.4g · C21g · G1.5g | "corn on cob cooked" |
| `carb_13.jpg` | Pan de centeno | 259 kcal · P8.5g · C48g · G3.3g | "rye bread dark loaf" |
| `carb_14.jpg` | Corn flakes (cereal) | 357 kcal · P6g · C84g · G0.4g | "corn flakes cereal bowl" |
| `carb_15.jpg` | Pasta integral (cocida) | 124 kcal · P5g · C25g · G1g | "whole wheat pasta cooked" |

---

## 🥦 VERDURAS — 15 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `verd_01.jpg` | Brócoli (cocido) | 35 kcal · P2.4g · C7g · G0.4g | "broccoli steamed" |
| `verd_02.jpg` | Espinacas (crudas) | 23 kcal · P2.9g · C3.6g · G0.4g | "fresh spinach leaves" |
| `verd_03.jpg` | Lechuga (cruda) | 15 kcal · P1.4g · C2.9g · G0.2g | "iceberg lettuce leaves" |
| `verd_04.jpg` | Tomate (crudo) | 18 kcal · P0.9g · C3.9g · G0.2g | "fresh tomato red" |
| `verd_05.jpg` | Pepino (crudo) | 16 kcal · P0.7g · C3.6g · G0.1g | "cucumber sliced fresh" |
| `verd_06.jpg` | Zanahoria (cruda) | 41 kcal · P0.9g · C10g · G0.2g | "fresh carrots orange" |
| `verd_07.jpg` | Pimiento rojo (crudo) | 31 kcal · P1g · C6g · G0.3g | "red bell pepper fresh" |
| `verd_08.jpg` | Calabacín (cocido) | 17 kcal · P1.2g · C3.5g · G0.2g | "zucchini cooked sliced" |
| `verd_09.jpg` | Coliflor (cocida) | 23 kcal · P1.9g · C5g · G0.3g | "cauliflower steamed" |
| `verd_10.jpg` | Kale (cruda) | 49 kcal · P4.3g · C9g · G0.9g | "kale leaves fresh" |
| `verd_11.jpg` | Espárragos (cocidos) | 20 kcal · P2.2g · C3.9g · G0.1g | "asparagus steamed" |
| `verd_12.jpg` | Judías verdes (cocidas) | 35 kcal · P1.8g · C8g · G0.1g | "green beans cooked" |
| `verd_13.jpg` | Champiñones (crudos) | 22 kcal · P3.1g · C3.3g · G0.3g | "mushrooms fresh button" |
| `verd_14.jpg` | Berenjena (cocida) | 25 kcal · P0.8g · C6g · G0.2g | "eggplant cooked" |
| `verd_15.jpg` | Remolacha (cocida) | 44 kcal · P1.7g · C10g · G0.2g | "beetroot cooked sliced" |

---

## 🍓 FRUTAS — 10 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `frut_01.jpg` | Plátano (maduro) | 89 kcal · P1.1g · C23g · G0.3g | "banana fresh yellow" |
| `frut_02.jpg` | Manzana (con piel) | 52 kcal · P0.3g · C14g · G0.2g | "apple fresh red green" |
| `frut_03.jpg` | Naranja (pelada) | 47 kcal · P0.9g · C12g · G0.1g | "orange peeled segments" |
| `frut_04.jpg` | Fresas | 32 kcal · P0.7g · C8g · G0.3g | "fresh strawberries bowl" |
| `frut_05.jpg` | Arándanos | 57 kcal · P0.7g · C14g · G0.3g | "blueberries fresh bowl" |
| `frut_06.jpg` | Kiwi | 61 kcal · P1.1g · C15g · G0.5g | "kiwi sliced fresh" |
| `frut_07.jpg` | Mango | 60 kcal · P0.8g · C15g · G0.4g | "mango fresh sliced" |
| `frut_08.jpg` | Melocotón | 39 kcal · P0.9g · C10g · G0.25g | "peach fresh" |
| `frut_09.jpg` | Pera | 57 kcal · P0.4g · C15g · G0.1g | "pear fresh" |
| `frut_10.jpg` | Sandía | 30 kcal · P0.6g · C8g · G0.2g | "watermelon slice fresh" |

---

## 🥛 LÁCTEOS — 10 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `lact_01.jpg` | Yogur griego natural | 133 kcal · P9g · C5g · G9g | "greek yogurt white bowl" |
| `lact_02.jpg` | Queso cottage | 98 kcal · P11g · C3.4g · G4.3g | "cottage cheese bowl" |
| `lact_03.jpg` | Queso fresco | 71 kcal · P12g · C1g · G2g | "fresh white cheese" |
| `lact_04.jpg` | Leche desnatada | 35 kcal · P3.4g · C5g · G0.1g | "skim milk glass" |
| `lact_05.jpg` | Requesón | 62 kcal · P7g · C3g · G2g | "ricotta cheese bowl" |
| `lact_06.jpg` | Kéfir (desnatado) | 40 kcal · P3.5g · C4.7g · G0.9g | "kefir drink bottle glass" |
| `lact_07.jpg` | Leche entera | 61 kcal · P3.2g · C4.8g · G3.3g | "whole milk glass white" |
| `lact_08.jpg` | Yogur natural (desnatado) | 61 kcal · P5g · C7g · G1.6g | "plain yogurt bowl white" |
| `lact_09.jpg` | Mozzarella light | 185 kcal · P18g · C2.2g · G11g | "mozzarella cheese fresh" |
| `lact_10.jpg` | Queso cheddar | 403 kcal · P25g · C1.3g · G33g | "cheddar cheese sliced" |

---

## 🫘 LEGUMBRES — 11 fotos

| Archivo | Alimento | Macros (por 100 g cocido) | Búsqueda sugerida |
|---------|----------|---------------------------|-------------------|
| `legu_01.jpg` | Lentejas (cocidas) | 116 kcal · P9g · C20g · G0.4g | "cooked lentils bowl" |
| `legu_02.jpg` | Garbanzos (cocidos) | 164 kcal · P9g · C27g · G2.6g | "cooked chickpeas bowl" |
| `legu_03.jpg` | Alubias negras (cocidas) | 132 kcal · P9g · C24g · G0.5g | "black beans cooked bowl" |
| `legu_04.jpg` | Edamame (cocido) | 122 kcal · P11g · C9g · G5g | "edamame cooked green" |
| `legu_05.jpg` | Tofu firme | 76 kcal · P8g · C2g · G4.8g | "firm tofu block" |
| `legu_06.jpg` | Tempeh | 193 kcal · P19g · C9g · G11g | "tempeh sliced" |
| `legu_07.jpg` | Guisantes (cocidos) | 84 kcal · P5.4g · C15g · G0.4g | "green peas cooked bowl" |
| `legu_08.jpg` | Alubias blancas (cocidas) | 139 kcal · P9.7g · C25g · G0.5g | "white beans cooked bowl" |
| `legu_09.jpg` | Hummus | 177 kcal · P5g · C14g · G11g | "hummus bowl chickpea dip" |
| `legu_10.jpg` | Judías rojas (cocidas) | 127 kcal · P8.7g · C22g · G0.5g | "kidney beans cooked bowl" |
| `legu_11.jpg` | Proteína vegetal de guisante (polvo) | 360 kcal · P80g · C7g · G2g | "pea protein powder scoop" |

---

## 🥑 GRASAS SALUDABLES — 10 fotos

| Archivo | Alimento | Macros (por 100 g) | Búsqueda sugerida |
|---------|----------|--------------------|-------------------|
| `gras_01.jpg` | Aguacate | 160 kcal · P2g · C9g · G15g | "avocado sliced half" |
| `gras_02.jpg` | Almendras | 579 kcal · P21g · C22g · G50g | "almonds handful raw" |
| `gras_03.jpg` | Nueces | 654 kcal · P15g · C14g · G65g | "walnuts fresh halved" |
| `gras_04.jpg` | Anacardos | 553 kcal · P18g · C30g · G44g | "cashews raw handful" |
| `gras_05.jpg` | Aceite de oliva virgen extra | 884 kcal · P0g · C0g · G100g | "olive oil bottle pour" |
| `gras_06.jpg` | Mantequilla de cacahuete natural | 588 kcal · P25g · C20g · G50g | "peanut butter jar natural" |
| `gras_07.jpg` | Semillas de chía | 486 kcal · P17g · C42g · G31g | "chia seeds bowl dry" |
| `gras_08.jpg` | Semillas de calabaza | 559 kcal · P30g · C11g · G49g | "pumpkin seeds pepitas" |
| `gras_09.jpg` | Aceitunas (negras) | 115 kcal · P0.8g · C6g · G11g | "black olives bowl" |
| `gras_10.jpg` | Semillas de lino molidas | 534 kcal · P18g · C29g · G42g | "ground flaxseed bowl" |

---

## Fuentes gratuitas recomendadas

| Fuente | URL | Nota |
|--------|-----|------|
| **Unsplash** | https://unsplash.com | Mejor calidad, licencia libre |
| **Pexels** | https://www.pexels.com | Gran catálogo de alimentos |
| **Pixabay** | https://pixabay.com | Alternativa, muchas opciones |
| **Foodiesfeed** | https://www.foodiesfeed.com | Especializado en comida |

Busca con los términos de la columna "Búsqueda sugerida" en inglés para mejores resultados.

**Total: 101 fotos de alimentos**
