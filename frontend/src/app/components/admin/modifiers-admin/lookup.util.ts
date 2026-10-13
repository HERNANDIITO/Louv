export const GlobalLookup = {
  names: new Map<string, string>(),

  // Función para llenar el mapa desde cualquier componente
  update(data: any[]) {
    data.forEach(item => {
      if (item.id && item.name) {
        this.names.set(item.id, item.name);
      }
    });
  },

  // Función para obtener el nombre
  getName(id: string): string | null {
    return this.names.get(id) || null;
  }
};