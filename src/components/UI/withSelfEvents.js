import utils from "../../lib/utils";

export default {
  methods: {
    $_emitSelfEvent(event, data = {}) {
      this.$_emitMapEvent(event, { control: this.control, ...data });
    },
    /** Bind events for markers, popups and controls.
     * MapboxGL JS emits this events on popup or marker object,
     * so we treat them as 'self' events of these objects
     */
    $_bindSelfEvents(eventNames, emitter) {
      const listeners = utils.extractListenersFromAttrs(this.$attrs);
      Object.keys(listeners).forEach(listenerKey => {
        const eventName = listenerKey.substring(2).toLowerCase();
        if (eventNames.includes(eventName)) {
          emitter.on(eventName, this.$_emitSelfEvent);
        }
      });
    },

    $_unbindSelfEvents(events, emitter) {
      if (events.length === 0) return;
      if (!emitter) return;
      events.forEach(eventName => {
        emitter.off(eventName, this.$_emitSelfEvent);
      });
    }
  }
};
