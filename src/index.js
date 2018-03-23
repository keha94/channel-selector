import ChannelSelector from './ChannelSelector.vue'

function plugin (Vue) {
  Vue.component('channel-selector', ChannelSelector)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  ChannelSelector,
  version
}
