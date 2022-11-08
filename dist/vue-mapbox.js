import { computed, isRef, h } from "vue";
import promisify from "map-promisified";

var withEventsMixin = {
  methods: {
    /**
     * Emit Vue event with additional data
     *
     * @param {string} name EventName
     * @param {Object} [data={}] Additional data
     */
    $_emitEvent(name, data = {}) {
      this.$emit(name, {
        map: this.map,
        component: this,
        ...data
      });
    },

    /**
     * Emit Vue event with Mapbox event as additional data
     *
     * @param {Object} event
     */
    $_emitMapEvent(event, data = {}) {
      this.$_emitEvent(event.type, { mapboxEvent: event, ...data });
    }
  }
};

/* eslint-disable key-spacing */

var mapEvents = {
  onResize: { name: "resize", listener: "onResize" },
  onWebglcontextlost: {
    name: "webglcontextlost",
    listener: "onWebglcontextlost"
  },
  onWebglcontextrestored: {
    name: "webglcontextrestored",
    listener: "onWebglcontextrestored"
  },
  onRemove: { name: "remove", listener: "onRemove" },
  onMovestart: { name: "movestart", listener: "onMovestart" },
  onLoad: { name: "load", listener: "onLoad" },
  onContextmenu: { name: "contextmenu", listener: "onContextmenu" },
  onDblclick: { name: "dblclick", listener: "onDblclick" },
  onClick: { name: "click", listener: "onClick" },
  onTouchcancel: { name: "touchcancel", listener: "onTouchcancel" },
  onTouchmove: { name: "touchmove", listener: "onTouchmove" },
  onTouchend: { name: "touchend", listener: "onTouchend" },
  onTouchstart: { name: "touchstart", listener: "onTouchstart" },
  onDataloading: { name: "dataloading", listener: "onDataloading" },
  onMousemove: { name: "mousemove", listener: "onMousemove" },
  onMouseup: { name: "mouseup", listener: "onMouseup" },
  onMousedown: { name: "mousedown", listener: "onMousedown" },
  onSourcedataloading: {
    name: "sourcedataloading",
    listener: "onSourcedataloading"
  },
  onError: { name: "error", listener: "onError" },
  onData: { name: "data", listener: "onData" },
  onStyledata: { name: "styledata", listener: "onStyledata" },
  onSourcedata: { name: "sourcedata", listener: "onSourcedata" },
  onMouseout: { name: "mouseout", listener: "onMouseout" },
  onStyledataloading: {
    name: "styledataloading",
    listener: "onStyledataloading"
  },
  onMoveend: { name: "moveend", listener: "onMoveend" },
  onMove: { name: "move", listener: "onMove" },
  onRender: { name: "render", listener: "onRender" },
  onZoom: { name: "zoom", listener: "onZoom" },
  onZoomstart: { name: "zoomstart", listener: "onZoomstart" },
  onZoomend: { name: "zoomend", listener: "onZoomend" },
  onBoxzoomstart: { name: "boxzoomstart", listener: "onBoxzoomstart" },
  onBoxzoomcancel: { name: "boxzoomcancel", listener: "onBoxzoomcancel" },
  onBoxzoomend: { name: "boxzoomend", listener: "onBoxzoomend" },
  onRotate: { name: "rotate", listener: "onRotate" },
  onRotatestart: { name: "rotatestart", listener: "onRotatestart" },
  onRotateend: { name: "rotateend", listener: "onRotateend" },
  onDragend: { name: "dragend", listener: "onDragend" },
  onDrag: { name: "drag", listener: "onDrag" },
  onDragstart: { name: "dragstart", listener: "onDragstart" },
  onPitch: { name: "pitch", listener: "onPitch" },
  onIdle: { name: "idle", listener: "onIdle" }
};

