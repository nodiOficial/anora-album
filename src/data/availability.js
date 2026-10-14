/** Product states → label, colors, and whether WhatsApp says "Quiero" or "Avísame" */
export const availability = {
  disponible: { label: 'Disponible', text: 'text-olivo', dot: 'bg-olivo', canOrder: true },
  'pocas-piezas': { label: 'Pocas piezas', text: 'text-terracota', dot: 'bg-terracota', canOrder: true },
  agotado: { label: 'Agotado', text: 'text-madera/70', dot: 'bg-madera/50', canOrder: false },
  proximamente: { label: 'Próximamente', text: 'text-[#8a5c1c]', dot: 'bg-oro', canOrder: false },
}
