<template>
    <div>
        <Card v-for="book in books" :key="book.id" :book="book"></Card>
        <!-- <div v-for="book in books" :key="book.id">{{ book.title }}</div> -->
    </div>
</template>

<script>
import {get} from '@/util'
import Card from '@/components/Card'
export default {
    components:{
        Card
    },
    data(){
        return{
            books:[]
        }
    },
    methods:{
        async getList(){
            wx.showNavigationBarLoading()
            const book = await get('/weapp/booklist')
            this.books = book.list
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading()
        }
    },
    onPullDownRefresh(){
        this.getList()
    },
    mounted(){
        this.getList()
    }
};
</script>

<style>

</style>
