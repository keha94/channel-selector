import ChannelSelector from 'src/ChannelSelector.vue'
import { createVM } from '../helpers/utils.js'

describe('ChannelSelector.vue', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `
<ChannelSelector :value="channels"></ChannelSelector>
`, { components: { ChannelSelector }, data () {
  return {
    channels: []
  }
} })
    // vm.$el.querySelector('.ChannelSelector h1').textContent.should.eql('Hello World!')
  })
})
