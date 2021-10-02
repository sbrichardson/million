/**
 * @name createManyRows
 * @description creating 10,000 rows
 */

import benchmark from '../benchmark';
import { m, patch } from '../../src/index';
import { buildData } from '../data';

const suite = new benchmark.Suite('create many rows');

const hoistedVNode = m(
  'div',
  undefined,
  buildData(10000).map(({ id, label }) =>
    m('tr', undefined, [m('td', undefined, [String(id)]), m('td', undefined, [label])]),
  ),
);

suite
  .add('million', () => {
    const el = document.createElement('table');
    patch(el, hoistedVNode);
  })
  .add('vanilla', () => {
    const el = document.createElement('table');
    buildData(10000).forEach(({ id, label }) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.textContent = String(id);
      td2.textContent = label;
      tr.appendChild(td1);
      tr.appendChild(td2);
      el.appendChild(tr);
    });
  });

export default suite;
