
<script lang="ts">
    let { name, user_id } = $props()
</script>

<div class="navbar">
    <a href="/">Home</a>
    <a href="/profile/{user_id}">{name}'s Profile</a>
</div>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        background-color: rgb(255, 255, 255);
        color: white;
        padding: 10px
    }
    
    .navbar a {
        color: #000000;
        text-decoration: none;
    }

    .navbar a:hover {
        color: goldenrod
    }

</style>