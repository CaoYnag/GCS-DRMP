<template>
  <div class="region container">
    <div class="region carousel">
      <Carousel
        v-model="value3"
        :autoplay="setting.autoplay"
        :autoplay-speed="setting.autoplaySpeed"
        :dots="setting.dots"
        :radius-dot="setting.radiusDot"
        :trigger="setting.trigger"
        :arrow="setting.arrow" loop>
        <CarouselItem>
          <div class="region carousel item">
            <div style="background-image: url('/static/sv/rg_preview_big1.png')">
              <div class="title">拙政园</div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="region carousel item">
            <div style="background-image: url('/static/sv/rg_preview_big2.png')">
              <div class="title">狮子林</div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="region carousel item">
            <div style="background-image: url('/static/sv/rg_preview_big3.png')">
              <div class="title">虎丘</div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="region carousel item">
            <div style="background-image: url('/static/sv/rg_preview_big1.png')">
              <div class="title">金鸡湖</div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="region carousel item">
            <div style="background-image: url('/static/sv/rg_preview_big2.png')">
              <div class="title">独墅湖</div>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
    </div>
    <Divider><h3>热门地区</h3></Divider>
    <div ref="rglist" class="region list">
      <div v-if="regions && regions.length > 0">
        <vk-grid>
          <div v-for="(rg) in regions">
            <div class="region item">
              <img :src='region_thumb(rg.uid)'>
              <router-link :to="{path: 'region/preview/' + rg.uid}">
                <div class="title">{{rg.name}}</div>
              </router-link>
            </div>
          </div>
        </vk-grid>
      </div>
      <div v-else-if="regions">
        <div>
          <h3>Empty</h3>
        </div>
      </div>
      <div v-else>loading</div>
    </div>
  </div>
</template>
<style>
  .container {
    width: 100%;
    height: 100%;
  }

  .region.item {
    text-align: center;
  }

  .region.item img {
    width: 100px;
    height: 75px;
  }

  .region.carousel {
    width: 100%;
    height: 256px;
    margin-left: auto;
    margin-right: auto;
  }

  .region.carousel.item {
    width: 100%;
  }

  .region.carousel.item > div {
    width: 100%;
    height: 256px;
    background-clip: content-box;
    background-size: 100% auto
  }

  .region.carousel.item .title {
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    text-align: left;
    background-color: #40404040;
    color: white;
    bottom: 0;
    position: absolute;
    width: 100%;
  }
</style>
<script>
  import axios from "axios";

  export default {
    data: () => ({
      regions: null,
      value3: 0,
      setting: {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: 'inside',
        radiusDot: true,
        trigger: 'click',
        arrow: 'always'
      }
    }),
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        axios.get("http://localhost:9092/api/data/regions").then((rsp) => {
          this.regions = rsp.data.data;
        }).catch(err => {
          console.log(err);
        });
      },
      region_thumb(uid) {
        return "http://localhost:9092/api/data/thumb/region/" + uid;
      }
    }
  }
</script>
