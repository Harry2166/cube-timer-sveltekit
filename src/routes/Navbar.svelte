
<script lang="ts">
    let { name, user_id, scramble } = $props()
</script>

<div class="navbar">
    <a href="/" class="navbar-selection">Home</a>
    <!-- svelte-ignore a11y_missing_attribute -->
    <a>{scramble}</a>
    <a href="/profile/{user_id}" class="navbar-selection">{name}'s Profile</a>
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

    .navbar-selection:hover {
        color: goldenrod
    }

</style>