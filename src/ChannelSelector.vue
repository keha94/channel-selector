<template>
  <div class="channel-selector" :class="{'chnl-error': error}">
    <div v-for="channelGroup in channelGroups" v-if="shouldRender(channelGroup)" class="chnl-dropdown" :class="{'readonly': readOnly}" :key="channelGroup.name + 'group'">
      <div>
        <label class="chnl-dropbtn chnl-lbl" :class="{'active': !isNoneSelected(channelGroup)}" @click.prevent="channelGroupClicked(channelGroup)">
          <img class="chnl-btn-icon" :class="{'chnl-icon-inactive': isNoneSelected(channelGroup)}" :src="'http://prtten04.networkten.com.au:7778/bussys_images/' + channelGroup.name + '_Logo_Trans_30x30.png'">
          <input type="checkbox" class="chnl-select-group" :data-chnl-group="channelGroup.name" :checked="!isNoneSelected(channelGroup)" />
          <span v-if="isAllSelected(channelGroup) && !channelGroupOnly" class="chnl-all-selected">ALL</span>
          <span v-else-if="!channelGroupOnly">
            <span v-for="channel in channelGroup.channels" v-if="channel.selected" class="chnl-market-selected" :class="'chnl-' + channel.id" :key="channel.id + 'marketabbr'"> {{channel.market.substring(0, 1)}}</span>
          </span>
        </label>
      </div>
      <div class="chnl-markets-list">
        <div>
          <label v-for="channel in channelGroup.channels" class="chnl-lbl" :class="{'active': channel.selected}" @click.prevent="channelMarketClicked(channel)" :key="channel.id + 'marketlbl'">
            <span>
              <input class="channels" type="checkbox" :name="inputName" :value="channel.id" :checked="channel.selected" />
              {{channel.market.substring(0,3).toUpperCase()}}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    inputName: {
      type: String,
      default: 'channelId'
    },
    checkAllWhenZeroChecked: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    exclusiveChannels: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    renderChannelGroups: {
      type: Array,
      default: function () {
        return ['TEN', 'ONE', 'ELEVEN']
      }
    },
    // TODO:
    channelGroupOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // Order of channel IDs must match markets sequence above
      channelGroups: [{
        name: 'TEN',
        channels: [{
          id: 3,
          market: 'SYD',
          selected: false
        }, {
          id: 2,
          market: 'MEL',
          selected: false
        }, {
          id: 5,
          market: 'BRI',
          selected: false
        }, {
          id: 1,
          market: 'ADE',
          selected: false
        }, {
          id: 4,
          market: 'PER',
          selected: false
        }]
      },
      {
        name: 'ONE',
        channels: [{
          id: 11,
          market: 'SYD',
          selected: true
        }, {
          id: 12,
          market: 'MEL',
          selected: true
        }, {
          id: 13,
          market: 'BRI',
          selected: true
        }, {
          id: 14,
          market: 'ADE',
          selected: true
        }, {
          id: 15,
          market: 'PER',
          selected: true
        }]
      },
      {
        name: 'ELEVEN',
        channels: [{
          id: 20,
          market: 'SYD',
          selected: true
        }, {
          id: 21,
          market: 'MEL',
          selected: true
        }, {
          id: 22,
          market: 'BRI',
          selected: true
        }, {
          id: 23,
          market: 'ADE',
          selected: true
        }, {
          id: 24,
          market: 'PER',
          selected: true
        }]
      }
      ]
    }
  },
  methods: {
    emitSelectedChannels () {
      let selectedChannels = []
      this.channelGroups.forEach((channelGroup) => {
        channelGroup.channels.forEach((channel) => {
          if (channel.selected) {
            selectedChannels.push(channel.id)
          }
        })
      })
      this.$emit('input', selectedChannels)
    },
    shouldRender (channelGroup) {
      return this.renderChannelGroups.includes(channelGroup.name)
    },
    isNoneSelected (channelGroup) {
      return channelGroup.channels.every((chnl) => {
        return chnl.selected === false
      })
    },
    isAllSelected (channelGroup) {
      return channelGroup.channels.every((chnl) => {
        return chnl.selected === true
      })
    },
    channelGroupClicked (channelGroup) {
      if (this.isNoneSelected(channelGroup)) {
        // Set as selected
        this.channelGroups.find(elem => elem.name === channelGroup.name)
          .channels.forEach((channel) => {
            channel.selected = true
          })

        // In case exclusiveChannels - deselect other renderChannelGroups
        if (this.exclusiveChannels) {
          this.channelGroups.forEach((group) => {
            if (group.name !== channelGroup.name) {
              group.channels.forEach((chnl) => {
                chnl.selected = false
              })
            }
          })
        }
      } else {
        // Set as unselected
        this.channelGroups.find(elem => elem.name === channelGroup.name)
          .channels.forEach((channel) => {
            channel.selected = false
          })
      }
      this.emitSelectedChannels()
    },
    channelMarketClicked (channel) {
      const id = channel.id
      const selected = channel.selected
      const exclusiveChannels = this.exclusiveChannels
      this.channelGroups.forEach((channelGroup) => {
        if (channelGroup.channels.includes(channel)) {
          channelGroup.channels.find((chnl) => {
            return chnl.id === id
          }).selected = (!selected)
        } else if (exclusiveChannels) {
          // Deselect all other channel groups
          channelGroup.channels.forEach((chnl) => {
            chnl.selected = false
          })
        }
      })
      this.emitSelectedChannels()
    },
    initializeSelected () {
      const selectedChannels = this.value
      // Sets the inner state of the Channel Selector to match given values
      this.channelGroups.forEach((channelGroup) => {
        channelGroup.channels.forEach((channel) => {
          channel.selected = selectedChannels.includes(channel.id)
        })
      })
    }
  },
  beforeMount () {
    const vm = this
    vm.initializeSelected()
    // Below should only occur at Mounting stage.
    if (vm.checkAllWhenZeroChecked && vm.value.length === 0) {
      vm.channelGroups.forEach((channelGroup) => {
        vm.channelGroupClicked(channelGroup)
      })
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.initializeSelected()
    }
  },
  mounted () {
    this.emitSelectedChannels()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channel-selector {
  border: 1px solid transparent;
}

.chnl-error {
  border: 1px solid #FF5252 !important;
}

.chnl-dropbtn {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0px;
  /* height: 30px !important; */
  /* padding: 5px !important; */
}

.chnl-btn-icon {
  height: 22px;
  width: 22px;
  margin-right: 2px;
  display: inline;
  vertical-align: middle;
}

.chnl-icon-inactive {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
  margin-right: 0 !important;
}

.chnl-dropdown {
  position: relative;
  display: inline-block;
  border: 1px solid transparent;
}

.chnl-dropdown.readonly {
  pointer-events: none;
}

.chnl-markets-list {
  display: none;
  position: absolute;
  z-index: 1011;
  background-color: #f9f9f9;
  overflow: initial;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5);
}

.chnl-markets-list a {
  color: black;
  /* padding: 12px 16px; */
  text-decoration: none;
  display: block;
}

.chnl-dropdown:hover .chnl-markets-list {
  display: block;
}

.chnl-group-only:hover .chnl-markets-list {
  display: none !important;
}

.chnl-lbl {
  width: 100px !important;
  /* padding: 0px !important; */
  /* font-size: x-small !important; */
  background-color: #e6e6e6 !important;
  text-decoration: line-through !important;
  color: #000 !important;
  -webkit-transition-duration: 0.4s; /* Safari */

  /* BS btn css */
  display: inline-block;
  padding: 6px 10px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 0px;
}

.chnl-lbl.active {
  text-decoration: none !important;
  background-color: #cccccc !important;
}

.chnl-lbl:hover {
  background-color: #737373 !important;
  color: #fff !important;
}

.chnl-lbl input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}

.chnl-all-selected {
  margin-left: 5px;
}
</style>
