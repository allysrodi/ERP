import { sendSuccess } from '../../utils/apiResponse.js';
import { createCategory, deactivateCategory, getCategory, listCategories, updateCategory } from './category.service.js';

export async function getCategories(request, response) { return sendSuccess(response, await listCategories(request.query), 'Categorias obtenidas correctamente'); }
export async function getCategoryById(request, response) { return sendSuccess(response, await getCategory(request.params.id, request.query.companyId), 'Categoria obtenida correctamente'); }
export async function postCategory(request, response) { return sendSuccess(response, await createCategory(request.body, request.auth.userId), 'Categoria creada correctamente', 201); }
export async function putCategory(request, response) { return sendSuccess(response, await updateCategory(request.params.id, request.query.companyId, request.body), 'Categoria actualizada correctamente'); }
export async function deleteCategory(request, response) { return sendSuccess(response, await deactivateCategory(request.params.id, request.query.companyId), 'Categoria desactivada correctamente'); }
