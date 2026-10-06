export function buildRecordPayload(moduleKey, form, companyId, editing = false) {
  const name = form.name.trim();
  if (!name) throw new Error('Ingresa un nombre.');
  if (moduleKey !== 'products') {
    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Ingresa un correo válido.');
    return { name, companyId, phone: form.phone.trim(), ...(email ? { email } : editing ? { email: null } : {}) };
  }
  const price = value => {
    if (!String(value).trim()) throw new Error('Ingresa ambos precios.');
    const number = Number(String(value).replace(',', '.'));
    if (!Number.isFinite(number) || number < 0) throw new Error('Los precios deben ser números positivos o cero.');
    return number;
  };
  if (!form.sku.trim() || !/^[a-f\d]{24}$/i.test(form.categoryId)) throw new Error('Ingresa SKU y selecciona una categoría.');
  if (!form.unit.trim()) throw new Error('Ingresa la unidad.');
  return { name, companyId, sku: form.sku.trim(), categoryId: form.categoryId, description: form.description, unit: form.unit.trim(), purchasePrice: price(form.purchasePrice), salePrice: price(form.salePrice) };
}
