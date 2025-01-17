import { useChildren } from './drivers/useChildren';
import { useNode } from './drivers/useNode';
import { useProps } from './drivers/useProps';
import { Commit, DOMNode, DOMOperation, VEntity, VNode } from './types/base';

let deadline = 0;

/**
 * Diffs two VNodes
 */
export const diff = useNode([useChildren(), useProps()]);

/**
 * Patches two VNodes and modifies the DOM node based on the necessary changes
 */
export const patch = (
  el: DOMNode,
  newVNode?: VNode | VEntity,
  oldVNode?: VNode | VEntity,
  effects: DOMOperation[] = [],
  commit: Commit = (work: () => void) => work(),
): DOMNode => {
  const data = diff(el, newVNode, oldVNode, effects, commit);
  for (let i = 0; i < effects.length; i++) {
    effects[i]();
  }
  return data.el;
};

export const defer = Promise.resolve().then.bind(Promise.resolve());

/**
 * Split rendering work into chunks and spread it out over multiple frames
 */
export const schedule: Commit = (work: () => void): void => {
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>navigator)?.scheduling?.isInputPending({ includeContinuous: true }) ||
    performance.now() <= deadline
  ) {
    defer(work);
  } else work();
  // We can set a pseudo-deadline to ensure that we don't render too often
  // and depend on the calls to the function to regulate rendering
  deadline = performance.now() + 16;
};
