import controlMixin from "./controlMixin";

export default {
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
