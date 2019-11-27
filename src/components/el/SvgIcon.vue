<template>  
   <div v-html="require(`../../assets/images/${icon}.svg`)"></div>
</template>  

<script>  
export default {  
    props: ['icon']
}
</script>  