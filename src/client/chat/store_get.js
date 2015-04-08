import {curItems, curFocus, curPendingActions, curItemsOrder} from '../state';
import Immutable from 'immutable';

export function getOrderedItems() {
  const items = curItems();
  let order = new Map();
  curItemsOrder().forEach((el, index) => order.set(el, index));
  const orderedItems = items.sort((a,b) => {
    return order.get(a.get('id')) - order.get(b.get('id'));
  });
  return orderedItems;
}

export function getFocus() {
  return curFocus();
}

export function getPendingActions() {
  return curPendingActions();
}
