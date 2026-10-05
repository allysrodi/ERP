import { AppError } from '../../utils/appError.js';
const transitions = {
  DRAFT: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PAID'],
  PAID: [],
  CANCELLED: []
};
export function validateSaleTransition(current, next) {
  if (current === next) return;
  if (!transitions[current]?.includes(next)) {
    throw new AppError('Transicion de venta no permitida; una venta confirmada requiere un proceso de reversion para cancelarse', 409);
  }
}
