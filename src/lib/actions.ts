/**
 * Action to dispatch an event when a key is pressed.
 * @param node The node to which the action is applied.
 * @param {Array<any>} params - An array containing the enabled state, the handler function, and the keys to listen for.
 * @returns The action object with a destroy method.
 */
export function keyDown(node: Node, params: [boolean, (e: KeyboardEvent) => void, string[]]) {
  const [enabled, handler, keys] = params;
  const onKeyDown = (event: KeyboardEvent) => {
    if (enabled && keys.includes(event.key)) {
      handler(event);
    }
  };

  node.addEventListener("keydown", onKeyDown);

  return {
    destroy() {
      node.removeEventListener("keydown", onKeyDown);
    },
  };
}

/**
 * Action to trap focus within a node.
 * @param {HTMLElement} node - The node to trap focus within.
 * @returns The action object with a destroy method.
 */
export function focusTrap(node: HTMLElement) {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const firstFocusableElement = node.querySelectorAll(
    focusableElements,
  )[0] as HTMLElement;
  const focusableContent = node.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[
    focusableContent.length - 1
  ] as HTMLElement;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  node.addEventListener("keydown", onKeyDown);
  firstFocusableElement?.focus();

  return {
    destroy() {
      node.removeEventListener("keydown", onKeyDown);
    },
  };
}

/**
 * Action to dispatch an event when a click occurs outside of a node.
 * @param {Node} node - The node to which the action is applied.
 * @param {Array<any>} params - An array containing the handler function and an element to ignore.
 * @returns The action object with a destroy method.
 */
export function clickOutside(node: Node, params: [() => void, HTMLElement]) {
  const [handler, ignore] = params;

  function onClick(event: MouseEvent) {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !ignore?.contains(event.target as Node) &&
      !event.defaultPrevented
    ) {
      handler();
    }
  }

  document.addEventListener("click", onClick, true);

  return {
    destroy() {
      document.removeEventListener("click", onClick, true);
    },
  };
}
