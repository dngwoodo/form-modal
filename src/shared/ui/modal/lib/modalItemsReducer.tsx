import type { ModalItem } from '../type/types';

export type ModalAction =
  | { type: 'ADD_MODAL'; payload: ModalItem }
  | { type: 'REMOVE_MODAL'; payload: { id: string; result?: unknown } };

export function modalItemsReducer(
  state: ModalItem[],
  action: ModalAction,
): ModalItem[] {
  switch (action.type) {
    case 'ADD_MODAL':
      return [action.payload, ...state];

    case 'REMOVE_MODAL': {
      const { id, result } = action.payload;
      const modalToClose = state.find((modal) => modal.id === id);
      if (modalToClose?.resolve) {
        modalToClose.resolve(result);
      }
      return state.filter((modal) => modal.id !== id);
    }

    default:
      return state;
  }
}
