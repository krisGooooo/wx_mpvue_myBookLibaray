<template>
    <div>
        <div v-for="book in books" :key="book.id">{{ book.title }}</div>
    </div>
</template>

<script>
import {get} from '@/util'
export default {
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
