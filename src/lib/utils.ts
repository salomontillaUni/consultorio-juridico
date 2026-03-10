export function cleanData(data: any) {
    const cleaned = { ...data };

    Object.keys(cleaned).forEach((key) => {
      // Si el valor es una cadena vacía, cámbialo por null
      if (cleaned[key] === '') {
        cleaned[key] = null;
      }
    });

    return cleaned;
  }