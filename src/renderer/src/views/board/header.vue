<template>
  <div class="borad-header">
    <div class="borad-header-left">
      <i-button
        size="small"
        :type="boardSetting.lockRatio ? 'primary' : 'default'"
        @click="boardSetting.lockRatio = !boardSetting.lockRatio"
      >
        <i v-if="boardSetting.lockRatio" class="ri-lock-fill"></i
        ><i v-else class="ri-lock-unlock-fill"></i
      ></i-button>

      <i-button
        size="small"
        @click="boardSetting.autoLayout = !boardSetting.autoLayout"
        :type="boardSetting.autoLayout ? 'primary' : 'default'"
        ><i class="ri-layout-masonry-line"></i
      ></i-button>

      <i-button size="small"><i class="ri-zoom-in-line"></i></i-button>

      <i-button size="small"><i class="ri-zoom-out-line"></i> </i-button>

      <i-button size="small" @click="clearItems"> <i class="ri-delete-bin-line"></i> </i-button>

      <Dropdown trigger="click" transfer>
        <i-button size="small">
          <i class="ri-stack-line"></i>{{ boardData?.items?.length || ""
          }}<Icon type="md-arrow-dropdown" />
        </i-button>
        <template v-slot:list>
          <DropdownItem
            v-for="(item, index) of boardData.items"
            :key="index"
            @click.stop="setActive(item)"
            class="board-list-item"
            :class="{
              active: activeItem === item
            }"
            >{{ item.name }}
          </DropdownItem>
        </template>
      </Dropdown>
      <i-button size="small" @click="resetItem"> <i class="ri-arrow-go-back-line"></i> </i-button>
    </div>
    <div class="borad-header-right">
      <Dropdown trigger="click" transfer>
        <i-button size="small">
          <i class="ri-archive-drawer-line"></i>
        </i-button>
        <template v-slot:list>
          <DropdownItem
            v-for="(item, index) of boardData.items"
            :key="index"
            @click.stop="setActive(item)"
            class="board-list-item"
            :class="{
              active: activeItem === item
            }"
            >{{ item.name }}
          </DropdownItem>
        </template>
      </Dropdown>
      <i-input size="small" v-model="boardData.name" :style="{ width: '100px' }"></i-input>

      <i-button size="small" @click="boardSetting.fullscreen = !boardSetting.fullscreen"
        ><i v-if="!boardSetting.fullscreen" class="ri-fullscreen-line"></i
        ><i v-else class="ri-fullscreen-exit-line"></i
      ></i-button>
    </div>
  </div>
</template>
<script setup>
import { useBoard } from "./useBoard.ts"

const { activeItem, boardData, boardSetting, setActive, clearItems, resetItem } = useBoard()
</script>
<style lang="less">
.borad-header {
  display: flex;
  padding: 8px;
  border-bottom: 1px solid #fafafa;
  background: #fff;
}
.borad-header-left {
  flex: 1;
}
.borad-header-right {
  display: flex;
}
</style>
