import layerEventsConfig from "../../lib/layerEvents";
import mixin from "./layerMixin";

export default {
  name: "GeojsonLayer",
  mixins: [mixin],

  computed: {
    getSourceFeatures() {
      return filter => {
        if (this.map.value) {
          return this.map.value.querySourceFeatures(this.sourceId, { filter });
        }
        return null;
      };
    },

    getRenderedFeatures() {
      return (geometry, filter) => {
        if (this.map.value) {
          return this.map.value.queryRenderedFeatures(geometry, {
            layers: [this.layerId],
            filter
          });
        }
        return null;
      };
    },

    getClusterExpansionZoom() {
      return clusterId => {
        return new Promise((resolve, reject) => {
          if (this.mapSource) {
            this.mapSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) {
                return reject(err);
              }
              return resolve(zoom);
            });
          } else {
            return reject(
              new Error(`Map source with id ${this.sourceId} not found.`)
            );
          }
        });
      };
    },

    getClusterChildren() {
      return clusterId => {
        return new Promise((resolve, reject) => {
          const source = this.mapSource;
          if (source) {
            source.getClusterChildren(clusterId, (err, features) => {
              if (err) {
                return reject(err);
              }
              return resolve(features);
            });
          } else {
            return reject(
              new Error(`Map source with id ${this.sourceId} not found.`)
            );
          }
        });
      };
    },

    getClusterLeaves() {
      return (...args) => {
        return new Promise((resolve, reject) => {
          if (this.mapSource) {
            this.mapSource.getClusterLeaves(...args, (err, features) => {
              if (err) {
                return reject(err);
              }
              return resolve(features);
            });
          } else {
            return reject(
              new Error(`Map source with id ${this.sourceId} not found.`)
            );
          }
        });
      };
    }
  },

  created() {
    if (this.source) {
      this.$watch(
        "source.data",
        function(next) {
          if (this.initial) return;
          this.mapSource.setData(next);
        },
        { deep: true }
      );
    }
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      // this.map = payload.map;
      this.map.value.on("dataloading", this.$_watchSourceLoading);
      if (this.source) {
        const source = {
          type: "geojson",
          ...this.source
        };
        try {
          this.map.value.addSource(this.sourceId, source);
        } catch (err) {
          if (this.replaceSource) {
            this.map.value.removeSource(this.sourceId);
            this.map.value.addSource(this.sourceId, source);
          }
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
      const layer = {
        id: this.layerId,
        source: this.sourceId,
        ...this.layer
      };
      this.map.value.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    },

    setFeatureState(featureId, state) {
      if (this.map.value) {
        const params = { id: featureId, source: this.source };
        return this.map.value.setFeatureState(params, state);
      }
    },

    getFeatureState(featureId) {
      if (this.map.value) {
        const params = { id: featureId, source: this.source };
        return this.map.value.getFeatureState(params);
      }
    },

    removeFeatureState(featureId, sourceLayer, key) {
      if (this.map.value) {
        const params = {
          id: featureId,
          source: this.source,
          sourceLayer
        };
        return this.map.value.removeFeatureState(params, key);
      }
    }
  }
};
