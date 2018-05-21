<style lang='less' scoped>
.no-data{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.no-data__img{
    width: 180px;
    height: 80px;
}
</style>

<template>
    <div class="no-data flex-column-center">
        <img :src="url" class="no-data__img" mode="widthFix"/>
        <p class="text-center text-sliver MT-20">抱歉!这个星球找不到呢~</p>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            url: require('@/assets/images/nodata.png')
        }
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    watch: {

    },
    components: {

    },
    methods: {

    }
}
</script>