<script>
    import { onMount } from "svelte";
      import Trash from 'iconsax-svelte/Trash.svelte';
        import Edit from 'iconsax-svelte/Edit.svelte';

    let contacts = [];
    let newName = "";
    let newPhone = "";
    let loading = false;

    async function loadContact() {
        loading = true;
        try {
            const res = await fetch("/api/contacts");
            console.log(res);
            if(res.ok){
                contacts = await res.json();
                loading = false;
            } else {
                console.error("Failed to fetch contacts");
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    async function addContact() {
        loading = true;
        try {
            await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, phone: newPhone })
            });
            newName = "";
            newPhone = "";
            await loadContact();
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    async function updateContact(id, name, phone) {
        const newNameInput = prompt("Edit name:", name);
        const newPhoneInput = prompt("Edit phone:", phone);
        if (newNameInput && newPhoneInput) {
            loading = true;
            try {
                await fetch(`/api/contacts/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newNameInput, phone: newPhoneInput })
                });
                await loadContact();
            } catch (e) {
                console.error(e);
            } finally {
                loading = false;
            }
        }
    }

    async function deleteContact(id) {
        loading = true;
        try {
            await fetch(`/api/contacts/${id}`, { method: "DELETE" });
            await loadContact();
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    onMount(loadContact);
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
  <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
    <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">
      📇 Contact App
    </h1>

    <!-- Input Section -->
    <div class="space-y-3">
      <input
        type="text"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Name"
        bind:value={newName}
      />
      <input
        type="text"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Phone"
        bind:value={newPhone}
      />
      <button
        class="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        on:click={addContact}
        disabled={loading || !newName || !newPhone}
      >
        {#if loading}
          Adding...
        {:else}
          Add Contact
        {/if}
      </button>
    </div>

    <!-- Contacts List -->
    <div class="mt-6 space-y-3">
      {#if loading}
        <div class="flex justify-center items-center py-6">
          <span class="text-blue-500 font-semibold">Loading contacts...</span>
        </div>
      {:else}
        {#if contacts.length === 0}
          <p class="text-gray-500 text-center">No contacts yet. Add one!</p>
        {/if}

        {#each contacts as c}
          <div class="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <p class="font-semibold text-gray-700">{c.name}</p>
              <p class="text-gray-500 text-sm">{c.phone}</p>
            </div>
            <div class="space-x-2">
              <button title="Edit" class="cursor-pointer" on:click={() => updateContact(c._id, c.name, c.phone)}><Edit size="24" color="#5797db" variant="Linear"/></button>
              <button title="Delete" class="cursor-pointer text-red-500" on:click={() => deleteContact(c._id)}><Trash size="24" color="#ff0000" variant="TwoTone"/></button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