var options = {
  container: {
    type: [String, HTMLElement],
    default() {
      return `map-${("" + Math.random()).split(".")[1]}`;
    }
  },
  accessToken: {
    type: String,
    default: undefined
  },
  minZoom: {
    type: Number,
    default: 0
  },
  maxZoom: {
    type: Number,
    default: 22
  },
  mapStyle: {
    type: [String, Object],
    required: true
  },
  hash: {
    type: [Boolean, String],
    default: false
  },
  interactive: {
    type: Boolean,
    default: true
  },
  bearingSnap: {
    type: Number,
    default: 7
  },
  pitchWithRotate: {
    type: Boolean,
    default: true
  },
  clickTolerance: {
    type: Number,
    default: 3
  },
  // classes: {
  //   type: Array,
  //   default() {
  //     return []
  //   }
  // },
  attributionControl: {
    type: Boolean,
    default: true
  },
  customAttribution: {
    type: [String, Array],
    default: null
  },
  logoPosition: {
    type: String,
    default: "bottom-left",
    validator: val =>
      ["top-left", "top-right", "bottom-left", "bottom-right"].includes(val)
  },
  failIfMajorPerformanceCaveat: {
    type: Boolean,
    default: false
  },
  preserveDrawingBuffer: {
    type: Boolean,
    default: false
  },
  refreshExpiredTiles: {
    type: Boolean,
    default: true
  },
  maxBounds: {
    type: Array,
    default() {
      return undefined;
    }
  },
  scrollZoom: {
    type: [Boolean, Object],
    default() {
      return true;
    }
  },
  boxZoom: {
    type: Boolean,
    default: true
  },
  dragRotate: {
    type: Boolean,
    default: true
  },
  dragPan: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  doubleClickZoom: {
    type: Boolean,
    default: true
  },
  touchZoomRotate: {
    type: [Boolean, Object],
    default() {
      return true;
    }
  },
  trackResize: {
    type: Boolean,
    default: true
  },
  center: {
    type: [Object, Array],
    default: undefined
  },
  zoom: {
    type: Number,
    default: 0
  },
  bearing: {
    type: Number,
    default: 0
  },
  pitch: {
    type: Number,
    default: 0
  },
  bounds: {
    type: [Object, Array],
    default: undefined
  },
  fitBoundsOptions: {
    type: Object,
    default: undefined
  },
  renderWorldCopies: {
    type: Boolean,
    default: true
  },
  RTLTextPluginUrl: {
    type: String,
    default: undefined
  },
  light: {
    type: Object,
    default: undefined
  },
  tileBoundaries: {
    type: Boolean,
    default: false
  },
  collisionBoxes: {
    type: Boolean,
    default: false
  },
  repaint: {
    type: Boolean,
    default: false
  },
  transformRequest: {
    type: Function,
    default: null
  },
  maxTileCacheSize: {
    type: Number,
    default: null
  },
  localIdeographFontFamily: {
    type: String,
    default: null
  },
  collectResourceTiming: {
    type: Boolean,
    default: false
  },
  fadeDuration: {
    type: Number,
    default: 300
  },
  crossSourceCollisions: {
    type: Boolean,
    default: true
  }
};

