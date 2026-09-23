import { sendSuccess } from '../../utils/apiResponse.js';
import { createProduct, deactivateProduct, getProduct, listProducts, updateProduct } from './product.service.js';

export async function getProducts(request, response) { return sendSuccess(response, await listProducts(request.query), 'Productos obtenidos correctamente'); }
export async function getProductById(request, response) { return sendSuccess(response, await getProduct(request.params.id, request.query.companyId), 'Producto obtenido correctamente'); }
export async function postProduct(request, response) { return sendSuccess(response, await createProduct(request.body, request.auth.userId), 'Producto creado correctamente', 201); }
export async function putProduct(request, response) { return sendSuccess(response, await updateProduct(request.params.id, request.query.companyId, request.body), 'Producto actualizado correctamente'); }
export async function deleteProduct(request, response) { return sendSuccess(response, await deactivateProduct(request.params.id, request.query.companyId), 'Producto desactivado correctamente'); }
