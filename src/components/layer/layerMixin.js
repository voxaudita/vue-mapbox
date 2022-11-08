// import withRegistration from "../../lib/withRegistration";
import withEvents from "../../lib/withEvents";
import utils from "../../lib/utils";

const mapboxSourceProps = {
  sourceId: {
    type: String,
    required: true
  },
  source: {
    type: [Object, String],
    default: undefined
  }
};

const mapboxLayerStyleProps = {
  layerId: {
    type: String,
    required: true
  },
  layer: {
    type: Object,
    required: true
  },
  before: {
    type: String,
    default: undefined
  }
};

const componentProps = {
  clearSource: {
    type: Boolean,
    default: true
  },
  replaceSource: {
    type: Boolean,
    default: false
  },
  replace: {
    type: Boolean,
    default: false
  }
};

export default {
  mixins: [withEvents],
  props: {
    ...mapboxSourceProps,
    ...mapboxLayerStyleProps,
    ...componentProps
  },

  inject: ["mapbox", "map"],

  data() {
    return {
      initial: true
    };
  },

  computed: {
    sourceLoaded() {
      return this.map ? this.map.value.isSourceLoaded(this.sourceId) : false;
    },
    mapLayer() {
      return this.map ? this.map.value.getLayer(this.layerId) : null;
    },
    mapSource() {
      return this.map ? this.map.value.getSource(this.sourceId) : null;
    }
  },

  created() {
    if (this.layer.minzoom) {
      this.$watch("layer.minzoom", function(next) {
        if (this.initial) return;
        this.map.value.setLayerZoomRange(
          this.layerId,
          next,
          this.layer.maxzoom
        );
      });
    }

    if (this.layer.maxzoom) {
      this.$watch("layer.maxzoom", function(next) {
        if (this.initial) return;
        this.map.value.setLayerZoomRange(
          this.layerId,
          this.layer.minzoom,
          next
        );
      });
    }

    if (this.layer.paint) {
      this.$watch(
        "layer.paint",
        function(next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              this.map.value.setPaintProperty(this.layerId, prop, next[prop]);
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.layout) {
      this.$watch(
        "layer.layout",
        function(next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              this.map.value.setLayoutProperty(this.layerId, prop, next[prop]);
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.filter) {
      this.$watch(
        "layer.filter",
        function(next) {
          if (this.initial) return;
          this.map.value.setFilter(this.layerId, next);
        },
        { deep: true }
      );
    }
  },

  beforeDestroy() {
    if (this.map && this.map.value.loaded()) {
      try {
        this.map.value.removeLayer(this.layerId);
      } catch (err) {
        this.$_emitEvent("layer-does-not-exist", {
          layerId: this.sourceId,
          error: err
        });
      }
      if (this.clearSource) {
        try {
          this.map.value.removeSource(this.sourceId);
        } catch (err) {
          this.$_emitEvent("source-does-not-exist", {
            sourceId: this.sourceId,
            error: err
          });
        }
      }
    }
  },

  methods: {
    $_emitLayerMapEvent(event) {
      return this.$_emitMapEvent(event, { layerId: this.layerId });
    },

    $_bindLayerEvents(eventsConfig) {
      const eventNames = Object.keys(eventsConfig);
      const listeners = utils.extractListenersFromAttrs(this.$attrs);
      Object.keys(listeners).forEach(listenerKey => {
        const eventName = listenerKey.substring(2).toLowerCase();
        if (eventNames.includes(eventName)) {
          this.map.value.on(eventName, this.layerId, this.$_emitLayerMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      if (this.map) {
        events.forEach(eventName => {
          this.map.value.off(eventName, this.layerId, this.$_emitLayerMapEvent);
        });
      }
    },

    $_watchSourceLoading(data) {
      if (data.dataType === "source" && data.sourceId === this.sourceId) {
        this.$_emitEvent("layer-source-loading", { sourceId: this.sourceId });
        this.map.value.off("dataloading", this.$_watchSourceLoading);
      }
    },

    move(beforeId) {
      this.map.value.moveLayer(this.layerId, beforeId);
      this.$_emitEvent("layer-moved", {
        layerId: this.layerId,
        beforeId: beforeId
      });
    },

    remove() {
      this.map.value.removeLayer(this.layerId);
      this.map.value.removeSource(this.sourceId);
      this.$_emitEvent("layer-removed", { layerId: this.layerId });
      this.$destroy();
    }
  },

  render() {}
};
