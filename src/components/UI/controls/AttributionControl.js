import controlMixin from "./controlMixin";

export default {
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
