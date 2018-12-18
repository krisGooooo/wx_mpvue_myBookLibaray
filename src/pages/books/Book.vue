<template>
    <div>
        <Card v-for="book in books" :key="book.id" :book="book"></Card>
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
            const book = await get('/weapp/booklist')
            this.books = book.list
        }
    },
    mounted(){
        this.getList()
    }
};
</script>

<style>

</style>
