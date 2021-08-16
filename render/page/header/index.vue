<template>
  <div class="page-header">
    <div class="page-header-left">
      <Poptip transfer trigger="click">
        <a href="javascript:void(0)">
          <Button size="small" icon="md-settings"></Button>
        </a>
        <div slot="content">
          <Config v-if="$main.config" :data="$main.config"></Config>
        </div>
      </Poptip>
      <Input
        v-if="$main.config.image"
        icon="md-barcode"
        size="small"
        style="width: 60px"
        v-model="$main.config.image.column"
      />
      <Input
        v-if="$main.config.image"
        icon="md-resize"
        size="small"
        style="width: 70px"
        v-model="$main.config.image.height"
      />

      <Dropdown trigger="click" transfer>
        <ButtonGroup
          ><Button
            @click.native.stop="$main.showCheck = !$main.showCheck"
            :type="$main.showCheck ? 'primary' : 'default'"
            :ghost="$main.showCheck"
            icon="md-checkbox-outline"
            size="small"
          />
          <Button size="small">
            <span>{{ Number($main.storage.checkIndex || 0) + 1 }}</span>
            <Icon class="icon-checktool" type="md-images"></Icon>
            <span
              v-if="
                $main.checkList[$main.storage.checkIndex] &&
                  $main.checkList[$main.storage.checkIndex].length
              "
              class="badge"
              >{{ $main.checkList[$main.storage.checkIndex].length }}</span
            >
            <Icon type="md-arrow-dropdown" />
          </Button>
        </ButtonGroup>
        <DropdownMenu slot="list">
          <CheckList
            v-model="$main.storage.checkIndex"
            :data="$main.checkList"
          ></CheckList>
        </DropdownMenu>
      </Dropdown>
      <Button icon="md-bookmark" size="small" @click="$main.addBookmark" />
      <ButtonGroup>
        <Button icon="ios-funnel" size="small"> </Button>
        <Button
          icon="md-image"
          size="small"
          @click="$main.filterSelect('image')"
          :type="
            $main.storage.formatFilter &&
            $main.storage.formatFilter.includes('image')
              ? 'primary'
              : 'default'
          "
        >
        </Button>
        <Button
          icon="md-videocam"
          size="small"
          @click="$main.filterSelect('video')"
          :type="
            $main.storage.formatFilter &&
            $main.storage.formatFilter.includes('video')
              ? 'primary'
              : 'default'
          "
        >
        </Button>
        <Button
          icon="md-document"
          size="small"
          @click="$main.filterSelect('other')"
          :type="
            $main.storage.formatFilter &&
            $main.storage.formatFilter.includes('other')
              ? 'primary'
              : 'default'
          "
        >
        </Button>
      </ButtonGroup>
      <Button icon="md-pricetags" size="small" />

      <Button size="small" @click="$connect.run('selectDbPath')">
        <Icon type="ios-apps" />
      </Button>
      <Task></Task>
    </div>
    <RadioGroup v-model="$main.storage.viewType" type="button" size="small">
      <Radio label="book"> <Icon type="md-book" /> </Radio>
      <Radio label="grid"><Icon type="md-grid"/></Radio>
      <Radio label="scroll"><Icon type="md-more"/></Radio>
    </RadioGroup>
  </div>
</template>

<script>
import CheckList from "./check-list";
import Config from "../config";
import Task from "./task";
import "./style.less";
export default {
  inject: ["$main"],
  components: { CheckList, Config, Task },
  data() {
    return {
      taskPercent: 0
    };
  }
};
</script>
