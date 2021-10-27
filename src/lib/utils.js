export default {
  /**
   * In Vue 3's virtual DOM, event listeners are now just attributes, prefixed with on, and as such are part of the $attrs object,
   * so $listeners has been removed.
   *
   * @param {object} attrs
   * @returns
   */
  extractListenersFromAttrs: attrs => {
    const onRE = /^on[^a-z]/;
    const listeners = {};

    for (const property in attrs) {
      if (onRE.test(property)) {
        listeners[property] = attrs[property];
      }
    }

    return listeners;
  }
};