var utils = {
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

const watchers = {
  maxBounds(next) {
    this.map.setMaxBounds(next);
  },
  minZoom(next) {
    this.map.setMinZoom(next);
  },
  maxZoom(next) {
    this.map.setMaxZoom(next);
  },
  mapStyle(next) {
    this.map.setStyle(next);
  },
  // TODO: make 'bounds' synced prop
  // bounds (next) { this.map.fitBounds(next, { linear: true, duration: 0 }) },
  collisionBoxes(next) {
    this.map.showCollisionBoxes = next;
  },
  tileBoundaries(next) {
    this.map.showTileBoundaries = next;
  },
  repaint(next) {
    this.map.repaint = next;
  },
  zoom(next) {
    this.map.setZoom(next);
  },
  center(next) {
    this.map.setCenter(next);
  },
  bearing(next) {
    this.map.setBearing(next);
  },
  pitch(next) {
    this.map.setPitch(next);
  },
  light(next) {
    this.map.setLigh(next);
  }
};

function watcher(prop, callback, next, prev) {
  if (this.initial) return;
  const listeners = utils.extractListenersFromAttrs(this.$attrs);
  if (listeners[`onUpdate:${prop}`]) {
    if (this.propsIsUpdating[prop]) {
      this._watcher.active = false;
      this.$nextTick(() => {
        this._watcher.active = true;
      });
    } else {
      this._watcher.active = true;
      callback(next, prev);
    }
    this.propsIsUpdating[prop] = false;
  } else {
    callback(next, prev);
  }
}

function makeWatchers() {
  const wrappers = {};
  Object.entries(watchers).forEach(prop => {
    wrappers[prop[0]] = function(next, prev) {
      return watcher.call(this, prop[0], prop[1].bind(this), next, prev);
    };
  });
  return wrappers;
}

var withWatchers = {
  watch: makeWatchers()
};

var withPrivateMethods = {
  methods: {
    $_updateSyncedPropsFabric(prop, data) {
      return () => {
        this.propsIsUpdating[prop] = true;
        let info = typeof data === "function" ? data() : data;
        return this.$emit(`update:${prop}`, info);
      };
    },

    $_bindPropsUpdateEvents() {
      const syncedProps = [
        {
          events: ["moveend"],
          prop: "center",
          getter: this.map.getCenter.bind(this.map)
        },
        {
          events: ["zoomend"],
          prop: "zoom",
          getter: this.map.getZoom.bind(this.map)
        },
        {
          events: ["rotate"],
          prop: "bearing",
          getter: this.map.getBearing.bind(this.map)
        },
        {
          events: ["pitch"],
          prop: "pitch",
          getter: this.map.getPitch.bind(this.map)
        },
        {
          events: ["moveend", "zoomend", "rotate", "pitch"],
          prop: "bounds",
          getter: () => {
            let newBounds = this.map.getBounds();
            if (this.$props.bounds instanceof Array) {
              newBounds = newBounds.toArray();
            }
            return newBounds;
          }
        }
      ];
      const listeners = utils.extractListenersFromAttrs(this.$attrs);
      syncedProps.forEach(({ events, prop, getter }) => {
        events.forEach(event => {
          if (listeners[`onUpdate:${prop}`]) {
            this.map.on(event, this.$_updateSyncedPropsFabric(prop, getter));
          }
        });
      });
    },

    $_loadMap() {
      return this.mapboxPromise.then(mapbox => {
        this.mapbox = mapbox.default ? mapbox.default : mapbox;
        return new Promise(resolve => {
          if (this.accessToken) this.mapbox.accessToken = this.accessToken;
          const map = new this.mapbox.Map({
            ...this._props,
            container: this.$refs.container,
            style: this.mapStyle
          });
          map.on("load", () => resolve(map));
        });
      });
    },

    $_RTLTextPluginError(error) {
      this.$emit("rtl-plugin-error", { map: this.map, error: error });
    },

    $_bindMapEvents(events) {
      const eventNames = events.map(event => event.name);
      const listeners = utils.extractListenersFromAttrs(this.$attrs);
      Object.keys(listeners).forEach(listenerKey => {
        const eventName = listenerKey.substring(2).toLowerCase();
        if (eventNames.includes(eventName)) {
          this.map.on(eventName, this.$_emitMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      events.forEach(eventName => {
        this.map.off(eventName, this.$_emitMapEvent);
      });
    }
  }
};

var withAsyncActions = {
  created() {
    this.actions = {};
  },

  methods: {
    $_registerAsyncActions(map) {
      this.actions = {
        ...promisify(map),
        stop() {
          this.map.stop();
          const updatedProps = {
            pitch: this.map.getPitch(),
            zoom: this.map.getZoom(),
            bearing: this.map.getBearing(),
            center: this.map.getCenter()
          };
          Object.entries(updatedProps).forEach(prop => {
            this.$_updateSyncedPropsFabric(prop[0], prop[1])();
          });

          return Promise.resolve(updatedProps);
        }
      };
    }
  }
};

var GlMap = {
  name: "GlMap",

  mixins: [withWatchers, withAsyncActions, withPrivateMethods, withEventsMixin],

  props: {
    mapboxGl: {
      type: Object,
      default: null
    },
    ...options
  },

  provide() {
    return {
      mapbox: computed(() => this.mapbox),
      map: computed(() => (isRef(this.map) ? this.map.value : this.map)),
      actions: computed(() => this.actions)
    };
  },

  data() {
    return {
      initial: true,
      initialized: false
    };
  },

  computed: {
    loaded() {
      return this.map ? this.map.loaded() : false;
    },
    version() {
      return this.map ? this.map.version : null;
    },
    isStyleLoaded() {
      return this.map ? this.map.isStyleLoaded() : false;
    },
    areTilesLoaded() {
      return this.map ? this.map.areTilesLoaded() : false;
    },
    isMoving() {
      return this.map ? this.map.isMoving() : false;
    },
    canvas() {
      return this.map ? this.map.getCanvas() : null;
    },
    canvasContainer() {
      return this.map ? this.map.getCanvasContainer() : null;
    },
    images() {
      return this.map ? this.map.listImages() : null;
    }
  },

  created() {
    this.map = null;
    this.propsIsUpdating = {};
    this.$_containerVNode = null;
    this.mapboxPromise = this.mapboxGl
      ? Promise.resolve(this.mapboxGl)
      : import("mapbox-gl");
  },

  mounted() {
    this.$_loadMap().then(map => {
      this.map = map;
      if (
        this.RTLTextPluginUrl !== undefined &&
        this.mapbox.getRTLTextPluginStatus() !== "loaded"
      ) {
        this.mapbox.setRTLTextPlugin(
          this.RTLTextPluginUrl,
          this.$_RTLTextPluginError
        );
      }
      const events = Object.values(mapEvents);
      this.$_bindMapEvents(events);
      this.$_registerAsyncActions(map);
      this.$_bindPropsUpdateEvents();
      this.initial = false;
      this.initialized = true;
      this.$emit("load", { map, component: this });
    });
  },

  beforeDestroy() {
    this.$nextTick(() => {
      if (this.map) this.map.remove();
    });
  },

  render() {
    if (!this.$$_containerVNode) {
      this.$_containerVNode = h("div", {
        id: this.container,
        ref: "container"
      });
    }
    return h("div", { class: "mgl-map-wrapper" }, [
      this.$_containerVNode,
      this.initialized ? this.$slots.default() : null
    ]);
  }
};

var withSelfEventsMixin = {
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

var controlMixin = {
  mixins: [withEventsMixin, withSelfEventsMixin],

  inject: ["mapbox", "map", "actions"],

  props: {
    position: {
      type: String,
      default: "top-right"
    }
  },

  beforeDestroy() {
    if (this.map && this.control) {
      this.map.value.removeControl(this.control);
    }
  },

  methods: {
    $_addControl() {
      try {
        this.map.value.addControl(this.control, this.position);
      } catch (err) {
        this.$_emitEvent("error", { error: err });
        return;
      }
      this.$_emitEvent("added", { control: this.control });
    }
  },

  render() {}
};

var NavigationControl = {
  name: "NavigationControl",
  mixins: [controlMixin],

  props: {
    showCompass: {
      type: Boolean,
      default: true
    },
    showZoom: {
      type: Boolean,
      default: true
    }
  },

  created() {
    this.control = new this.mapbox.value.NavigationControl(this.$props);
    this.$_addControl();
  }
};

const geolocationEvents = {
  trackuserlocationstart: "trackuserlocationstart",
  trackuserlocationend: "trackuserlocationend",
  geolocate: "geolocate",
  error: "error"
};

var GeolocateControl = {
  name: "GeolocateControl",
  mixins: [withEventsMixin, withSelfEventsMixin, controlMixin],

  props: {
    positionOptions: {
      type: Object,
      default() {
        return {
          enableHighAccuracy: false,
          timeout: 6000
        };
      }
    },
    fitBoundsOptions: {
      type: Object,
      default: () => ({ maxZoom: 15 })
    },
    trackUserLocation: {
      type: Boolean,
      default: false
    },
    showUserLocation: {
      type: Boolean,
      default: true
    }
  },

  created() {
    const GeolocateControl = this.mapbox.value.GeolocateControl;
    this.control = new GeolocateControl(this.$props);
    this.$_addControl();
    this.$_bindSelfEvents(Object.keys(geolocationEvents), this.control);
  },

  methods: {
    trigger() {
      if (this.control) {
        return this.control.trigger();
      }
    }
  }
};

var FullscreenControl = {
  name: "FullscreenControl",
  mixins: [controlMixin],

  props: {
    container: {
      type: HTMLElement,
      default: undefined
    }
  },

  created() {
    this.control = new this.mapbox.value.FullscreenControl(this.$props);
    this.$_addControl();
  }
};

var AttributionControl = {
  name: "AttributionControl",
  mixins: [controlMixin],
  props: {
    compact: {
      type: Boolean,
      default: true
    },
    customAttribution: {
      type: [String, Array],
      deafault: undefined
    }
  },

  created() {
    this.control = new this.mapbox.value.AttributionControl(this.$props);
    this.$_addControl();
  }
};

var ScaleControl = {
  name: "ScaleControl",

  mixins: [controlMixin],

  props: {
    maxWidth: {
      type: Number,
      default: 150
    },
    unit: {
      type: String,
      default: "metric",
      validator(value) {
        return ["imperial", "metric", "nautical"].includes(value);
      }
    }
  },

  watch: {
    unit(next, prev) {
      if (this.control && next !== prev) {
        this.control.setUnit(next);
      }
    }
  },

  created() {
    this.control = new this.mapbox.value.ScaleControl(this.$props);
    this.$_addControl();
  }
};

const markerEvents = {
  drag: "drag",
  dragstart: "dragstart",
  dragend: "dragend"
};

const markerDOMEvents = {
  click: "click",
  mouseenter: "mouseenter",
  mouseleave: "mouseleave"
};

var Marker = {
  name: "MapMarker",
  mixins: [withEventsMixin, withSelfEventsMixin],

  inject: ["mapbox", "map"],

  provide() {
    const self = this;
    return {
      get marker() {
        return self.marker;
      }
    };
  },

  props: {
    // mapbox marker options
    offset: {
      type: [Object, Array],
      default: () => [0, 0]
    },
    coordinates: {
      type: Array,
      required: true
    },
    color: {
      type: String
    },
    anchor: {
      type: String,
      default: "center"
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      initial: true,
      marker: undefined
    };
  },

  watch: {
    coordinates(lngLat) {
      if (this.initial) return;
      this.marker.setLngLat(lngLat);
    },
    draggable(next) {
      if (this.initial) return;
      this.marker.setDraggable(next);
    }
  },

  mounted() {
    const markerOptions = {
      ...this.$props
    };
    if (this.$slots.marker) {
      markerOptions.element = this.$slots.marker[0].elm;
    }
    this.marker = new this.mapbox.value.Marker(markerOptions);

    const listeners = utils.extractListenersFromAttrs(this.$attrs);

    if (listeners["onUpdate:coordinates"]) {
      this.marker.on("dragend", event => {
        let newCoordinates;
        if (this.coordinates instanceof Array) {
          newCoordinates = [event.target._lngLat.lng, event.target._lngLat.lat];
        } else {
          newCoordinates = event.target._lngLat;
        }
        this.$emit("update:coordinates", newCoordinates);
      });
    }

    const eventNames = Object.keys(markerEvents);
    this.$_bindSelfEvents(eventNames, this.marker);

    this.initial = false;
    this.$_addMarker();
  },

  beforeDestroy() {
    if (this.map !== undefined && this.marker !== undefined) {
      this.marker.remove();
    }
  },

  methods: {
    $_addMarker() {
      this.marker.setLngLat(this.coordinates).addTo(this.map.value);
      this.$_bindMarkerDOMEvents();
      this.$_emitEvent("added", { marker: this.marker });
    },

    $_emitSelfEvent(event) {
      this.$_emitMapEvent(event, { marker: this.marker });
    },

    $_bindMarkerDOMEvents() {
      const listeners = utils.extractListenersFromAttrs(this.$attrs);
      Object.keys(listeners).forEach(listenerKey => {
        const eventName = listenerKey.substring(2).toLowerCase();
        if (Object.values(markerDOMEvents).includes(eventName)) {
          this.marker._element.addEventListener(eventName, event => {
            this.$_emitSelfEvent(event);
          });
        }
      });
    },

    remove() {
      this.marker.remove();
      this.$_emitEvent("removed");
    },

    togglePopup() {
      return this.marker.togglePopup();
    }
  },

  render() {
    return h(
      "div",
      {
        style: {
          display: "none"
        }
      },
      [this.$slots.marker(), this.marker ? this.$slots.default() : null]
    );
  }
};

const popupEvents = {
  open: "open",
  close: "close"
};

/**
 * Popup component.
 * @see See [Mapbox Gl JS Popup](https://www.mapbox.com/mapbox-gl-js/api/#popup)
 */
var Popup = {
  name: "Popup",
  mixins: [withEventsMixin, withSelfEventsMixin],

  inject: {
    mapbox: {
      default: null
    },
    map: {
      default: null
    },
    marker: {
      default: null
    }
  },

  props: {
    /**
     * If `true`, a close button will appear in the top right corner of the popup.
     * Mapbox GL popup option.
     */
    closeButton: {
      type: Boolean,
      default: true
    },
    /**
     * Mapbox GL popup option.
     * If `true`, the popup will closed when the map is clicked. .
     */
    closeOnClick: {
      type: Boolean,
      default: true
    },
    /**
     * Mapbox GL popup option.
     * A string indicating the popup's location relative to the coordinate set.
     * If unset the anchor will be dynamically set to ensure the popup falls within the map container with a preference for 'bottom' .
     *  'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
     */
    anchor: {
      validator(value) {
        let allowedValues = [
          "top",
          "bottom",
          "left",
          "right",
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right"
        ];
        return typeof value === "string" && allowedValues.includes(value);
      },
      default: undefined
    },
    /**
     * Mapbox GL popup option.
     * A pixel offset applied to the popup's location
     * a single number specifying a distance from the popup's location
     * a PointLike specifying a constant offset
     * an object of Points specifing an offset for each anchor position Negative offsets indicate left and up.
     */
    offset: {
      type: [Number, Object, Array],
      default: () => [0, 0]
    },
    coordinates: {
      type: Array
    },

    /**
     * Component option.
     * If `true`, popup treats data in deafult slot as plain text
     */
    onlyText: {
      type: Boolean,
      default: false
    },

    showed: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      initial: true,
      popup: undefined
    };
  },

  computed: {
    open: {
      get() {
        if (this.popup !== undefined) {
          return this.popup.isOpen();
        }
        return false;
      },
      set(value) {
        if (this.map && this.popup) {
          if (!value) {
            this.popup.remove();
          } else {
            this.popup.addTo(this.map.value);
          }
        }
      }
    }
  },

  watch: {
    coordinates(lngLat) {
      if (this.initial) return;
      this.popup.setLngLat(lngLat);
    },

    showed(next, prev) {
      if (next !== prev) {
        this.open = next;
        if (this.marker) {
          this.marker.togglePopup();
        }
      }
    }
  },

  created() {
    this.popup = new this.mapbox.value.Popup(this.$props);
  },

  mounted() {
    this.$_addPopup();
    this.initial = false;
  },

  beforeDestroy() {
    if (this.map) {
      this.popup.remove();
      this.$_emitEvent("removed");
    }
  },

  methods: {
    $_addPopup() {
      this.popup = new this.mapbox.value.Popup(this.$props);
      if (this.coordinates !== undefined) {
        this.popup.setLngLat(this.coordinates);
      }
      if (this.$slots.default !== undefined) {
        if (this.onlyText) {
          if (this.$slots.default[0].elm.nodeType === 3) {
            let tmpEl = document.createElement("span");
            tmpEl.appendChild(this.$slots.default[0].elm);
            this.popup.setText(tmpEl.innerText);
          } else {
            this.popup.setText(this.$slots.default[0].elm.innerText);
          }
        } else {
          this.popup.setDOMContent(this.$slots.default[0].elm);
        }
      }

      this.$_bindSelfEvents(Object.keys(popupEvents), this.popup);

      this.$_emitEvent("added", { popup: this.popup });

      if (this.marker) {
        this.marker.setPopup(this.popup);
      }
      if (this.showed) {
        this.open = true;

        if (this.marker) {
          this.marker.togglePopup();
        }
      }
    },

    $_emitSelfEvent(event) {
      this.$_emitMapEvent(event, { popup: this.popup });
    },

    remove() {
      this.popup.remove();
      this.$_emitEvent("remove", { popup: this.popup });
    }
  },

  render() {
    return h(
      "div",
      {
        style: {
          display: "none"
        }
      },
      [this.$slots.default()]
    );
  }
};

var layerEventsConfig = {
  mousedown: "onMousedown",
  mouseup: "onMouseup",
  click: "onClick",
  dblclick: "onDblclick",
  mousemove: "onMousemove",
  mouseenter: "onMouseenter",
  mouseleave: "onMouseleave",
  mouseover: "onMouseover",
  mouseout: "onMouseout",
  contextmenu: "onContextmenu",
  touchstart: "onTouchstart",
  touchend: "onTouchend",
  touchcancel: "onTouchcancel"
};

// import withRegistration from "../../lib/withRegistration";

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

var layerMixin = {
  mixins: [withEventsMixin],
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

var GeojsonLayer = {
  name: "GeojsonLayer",
  mixins: [layerMixin],

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

var ImageLayer = {
  name: "ImageLayer",
  mixins: [layerMixin],

  created() {
    if (this.source) {
      if (this.source.coordinates) {
        this.$watch(
          "source.coordinates",
          function(next) {
            if (this.initial) return;
            if (next) {
              this.mapSource.setCoordinates(next);
            }
          },
          { deep: true }
        );
      }

      if (this.source.url) {
        this.$watch(
          "source.url",
          function(next) {
            if (this.initial) return;
            if (next) {
              this.mapSource.updateImage({
                url: next,
                coordinates: this.source.coordinates
              });
            }
          },
          { deep: true }
        );
      }
    }
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      const source = {
        type: "image",
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEventsConfig);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      const layer = {
        id: this.layerId,
        source: this.sourceId,
        type: "raster",
        ...this.layer
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    }
  }
};

var CanvasLayer = {
  name: "CanvasLayer",
  mixins: [layerMixin],

  inject: ["mapbox", "map"],

  props: {
    source: {
      type: Object,
      required: true
    },
    layer: {
      type: Object,
      default: null
    }
  },

  computed: {
    canvasElement() {
      return this.mapSource ? this.mapSource.getCanvas() : null;
    }
  },

  watch: {
    coordinates(val) {
      if (this.initial) return;
      this.mapSource.setCoordinates(val);
    }
  },

  created() {
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      const source = {
        type: "canvas",
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEventsConfig);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: this.layerId,
        source: this.sourceId,
        type: "raster",
        ...this.layer
      };
      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", {
        layerId: this.layerId,
        canvas: this.canvasElement
      });
    }
  }
};

var VideoLayer = {
  name: "VideoLayer",
  mixins: [layerMixin],

  computed: {
    video() {
      return this.map.getSource(this.sourceId).getVideo();
    }
  },

  created() {
    if (this.source && this.source.coordinates) {
      this.$watch("source.coordinates", function(next) {
        if (this.initial) return;
        this.mapSource.setCoordinates(next);
      });
    }
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      const source = {
        type: "video",
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEventsConfig);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: this.layerId,
        source: this.sourceId,
        type: "background",
        ...this.layer
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    }
  }
};

var VectorLayer = {
  name: "VectorLayer",
  mixins: [layerMixin],

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

var RasterLayer = {
  name: "RasterLayer",
  mixins: [layerMixin],

  created() {
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      let source = {
        type: "raster",
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEventsConfig);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: this.layerId,
        type: "raster",
        source: this.sourceId,
        ...this.layer
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    }
  }
};

const withEvents = withEventsMixin;
const withSelfEvents = withSelfEventsMixin;
const asControl = controlMixin;
const asLayer = layerMixin;

const $helpers = {
  withEvents: withEventsMixin,
  withSelfEvents: withSelfEventsMixin,
  asControl: controlMixin,
  asLayer: layerMixin
};

const MglMap = GlMap;

const MglNavigationControl = NavigationControl;
const MglGeolocateControl = GeolocateControl;
const MglFullscreenControl = FullscreenControl;
const MglAttributionControl = AttributionControl;
const MglScaleControl = ScaleControl;

const MglGeojsonLayer = GeojsonLayer;
const MglImageLayer = ImageLayer;
const MglCanvasLayer = CanvasLayer;
const MglVideoLayer = VideoLayer;
const MglVectorLayer = VectorLayer;
const MglRasterLayer = RasterLayer;

const MglMarker = Marker;
const MglPopup = Popup;

export {
  $helpers,
  MglAttributionControl,
  MglCanvasLayer,
  MglFullscreenControl,
  MglGeojsonLayer,
  MglGeolocateControl,
  MglImageLayer,
  MglMap,
  MglMarker,
  MglNavigationControl,
  MglPopup,
  MglRasterLayer,
  MglScaleControl,
  MglVectorLayer,
  MglVideoLayer,
  asControl,
  asLayer,
  withEvents,
  withSelfEvents
};
