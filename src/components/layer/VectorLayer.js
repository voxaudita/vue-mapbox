import layerEventsConfig from "../../lib/layerEvents";
import mixin from "./layerMixin";

export default {
  name: "VectorLayer",
  mixins: [mixin],

  computed: {
    getSourceFeatures() {
      return filter => {
        if (this.map) {
          return this.map.value.querySourceFeatures(this.sourceId, {
            sourceLayer: this.layer["source-layer"],
            filter
          });
        }
        return null;
      };
    },

    getRenderedFeatures() {
      return (geometry, filter) => {
        if (this.map) {
          return this.map.value.queryRenderedFeatures(geometry, {
            layers: [this.layerId],
            filter
          });
        }
        return null;
      };
    }
  },

  watch: {
    filter(filter) {
      if (this.initial) return;
      this.map.value.setFilter(this.layerId, filter);
    }
  },

  created() {
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      let source = {
        type: "vector",
        ...this.source
      };

      this.map.value.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.value.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.value.removeSource(this.sourceId);
          this.map.value.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEventsConfig);
      this.map.value.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.value.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.value.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: this.layerId,
        source: this.sourceId,
        ...this.layer
      };

      this.map.value.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    },

    setFeatureState(featureId, state) {
      if (this.map) {
        const params = {
          id: featureId,
          source: this.sourceId,
          "source-layer": this.layer["source-layer"]
        };
        return this.map.value.setFeatureState(params, state);
      }
    },

    getFeatureState(featureId) {
      if (this.map) {
        const params = {
          id: featureId,
          source: this.source,
          "source-layer": this.layer["source-layer"]
        };
        return this.map.value.getFeatureState(params);
      }
    }
  }
};
