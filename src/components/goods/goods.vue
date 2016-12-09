<template>
  <div class='goods'>
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current' : currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span class="icon" v-show='item.type>0' :class="classMap[item.type]"></span>{{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title border-1px">{{ item.name }}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img :src="food.icon" width="57px" height="57px">
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old-price" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BSroll from 'better-scroll'

  const ERR_OK = 0

  export default{
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee']
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BSroll(this.$refs.menuWrapper,{
          click: true
        })
        this.foodsScroll = new BSroll(this.$refs.foodsWrapper,{
          probeType: 3
        })
        this.foodsScroll.on('scroll',(pos) => {
          console.log(pos)
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu(index,event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let element = foodList[index]
        this.foodsScroll.scrollToElement(element, 300)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    position absolute
    top 174px
    bottom 46px
    width 100%
    display flex
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.special
            bg-image('special_3')
          &.invoice
            bg-image('invoice_3')
        .text
          font-size 12px
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7,17,27,.1))
          &.last-child
            border-none()
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159 )
        background-color #f3f5f7
      .food-item
        display flex
        margin 0 18px
        padding 18px 0
        border-1px(rgba(7,17,27,.1))
        &:last-child
          border-none()
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 0 0
            font-size 14px
            line-height 14px
            height 14px
            color rgb(7,17,27)
          .desc,.extra
            margin-top 8px
            line-height 10px
            font-size 10px
            color rgb(147,153,159 )
            .count
              margin-right 12px
          .desc
            line-height 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20 )
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159 )

</style>
