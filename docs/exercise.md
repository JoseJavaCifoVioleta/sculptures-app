

Ten simple feature ideas t0 add to our basic React Gallery component to practice using useState and props:

1. **Add a Previous Button**  
Add a "Previous" button that decrements the index to go back to the previous sculpture. Make sure to handle edge cases (e.g., disable or wrap around).

2. **Disable Next Button on Last Item**  
Disable the "Next" button when the user reaches the last sculpture in the list, to practice conditional rendering and state handling.

3. **Show Thumbnail Navigation**  
Display small thumbnail images of all sculptures. Clicking a thumbnail sets the index to that sculpture’s position.

4. **Add Like Button**  
Add a "Like" button per sculpture that toggles a liked state. Show whether the sculpture is liked using conditional text or style.

5. **Display Sculpture Year**  
Pass in a year property via props and display the year the sculpture was made.

6. **Add a Caption Prop**  
Add a caption prop for the Gallery component and display it above the image; try both default and passed-in values.

7. **Cycle Index with Wrap Around**  
Modify the next button handler so that clicking “Next” on the last sculpture cycles back to the first sculpture instead of throwing an error.

8. **Change Background Color on Click**  
Add a button that changes the background color of the component using state.

9. **Add Animation Toggle**  
Add a checkbox that toggles a fade/slide animation effect on the sculpture image; track the animation state with useState.

10. **Show More/Less Description**  
Add a button that toggles between showing a truncated or full sculpture description to practice conditional rendering with useState.

---

## Implementación en `sculptures-app`

Las diez ideas están implementadas en
[`src/components/SculpturesGallery.jsx`](../src/components/SculpturesGallery.jsx), dentro de la
ruta `/gallery`. La página [`SculptureGalleryPage.jsx`](../src/pages/SculptureGalleryPage.jsx) le
pasa el catálogo compartido y un `caption`; el componente usa `"Sculptures Gallery"` si no recibe
ninguno.

| # | Idea | Implementación | Hecha |
|---|---|---|---|
| 1 | Previous | `goPrevious()`; deshabilitado en el primero salvo con Loop | ✅ |
| 2 | Next deshabilitado en el último | `disabled={!loop && isLast}` | ✅ |
| 3 | Miniaturas | Tira con una miniatura por escultura; al pulsar cambia el índice | ✅ |
| 4 | Like por escultura | `likes` indexado por `id`; Like/Unlike, `aria-pressed`, mensaje y corazón en la miniatura | ✅ |
| 5 | Año | Cada escultura llega por props con su `year` y se muestra como píldora | ✅ |
| 6 | `caption` | Valor por defecto `"Sculptures Gallery"`; la ruta pasa `"Highlights from the catalogue"` | ✅ |
| 7 | Wrap-around | El checkbox **Loop** hace que Next/Previous vuelvan al otro extremo | ✅ |
| 8 | Fondo | Botón que cicla Default → Sand → Sky → Mint → Lilac | ✅ |
| 9 | Animación | Checkbox que aplica `gallery-image--animated` y respeta `prefers-reduced-motion` | ✅ |
| 10 | Show more/less | Descripción truncada a 180 caracteres con botón para expandir o contraer | ✅ |

Las ideas 2 y 7 se contradicen: una pide desactivar el botón en el extremo y la otra pide dar la
vuelta. Se resolvieron con el control **Loop**: apagado se desactiva en los extremos; encendido se
hace wrap-around. La explicación completa está en
[`docs/bitacora/anexo-03-galeria.md`](bitacora/anexo-03-galeria.md).
