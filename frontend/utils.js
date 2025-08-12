// =================== FUNCIONES UTILITARIAS ===================
// Este archivo contiene funciones reutilizables que apoyan tareas comunes


// Capitaliza la primera letra de una palabra y convierte el resto en minúscula
export const capitalizeEachWord = (str) => {
  return str
    .toLowerCase() // convert all to lowercase first
    .split(' ')    // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
    .join(' ');    // join back into a string
};

// Muestra una notificación tipo "toast" usando la librería Toastify
// Recibe el texto, el color de fondo y la duración (opcional) en milisegundos
export const notification = (text, color, duration = 3000) => {
  Toastify({
    text,
    duration,
    close: true,
    gravity: "top", // Posición superior
    position: "center", // Centrado horizontal
    stopOnFocus: true, // Detiene temporizador si el usuario pasa el mouse
    style: {
      borderRadius: "8px",
      padding: "15px",
      background: color,
    },
  }).showToast();
};
